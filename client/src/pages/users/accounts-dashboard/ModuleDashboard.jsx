import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, TextField  } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import AdminDashboard from '@/components/AdminDashboard';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export default function ModuleDashboard() {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [checkUser, setCheckUser] = useState()
    
    const navigate = useNavigate()
   useEffect(() => {
        async function checkUser() {
            try {
                const res = await fetch(`${API_URL}/api/user/profile`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    navigate("/user/login");
                    return;
                }
                const data = await res.json();

                if (data.role === "client") {
                    navigate("/");
                    return;
                }

                setCheckUser(data)

            } catch (err) {
                if (axios.isAxiosError(err) && err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        navigate("/user/login");
                    }
                } else {
                    console.error(err);
                }
            }
        }

        checkUser();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/module/get-all-user-info`);
                if (response.headers['content-type'].includes('application/json')) {
                    const data = response.data;
                    if (Array.isArray(data)) {
                        setUserData(data);
                    } else {
                        setError('Unexpected data format received');
                    }
                } else {
                    setError('Received an HTML response instead of JSON');
                }
            } catch (error) {
                console.error('Error fetching user data', error);
                setError('Error fetching user data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!Array.isArray(userData)) {
        return <div>No user data available</div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    
    const columns = [
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'unit', headerName: 'Quiz Name', width: 200 },
        { field: 'score', headerName: 'Score', width: 120 },
        { field: 'perfect_score', headerName: 'Perfect Score', width: 150 },
        { field: 'passed', headerName: 'Passed', width: 150 },
        { field: 'attempt_number', headerName: 'Attempts', width: 120 },
        {field: 'completion_date',headerName: 'Date Completed',width: 180,}
    ];

    const filteredRows = userData.filter((user) => {
        const searchTerm = selectedFilter.toLowerCase();
        return (
            user.email.toLowerCase().includes(searchTerm) ||
            user.unit.toLowerCase().includes(searchTerm)
        );
    });

    // Data for DataGrid
    const rows = filteredRows.map((user, index) => ({
        id: index,
        email: user.email,
        unit: user.unit,
        score: user.score,
        perfect_score: user.perfect_score,
        passed: user.passed,
        attempt_number: user.attempt_number,
        completion_date: formatDate(user.completion_date),
    }));
    return (
        <div className="mt-14 h-screen text-sm">
            <AdminDashboard />
            <section className="mt-8">
                <MaxWidthWrapper>
                    <Box sx={{ marginBottom: 2 }}>
                        {/* Search Control */}
                        <TextField
                            label="Search"
                            variant="outlined"
                            fullWidth
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            placeholder="Search by email or quiz name"
                        />
                    </Box>


                    <Box sx={{ height: ' 100%', width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10, 20]}
                            disableSelectionOnClick
                        />
                    </Box>
                </MaxWidthWrapper>
            </section>
        </div>
    );
}
