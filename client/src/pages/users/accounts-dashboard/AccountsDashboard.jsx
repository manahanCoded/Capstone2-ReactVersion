import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useLocation, } from "react-router-dom";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "@/components/AdminDashboard";

export default function AccountsDashboard() {
    const [accounts, setAccounts] = useState([]);
    const location = useLocation();
    const pathName = location.pathname;
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [filterType, setFilterType] = useState("");
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
        const handleAccounts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/user/allUsers", {
                    withCredentials: true,
                });
                setAccounts(response.data);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        };

        handleAccounts();
    }, []);

    const filteredAccounts = accounts.filter((account) => {
        const matchesSearchTerm =
            (account.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (account.role?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (account.type?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesRoleFilter = filterRole ? account.role === filterRole : true;
        const matchesTypeFilter = filterType ? account.type === filterType : true;
        return matchesSearchTerm && matchesRoleFilter && matchesTypeFilter;
    });

    const handleRoleChange = async (email, newRole) => {
        try {
            await axios.put(
                "http://localhost:5000/api/user/updateRole",
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

    return (
        <div className="mt-14 h-screen text-sm">
            <AdminDashboard/>
            <section className="mt-8">
                <MaxWidthWrapper>
                    {/* Search Input */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by email, role, or type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    {/* Dropdown Filters */}
                    <div className="mb-4 flex gap-4">
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Filter by Role</option>
                            {[...new Set(accounts.map((account) => account.role))].map((role, index) => (
                                <option key={index} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Filter by Type</option>
                            {[...new Set(accounts.map((account) => account.type))].map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full ">
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Change Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAccounts.length > 0 ? (
                                    filteredAccounts.map((account, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-4 py-2">{account.email || "N/A"}</td>
                                            <td className="border border-gray-300 px-4 py-2">{account.role || "N/A"}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <select
                                                    value={account.role}
                                                    onChange={(e) => handleRoleChange(account.email, e.target.value)}
                                                    className="p-2 border border-gray-300 rounded-md"
                                                >
                                                    {[...new Set(accounts.map((acc) => acc.role))].map((role, index) => (
                                                        <option key={index} value={role}>
                                                            {role}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="border border-gray-300 px-4 py-2 text-center">
                                            No matching accounts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </MaxWidthWrapper>
            </section>
        </div>
    );
}
