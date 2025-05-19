import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "@/components/AdminDashboard";
import { DataGrid } from "@mui/x-data-grid";
import { InputLabel, FormControl, Select, MenuItem, Box, CircularProgress, TextField } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AccountsDashboard() {
    const [dashboardData, setDashboardData] = useState({
        users: [],
        modules: [],
        totalModules: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [checkUser, setCheckUser] = useState({});

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

                setCheckUser(data);
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
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/user/accounts-dashboard`, {
                    withCredentials: true,
                });
                setDashboardData(response.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (checkUser.id) {
            fetchDashboardData();
        }
    }, [checkUser.id]);

    const filteredAccounts = dashboardData.users.filter((account) => {
        const matchesSearchTerm =
            (account.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (account.role?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (account.type?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        return matchesSearchTerm;
    });

    const handleRoleChange = async (email, newRole) => {
        try {
            await axios.put(
                `${API_URL}/api/user/updateRole`,
                { email, role: newRole },
                { withCredentials: true }
            );
            setDashboardData(prev => ({
                ...prev,
                users: prev.users.map(account =>
                    account.email === email ? { ...account, role: newRole } : account
                )
            }));
            alert("Role updated successfully!");
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Failed to update role. Please try again.");
        }
    };

    const rows = filteredAccounts.map((account, index) => ({
        id: index,
        user_id: account?.id || "Unknown",
        email: account.email || "N/A",
        role: account.role || "N/A",
        badges: account.badges || [],
        type: account.type || "Unverified"
    }));

    const columns = [
        { field: "email", headerName: "Email", width: 300 },
        { field: "role", headerName: "Role", width: 100 },
        { field: "type", headerName: "type", width: 100 },
        {
            field: "roleChange",
            headerName: "Change Role",
            width: 200,
            renderCell: (params) => (
                <FormControl fullWidth>
                    <Select
                        value={params.row.role || ""}
                        onChange={(e) => handleRoleChange(params.row.email, e.target.value)}
                        sx={{ fontSize: "0.875rem" }}
                    >
                        {[...new Set(dashboardData.users.map(acc => acc.role))].map((role, index) => (
                            <MenuItem key={index} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ),
        },
        {
            field: "badges",
            headerName: "Badges",
            minWidth: 200,
            flex: 1,
            renderCell: (params) => {
                const userBadges = params.row.badges || [];

                if (userBadges.length === 0) {
                    return <p>No badges earned</p>;
                }

                return (
                    <div className="flex justify-start gap-4 h-24 p-[5px]">
                        {userBadges.map((badge, index) => (
                            <div key={index} className="flex flex-col items-center gap-1 h-24">
                                {badge.achievement_image_data ? (
                                    <img
                                        src={`data:image/png;base64,${badge.achievement_image_data}`}
                                        alt={badge.name}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-xs">🏆</span>
                                    </div>
                                )}
                                <p className="text-xs">{badge.name}</p>
                            </div>
                        ))}
                    </div>
                );
            },
        }
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="mt-14 h-screen text-sm">
            <AdminDashboard />
            <section className="mt-8">
                <MaxWidthWrapper>
                    <Box sx={{ marginBottom: 2 }}>
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
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10, 20]}
                            checkboxSelection
                            disableSelectionOnClick
                            autoHeight
                            sx={{
                                boxShadow: 2,
                                border: 2,
                                borderColor: "grey.300",
                                borderRadius: 1,
                            }}
                        />
                    </div>
                </MaxWidthWrapper>
            </section>
        </div>
    );
}