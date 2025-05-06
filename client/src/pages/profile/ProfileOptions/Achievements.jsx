import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Achievements() {
    const navigate = useNavigate();
    const [achievementsData, setAchievementsData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Effect for fetching user data
    useEffect(() => {
        async function fetchUser() {
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
                setUserData(data);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.message);
                if (err.response?.status === 401) {
                    navigate("/user/login");
                }
            }
        }

        fetchUser();
    }, [navigate]);

    // Effect for fetching achievements data when userData is available
    useEffect(() => {
        if (!userData?.id) return;

        async function fetchAchievements() {
            setLoading(true);
            try {
                const achievementsRes = await axios.get(
                    `${API_URL}/api/module/achievements/${userData.id}`
                );
                
                if (achievementsRes.data.success) {
                    setAchievementsData(achievementsRes.data.data);
                } else {
                    setError("Failed to load achievements data");
                }
            } catch (err) {
                console.error("Error fetching achievements:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchAchievements();
    }, [userData?.id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    if (!userData || !achievementsData) {
        return <p>No data available</p>;
    }

    return (
        <div className="xl:h-full">
            <section className="h-[30%] mt-6 text-sm">
                <form className="flex flex-col gap-4">
                    <section className="flex md:flex-row flex-col justify-between gap-4">
                        <div className="w-fit">
                            <label>Your Profile Picture</label>
                            <div className="mt-3 flex justify-center items-center flex-col p-2 rounded-2xl border-2 border-dashed border-gray-500 bg-gray-200">
                                <img
                                    src={
                                        userData.image
                                            ? `data:${userData.file_mime_type};base64,${userData.image}`
                                            : "/Icons/AddPic.png"
                                    }
                                    className="h-24 w-24 object-cover rounded-full"
                                    alt="Profile Picture"
                                />
                            </div>
                        </div>
                        <div className="xl:w-[85%] md:w-[80%]">
                            <section className="flex flex-row gap-x-5 mb-2">
                                <div className="w-[48%] flex flex-col gap-2">
                                    <label>Name</label>
                                    <p className="md:h-10 h-8 py-2.5 rounded px-2 bg-gray-100 shadow">
                                        {userData?.name || "Please edit name"}
                                    </p>
                                </div>
                                <div className="w-[48%] flex flex-col gap-2">
                                    <label>Last name</label>
                                    <p className="md:h-10 h-8 py-2.5 rounded px-2 bg-gray-100 shadow">
                                        {userData?.lastname || "Please edit last name"}
                                    </p>
                                </div>
                            </section>
                            <section className="flex flex-row gap-5">
                                <div className="w-[48%] flex flex-col gap-2">
                                    <label>Email</label>
                                    <p className="md:h-10 h-8 py-2.5 rounded px-2 bg-gray-100 shadow">
                                        {userData?.email || "Please edit email"}
                                    </p>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className="w-full border-b-2 bg-gray-200"></section>
                </form>
            </section>

            {/* Achievement Badge Section */}
            <section className="h-[60%] mt-6 overflow-y-auto">
                <h2 className="text-lg font-semibold">Badges</h2>
                <div className="mt-4 flex flex-col">
                    {achievementsData.achievements.length > 0 ? (
                        <ul className="h-full flex flex-row gap-20 items-center flex-wrap ">
                            {achievementsData.achievements.map((badge, index) => (
                                <li key={index}>
                                    <p className="text-xs">{badge?.name}</p>
                                    <img 
                                        src={`data:image/png;base64,${badge?.achievement_image_data}`} 
                                        alt={badge?.name} 
                                        style={{ width: '100px', height: '100px' }} 
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No completed modules yet.</p>
                    )}
                </div>
            </section>
        </div>
    );
}