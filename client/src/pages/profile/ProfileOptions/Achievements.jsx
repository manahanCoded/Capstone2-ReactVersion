import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Achievements() {
    const navigate = useNavigate();
    const [units, setUnits] = useState([]);
    const [userScores, setUserScores] = useState([]);
    const [moduleName, setModuleName] = useState([]);
    const [badges, setBadges] = useState([]);
    const [checkUser, setCheckUser] = useState({});
    const [loading, setLoading] = useState(true);

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
                setCheckUser(data);
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
                navigate("/user/login");
            }
        }
        fetchUser();
    }, [navigate]);

    useEffect(() => {
        if (!checkUser.id) return;

        async function fetchUnitsAndScores() {
            try {
                const [unitsRes, scoresRes, moduleData] = await Promise.all([
                    axios.get(`${API_URL}/api/module/allModule`),
                    axios.get(`${API_URL}/api/module/get-user-score/${checkUser.id}`),
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
        if (moduleName?.length && units?.length && userScores?.length) {
            const completedModules = units.filter((module) =>
                userScores.some((score) => score.module_id === module.id )
            );

            const countedUnits = units.reduce((acc, unit) => {
                const id = unit.storage_section_id;
                acc[id] = (acc[id] || 0) + 1;
                return acc;
            }, {});


            const countedUnitsDone = completedModules.reduce((acc, unit) => {
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

            const getAchievements = completedSections
                .map((completedModule) =>
                    moduleName.find((module) => module?.id === completedModule)
                )
                .filter((item, index, self) => item && index === self.findIndex((m) => m?.id === item?.id));

            setBadges(getAchievements);
        }
    }, [moduleName, units, userScores]);




    if (loading) {
        return <p>Loading...</p>;
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
                                        checkUser.image
                                            ? `data:${checkUser.file_mime_type};base64,${checkUser.image}`
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
                                        {checkUser?.name ? checkUser.name : "Please edit name"}
                                    </p>
                                </div>
                                <div className="w-[48%] flex flex-col gap-2">
                                    <label>Last name</label>
                                    <p className="md:h-10 h-8 py-2.5 rounded px-2 bg-gray-100 shadow">
                                        {checkUser?.lastname ? checkUser.lastname : "Please edit last name"}
                                    </p>
                                </div>
                            </section>
                            <section className="flex flex-row gap-5">
                                <div className="w-[48%] flex flex-col gap-2">
                                    <label>Email</label>
                                    <p className="md:h-10 h-8 py-2.5 rounded px-2 bg-gray-100 shadow">
                                        {checkUser?.email ? checkUser.email : "Please edit email"}
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
                    {badges.length > 0 ? (
                        <ul className="h-full flex flex-row gap-20 items-center flex-wrap ">
                            {badges.map((badges, index) => (
                                <li key={index}>
                                    <p className="text-xs">{badges?.name}</p>

                                    <img src={`data:image/png;base64,${badges?.achievement_image_data}`} alt={badges?.title} style={{ width: '100px', height: '100px' }} />

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