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
    const [units, setUnits] = useState([]);
    const [userScores, setUserScores] = useState([]);
    const [moduleName, setModuleName] = useState([]);
    const [badges, setBadges] = useState([]);
    const [checkUser, setCheckUser] = useState({});

    useEffect(() => {
        async function fetchUserProfile() { // Renamed to avoid conflict
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

        fetchUserProfile();
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

    useEffect(() => {
        if (!checkUser.id) return;

        async function fetchUnitsAndScores() {
            try {
                const [unitsRes, scoresRes, moduleData] = await Promise.all([
                    axios.get(`${API_URL}/api/module/allModule`),
                    axios.get(`${API_URL}/api/module/get-all-user-info`),
                    axios.get(`${API_URL}/api/module/allModule-storage`),
                ]);

                setUnits(unitsRes.data.listall);
                setUserScores(scoresRes.data);
                setModuleName(moduleData.data.success ? moduleData.data.listall : []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUnitsAndScores();
    }, [checkUser.id]);

    useEffect(() => {
        if (moduleName.length === 0 || units.length === 0 || userScores.length === 0) return;
    
        const userBadgesMap = {};
    
        userScores.forEach((score) => {
            if (!score.completed) return; // Only process completed modules
    
            const completedModule = units.find((module) => module.id === score.module_id);
            if (!completedModule) return;
    
            const moduleInfo = moduleName.find((module) => module.id === completedModule.storage_section_id);
            if (!moduleInfo) return;
    
            if (!userBadgesMap[score.user_id]) {
                userBadgesMap[score.user_id] = [];
            }
    
            const imageData = moduleInfo.achievement_image_data?.startsWith("data:image")
                ? moduleInfo.achievement_image_data
                : `data:image/png;base64,${moduleInfo.achievement_image_data}`;
    
            // Create a unique key to identify the badge
            const badgeKey = `${moduleInfo.name}-${imageData}`;
    
            // Prevent duplicates
            if (!userBadgesMap[score.user_id].some((badge) => `${badge.name}-${badge.achievement_image_data}` === badgeKey)) {
                userBadgesMap[score.user_id].push({
                    name: moduleInfo.name || "Unknown Badge",
                    achievement_image_data: imageData,
                });
            }
        });
    
console.log("✅ Final userBadgesMap (no duplicates):", JSON.stringify(userBadgesMap, null, 2));
        console.log("✅ Final userBadgesMap (no duplicates):", userBadgesMap);
        setBadges(userBadgesMap);
    }, [moduleName, units, userScores]);
    
    
    

    const rows = filteredAccounts.map((account, index) => {
        console.log("Processing account:", account); // Debugging
        console.log("Account ID:", account?.user_id); // See if `id` exists
    
        return {
            id: index,
            user_id: account?.id || "Unknown", // Prevent undefined values
            email: account.email || "N/A",
            role: account.role || "N/A",
            badges: badges[account?.id] || [], // Safely access `id`
        };
    });

console.table(accounts);
    
    



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
        {
            field: "badges",
            headerName: "Badges",
            width: 400,
            renderCell: (params) => {
                const userBadges = params.row.badges || []; // Get badges for this specific user
        
                if (userBadges.length === 0) {
                    return <p>No badges earned</p>;
                }
        
                return (
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {userBadges.map((badge, index) => (
                            <div key={index} style={{ textAlign: "center" }}>
                                <img
                                    src={badge.achievement_image_data}
                                    alt={badge.name || "Badge"}
                                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                />
                                <p style={{ fontSize: "12px", marginTop: "5px" }}>{badge.name}</p>
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