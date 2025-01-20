import axios from "axios";
import { useEffect, useState } from "react";
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Link } from "react-router-dom";

export default function Dashboard(review) {
    const [checkUser, setCheckUser] = useState(null);
    const [checkModules, setCheckModules] = useState([]);
    const [checkScores, setCheckScores] = useState([]);
    const [completedScores, setCompletedScores] = useState([]);

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch("http://localhost:5000/api/user/profile", {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            setCheckUser(data);
        }
        fetchUser();
    }, []);

    useEffect(() => {
        async function getModule() {
            try {
                const res = await axios.get("http://localhost:5000/api/module/allModule");
                setCheckModules(res.data.listall);
            } catch (error) {
                console.error("Error fetching modules:", error);
            }
        }
        getModule();
    }, []);

    useEffect(() => {
        if (checkUser) {
            async function getScore() {
                try {
                    const res = await axios.get(`http://localhost:5000/api/module/get-user-score/${checkUser?.id}`);
                    setCheckScores(res.data);
                } catch (error) {
                    console.error("Error fetching scores:", error);
                }
            }
            getScore();
        }
    }, [checkUser]);

    useEffect(() => {
        const completed = checkScores.filter((score) => score.completed);
        setCompletedScores(completed);
    }, [checkScores]);

    const completedModulesCount = checkScores.filter(score => score.completed).length;
    const uncompletedModuleCount = checkModules.length - completedModulesCount;

    const failedModules = checkModules.filter((module) => {
        const failedScores = checkScores.find((score) => score.module_id === module.id)?.passed === false;
        return failedScores;
    });

    const passedModules = checkModules.filter((module) => {
        const passedScores = checkScores.find((score) => score.module_id === module.id)?.passed === true;
        return passedScores;
    });

    const formatTimeSpent = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}m ${seconds}s`;
    };

    return (
        <div className="w-full flex flex-wrap items justify-evenly gap-6 py-4 ">
            <section className="w-[40%] py-4 px-6 border-[1px] rounded-md hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
                <h2 className="text-xl font-semibold mb-2">Completed Quizzes</h2>
                <PieChart
                    colors={['blue', 'green']}
                    series={[
                        {
                            data: [
                                { id: 0, value: uncompletedModuleCount, label: `Uncompleted ${uncompletedModuleCount}` },
                                { id: 1, value: completedModulesCount, label: `Completed ${completedModulesCount}` },
                            ],
                            innerRadius: 40,
                            highlightScope: { fade: 'global', highlight: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            paddingAngle: 1,
                        },
                    ]}
                    width={450}
                    height={200}
                />
            </section>

            <section className="w-[40%] h-96  py-4 px-6 border-[1px] rounded-md overflow-y-auto hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
                <h2 className="text-xl font-semibold mb-2">Quiz Scores</h2>
                {checkModules
                    .filter((module) =>
                        checkScores.some((score) => score.module_id === module.id && score.score !== undefined)
                    )
                    .map((module, index) => (
                        <div className="flex flex-col justify-between mb-2 border-b-[1px] py-2" key={index}>
                            <p className="text-gray-400 mb-2">
                                {module.title}
                            </p>
                            <div className="flex flex-row justify-between">
                            <p>
                                {checkScores.find((score) => score.module_id === module.id)?.score}/{checkScores.find((score) => score.module_id === module.id)?.perfect_score}
                            </p>
                            <p>
                                Time Spent: {formatTimeSpent(checkScores.find((score) => score.module_id === module.id)?.time_spent || 0)}
                            </p>
                            </div>
                        </div>
                    ))}
            </section>

            <section className="w-[40%] py-4 px-6 border-[1px] rounded-md hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
                <h2 className="text-xl font-semibold mb-2">Failed Lessons</h2>
                {failedModules.map((module, index) => (
                    <div className="flex flex-col justify-between mb-2 border-b-[1px] py-2" key={index}>
                        <p className="text-gray-400 mb-2">
                            {module.title}
                        </p>
                        <div className="flex flex-row justify-between">
                        <p>
                            {checkScores.find((score) => score.module_id === module.id)?.score || (
                                <span>No Score</span>
                            )}/{checkScores.find((score) => score.module_id === module.id)?.perfect_score || (
                                <span>Quiz not taken</span>
                            )}
                        </p>
                        <p>
                            Time Spent: {formatTimeSpent(checkScores.find((score) => score.module_id === module.id)?.time_spent || 0)}
                        </p>
                        </div>
                        <Link to={`/modules/docs/${module.id}`}
                            className="self-end py-2 px-4 bg-red-500 w-fit rounded-lg text-sm text-white cursor-pointer hover:bg-red-800"
                        >
                            Review
                        </Link>
                    </div>
                ))}
            </section>

            <section className="w-[40%] py-4 px-6 border-[1px] rounded-md hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
                <h2 className="text-xl font-semibold mb-2">Passed Lessons</h2>
                {passedModules.length > 0 ? passedModules.map((module, index) => (
                    <div className="flex flex-col justify-between mb-2 border-b-[1px] py-2" key={index}>
                        <p className="text-gray-400 mb-2">
                            {module.title}
                        </p>
                        <div className="flex flex-row justify-between">
                        <p>
                            {checkScores.find((score) => score.module_id === module.id)?.score || (
                                <span>No Score</span>
                            )}/{checkScores.find((score) => score.module_id === module.id)?.perfect_score || (
                                <span>Quiz not taken</span>
                            )}
                        </p>
                        <p>
                            Time Spent: {formatTimeSpent(checkScores.find((score) => score.module_id === module.id)?.time_spent || 0)}
                        </p>
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col justify-between mb-2 border-b-[1px] py-2">
                        <p className="text-lg text-red-500">
                            No Quizzes Passed
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
