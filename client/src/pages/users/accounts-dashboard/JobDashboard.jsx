import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, Box, TextField } from "@mui/material";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import AdminDashboard from "@/components/AdminDashboard";
import { useNavigate } from "react-router-dom";

export default function JobDashboards() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate()

    useEffect(() => {
        async function checkUser() {
            try {
                const res = await fetch("http://localhost:5000/api/user/profile", {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) {
                    navigate("/user/login");
                    return;
                }
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
        const fetchJobs = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/job/display");
                const data = await response.json();
                setJobs(data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter((job) =>
        job.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "title", headerName: "Title", width: 150 },
        { field: "name", headerName: "Name", width: 150 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "phone", headerName: "Phone", width: 150 },
        { field: "salary", headerName: "Salary", width: 120 },
        { field: "city", headerName: "City", width: 150 },
        { field: "state", headerName: "State", width: 150 },
        {
            field: "file_data",
            headerName: "Image",
            width: 150,
            renderCell: (params) =>
                params.value ? (
                    <img
                        src={params.value}
                        alt="Job Image"
                        style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                ) : (
                    "No Image"
                ),
        },
    ];


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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by email or quiz name"
                        />
                    </Box>
                    <div className="w-full">
                        <DataGrid
                            rows={jobs}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10, 20, 50]}
                            autoHeight
                            loading={loading}
                        />
                   </div>
                </MaxWidthWrapper>
            </section>
        </div>

    );
};


