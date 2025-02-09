import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "@/components/AdminDashboard";
import { DataGrid } from "@mui/x-data-grid";
import { InputLabel, FormControl, Select, MenuItem, Box, CircularProgress, TextField } from "@mui/material";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export default function AccountsDashboard() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

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
        const handleAccounts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/user/allUsers`, {
                    withCredentials: true,
                });
                setAccounts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching accounts:", error);
                setLoading(false);
            }
        };

        handleAccounts();
    }, []);

    const filteredAccounts = accounts.filter((account) => {
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
            setAccounts((prevAccounts) =>
                prevAccounts.map((account) =>
                    account.email === email ? { ...account, role: newRole } : account
                )
            );
            alert("Role updated successfully!");
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Failed to update role. Please try again.");
        }
    };

    const columns = [
        { field: "email", headerName: "Email", width: 300 },
        { field: "role", headerName: "Role", width: 300 },
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
                        {[...new Set(accounts.map((acc) => acc.role))].map((role, index) => (
                            <MenuItem key={index} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ),
        },
    ];

    const rows = filteredAccounts.map((account, index) => ({
        id: index,
        email: account.email || "N/A",
        role: account.role || "N/A",
        emailChange: account.email,
        roleChange: account.role,
    }));

    // Show loading spinner while data is being fetched
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
                    {/* Search Input */}
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

                    {/* DataGrid Table */}
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
