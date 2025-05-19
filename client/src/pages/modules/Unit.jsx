import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Footer from "@/components/Footer";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { Tooltip } from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Unit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [checkUser, setCheckUser] = useState(null);
    const [units, setUnits] = useState([]);
    const [userScores, setUserScores] = useState([]);
    const [moduleName, setModuleName] = useState(null);
    const [userCompletions, setUserCompletions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState([]);
    const [achievementPopup, setAchievementPopup] = useState({
        open: false,
        achievement: null
    });

    useEffect(() => {
        let isMounted = true;
        async function checkUserStatus() {
            try {
                const res = await fetch(`${API_URL}/api/user/profile`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!isMounted) return;
                if (!res.ok) {
                    navigate("/user/login");
                    return;
                }
                const data = await res.json();
                setCheckUser(data);
                return data;
            } catch (err) {
                navigate("/user/login");
                return null;
            }
        }

        async function initialize() {
            const user = await checkUserStatus();
            if (user && id) {
                await fetchInitialData(user.id);
            }
            return () => {
                isMounted = false;
            };
        }
        initialize();
    }, [navigate, id]);

    const fetchingRef = useRef(false);
    // Replace your fetchInitialData function with this:
    const fetchInitialData = useCallback(async (userId) => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;
        setLoading(true);

        try {
            const response = await axios.get(`${API_URL}/api/module/unit-data/${userId}/${id}`);

            setUnits(response.data.units || []);
            setUserScores(response.data.scores || []);
            setUserCompletions(response.data.completions || []);
            setQuizzes(response.data.quizzes || []); // Add this line to track which units have quizzes

            if (response.data.module) {
                setModuleName({
                    ...response.data.module,
                    file_url: response.data.module.file_data
                        ? `data:image/png;base64,${response.data.module.file_data}`
                        : null,
                    achievement_url: response.data.module.achievement_image_data
                        ? `data:image/png;base64,${response.data.module.achievement_image_data}`
                        : null,
                });
            }

            // Check if ALL units are completed (considering quizzes)
            const allUnitsCompleted =
                response.data.units.length > 0 && response.data.units.every(unit => {
                    const hasQuiz = response.data.quizzes.includes(unit.id);

                    if (hasQuiz) {
                        // For units with quizzes, check if the user has completed the quiz
                        return response.data.scores.some(score =>
                            score.module_id === unit.id && score.completed  
                        );
                    } else {
                        // For units without quizzes, check if the user has marked it as completed
                        return response.data.completions.some(completion =>
                            completion.module_id === unit.id && completion.completed
                        );
                    }
                });


            if (allUnitsCompleted) {
                setAchievementPopup({
                    open: true,
                    achievement: {
                        id: response.data.module.id,
                        name: response.data.module.name,
                        achievement_image_data: response.data.module?.achievement_image_data || null
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            fetchingRef.current = false;
            setLoading(false);
        }
    }, [id]);


    const handleClosePopup = () => {
        setAchievementPopup({ open: false, achievement: null });
    };


    const getCompletionStatus = (moduleId) => {
        const hasQuiz = quizzes.includes(moduleId);

        if (hasQuiz) {
            return userScores.some(score =>
                score.module_id === moduleId && score.completed
            );
        } else {
            return userCompletions.some(completion =>
                completion.module_id === moduleId && completion.completed
            );
        }
    };

    const isModuleCompleted = useMemo(() => {
        return units.length > 0 && units.every(unit => getCompletionStatus(unit.id));
    }, [units, userScores]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    if (!moduleName) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-red-500 text-lg">Module not found</p>
            </div>
        );
    }

    return (
        <div className="h-screen mt-14">
            {/* Achievement Popup */}
            <Dialog
                open={achievementPopup.open}
                onClose={handleClosePopup}
                maxWidth="sm"
                fullWidth
                className="z-[100]"
            >
                <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-red-50 to-red-100">
                    <span className="text-xl font-bold text-red-900">Achievement Unlocked!</span>
                    <IconButton onClick={handleClosePopup}>
                        <CloseIcon className="text-red-900" />
                    </IconButton>
                </DialogTitle>
                <DialogContent className="text-center p-6 bg-gradient-to-b from-red-50 to-white">
                    {achievementPopup.achievement && (
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 mb-4 mt-14 animate-bounce rounded-full bg-gray-200 flex items-center justify-center">
                                {achievementPopup.achievement.achievement_image_data ? (
                                    <img
                                        src={`data:image/png;base64,${achievementPopup.achievement.achievement_image_data}`}
                                        alt="Achievement Badge"
                                        className="w-full h-full rounded-full"
                                    />
                                ) : (
                                    <span className="text-4xl">🏆</span>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-red-900">
                                {achievementPopup.achievement.name}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Congratulations! You've completed all units in this module.
                            </p>
                            <button
                                onClick={handleClosePopup}
                                className="px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-md"
                            >
                                Continue Learning
                            </button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Main Content */}
            <MaxWidthWrapper className="md:pr-0 bg-gray-50 shadow-sm">
                <section className="flex md:flex-row flex-col-reverse justify-center lg:ml-20 gap-6">
                    <div className="w-full mt-14">
                        <div>
                            <div className="w-full flex flex-row justify-between items-center">
                                <img
                                    className="h-5"
                                    draggable="false"
                                    src="/IMG_Modules/LOGO_maroon.png"
                                    alt="Logo"
                                />
                                {checkUser?.role === "admin" && (
                                    <Link
                                        to={`/modules/create-unit/${id}`}
                                        className="rounded-sm py-2 px-4 font-medium bg-[#333333] hover:bg-[#121212] text-white transition-colors"
                                    >
                                        Add Unit
                                    </Link>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-[2.5rem] text-red-900 break-words font-light mt-1">
                                    {moduleName.name}
                                </h1>
                            </div>
                            <p className="mt-4 text-sm">🛠️ Blockchain may seem tough now, but soon it'll click!</p>
                            <p className="mt-4">
                                Web3 is the next evolution of the internet, leveraging
                                decentralization, blockchain, and smart contracts to empower users with transparency,
                                security, and digital ownership.
                            </p>
                        </div>
                    </div>
                    <div className="lg:w-4/6 top-20">
                        <div className="md:h-[30rem] w-full relative">
                            {moduleName.file_url && (
                                <img
                                    className="absolute inset-0 aspect-[20/13] h-full z-10 shadow-md rounded-lg"
                                    draggable="false"
                                    src={moduleName.file_url}
                                    alt="Module Cover"
                                />
                            )}
                        </div>
                    </div>
                </section>
            </MaxWidthWrapper>

            <MaxWidthWrapper className="md:pr-0">
                <section className="flex md:flex-row flex-col justify-center lg:ml-20 gap-6">
                    <div className="relative w-full">
                        <div className="md:absolute overflow-hidden my-4 -top-40 inset-0 w-full h-64 rounded-lg p-4 bg-white shadow-md">
                            <h3 className="w-fit text-lg font-semibold text-[#333333] p-2 border-b-4 border-red-900">
                                Description
                            </h3>
                            <p className="h-24 overflow-y-auto my-6 text-sm text-gray-600 break-words">
                                {moduleName.description}
                            </p>
                            <div className="px-10 w-full flex justify-end self-center">
                                <a
                                    href="#start"
                                    className="px-4 py-2 text-white rounded-3xl text-sm bg-red-900 hover:bg-red-700 transition-colors"
                                >
                                    Get Started
                                </a>
                            </div>
                        </div>
                        <h4 id="start" className="md:mt-32 mb-8 text-4xl font-extralight">
                            Insights you'll uncover.
                        </h4>
                        {units.length > 0 ? (
                            <div className="flex flex-col gap-5 pb-8">
                                {units.map((unit, index) => {
                                    const isCompleted = getCompletionStatus(unit.id);
                                    const userScore = userScores.find(score => score.module_id === unit.id);
                                    return (
                                        <Link
                                            to={`/modules/units/docs/${unit.id}`}
                                            key={index}
                                            className="relative group flex flex-row items-center justify-between px-4 pr-8 py-6 rounded text-sm hover:bg-red-700 hover:text-white shadow-md transition-all duration-300"
                                        >
                                            {isCompleted && (
                                                <CheckCircleIcon
                                                    className="absolute right-1 -top-5"
                                                    style={{ height: "2.5rem", width: "2.5rem", color: "#22C55E" }}
                                                />
                                            )}
                                            <div className="flex flex-row items-center gap-6">
                                                <SchoolOutlinedIcon
                                                    className="group-hover:text-white text-red-900"
                                                    style={{ height: "2.5rem", width: "2.5rem" }}
                                                />
                                                <p className="text-lg font-medium line-clamp-1">
                                                    {unit?.title}
                                                </p>
                                            </div>
                                            <div className="flex flex-row items-center justify-end">
                                                {checkUser?.role === "admin" && (
                                                    <Link
                                                        to={`/modules/units/edit/${unit.id}`}
                                                        className="rounded-sm py-2 px-4 font-medium mr-2 border border-gray-300 hover:bg-[#333333] hover:text-white transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                No units found.
                            </div>
                        )}
                    </div>

                    <div className="lg:block mt-0.5 bg-gray-50 lg:w-4/6 rounded-lg shadow-sm">
                        <div className="h-64 p-8 border-b">
                            <h3 className="text-lg font-semibold text-red-900">
                                Achievements
                            </h3>
                            <p className="text-sm mt-2">
                                Badge you can earn by completing the module.
                            </p>
                            <div className="mt-4 h-[6rem] w-[6rem] relative">
                                {moduleName.achievement_url ? (
                                    <img
                                        className="absolute inset-0 w-full h-full object-cover z-10 rounded-full"
                                        src={moduleName.achievement_url}
                                        alt="Module Achievement"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">🏆</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <h3 className="px-8 pt-4 text-lg font-semibold text-[#333333]">
                            Completed Units
                        </h3>
                        {units.filter(unit => getCompletionStatus(unit.id)).length > 0 ? (
                            <div className="h-96 overflow-y-auto flex flex-col m-8 pr-2 border-b">
                                {units
                                    .filter(unit => getCompletionStatus(unit.id))
                                    .map((unit) => {
                                        const userScore = userScores.find(score => score.module_id === unit.id);
                                        const userCompletion = userCompletions.find(c => c.module_id === unit.id);

                                        return (
                                            <Link
                                                to={`/modules/units/docs/${unit.id}`}
                                                key={unit.id}
                                                className="border mb-2 border-gray-200 py-2 text-sm group rounded-md relative bg-white hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 ease-in-out"
                                            >
                                                <p className="px-4 text-sm line-clamp-1 font-semibold group-hover:text-red-600">
                                                    {unit?.title}
                                                </p>
                                                <div className="px-4 flex flex-row justify-between text-gray-500 mt-2">
                                                    {userScore ? (
                                                        <>
                                                            <p className={userScore.passed ? "text-green-500" : "text-red-500"}>
                                                                {userScore.passed ? "Passed" : "Failed"}
                                                            </p>
                                                            <p>Score: {userScore.score}/{userScore.perfect_score}</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-blue-500">Completed</p>
                                                        </>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 mb-8">
                                No completed units found.
                            </div>
                        )}

                    </div>
                </section>
            </MaxWidthWrapper>

            <Footer />
        </div>
    );
}