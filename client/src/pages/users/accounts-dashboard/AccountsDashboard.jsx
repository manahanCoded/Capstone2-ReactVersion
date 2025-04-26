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
        if (!moduleName?.length || !units?.length || !userScores?.length) return;
    
        const userCompletedModules = userScores.reduce((acc, score) => {
            if (!acc[score.user_id]) {
                acc[score.user_id] = new Set();
            }
            acc[score.user_id].add(score.module_id);
            return acc;
        }, {});
    
        const countedUnits = units.reduce((acc, unit) => {
            const id = unit.storage_section_id;
            acc[id] = (acc[id] || 0) + 1;
            return acc;
        }, {});
    

        const userBadgesMap = {};
        
        accounts.forEach(account => {
            const userId = account.id;
            const userModules = userCompletedModules[userId] || new Set();
            
            const userCompletedUnits = units.filter(module => 
                userModules.has(module.id)
            );

            const countedUnitsDone = userCompletedUnits.reduce((acc, unit) => {
                const id = unit.storage_section_id;
                acc[id] = (acc[id] || 0) + 1;
                return acc;
            }, {});
    
            const completedSections = [];
            for (const sectionId in countedUnits) {
                const total = countedUnits[sectionId];
                const done = countedUnitsDone[sectionId] || 0;
    
                if (done === total) {
                    completedSections.push(parseInt(sectionId));
                }
            }
    
            // Get achievements for completed sections
            userBadgesMap[userId] = completedSections
                .map(sectionId => 
                    moduleName.find(module => module?.id === sectionId)
                )
                .filter(item => item); // Remove undefined
        });
    
        setBadges(userBadgesMap);
    }, [moduleName, units, userScores, accounts]);




    const rows = filteredAccounts.map((account, index) => {
        return {
            id: index,
            user_id: account?.id || "Unknown",
            email: account.email || "N/A",
            role: account.role || "N/A",
            badges: badges[account?.id] || [],
            type: account.type || "Unverified"
        };
    });




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
            minWidth: 200,
            flex: 1,
            renderCell: (params) => {
                const userBadges = params.row.badges || [];

                if (userBadges.length === 0) {
                    return <p>No badges earned</p>;
                }

                return (
                    <div className="flex justify-start gap-4  h-24 p-[5px]">
                        {userBadges.map((badge, index) => (
                            <div key={index} className="flex  flex-col  items-center  gap-1 h-24 ">
                                        <img src={`data:image/png;base64,${badge?.achievement_image_data}`} alt={badge?.title} className="w-6 h-6 rounded-full object-cover"/>
                                <p className="text-xs">
                                    {badge.name}
                                </p>
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