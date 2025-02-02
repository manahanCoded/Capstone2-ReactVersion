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
        <div className="w-full flex flex-wrap justify-center gap-6 bg-white py-8 rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
      {/* Completed Quizzes Section */}
      <section className="w-full lg:w-[45%] bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-2">Completed Quizzes</h2>
        <PieChart
          colors={["#333333", "red"]}
          series={[
            {
              data: [
                { id: 0, value: uncompletedModuleCount, label: `Uncompleted ${uncompletedModuleCount}` },
                { id: 1, value: completedModulesCount, label: `Completed ${completedModulesCount}` },
              ],
              innerRadius: 40,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              paddingAngle: 1,
            },
          ]}
          width={450}
          height={200}
        />
      </section>

      {/* Quiz Scores Section */}
      <section className="w-full lg:w-[45%] h-96 bg-white p-6 rounded-xl shadow-lg border border-gray-200 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quiz Scores</h2>
        {checkModules
          .filter((module) => checkScores.some((score) => score.module_id === module.id && score.score !== undefined))
          .map((module, index) => (
            <div
              className="flex justify-between items-center mb-3 p-4 bg-gray-50 rounded-lg border border-gray-300"
              key={index}
            >
              <p className="text-gray-600 font-medium">{module.title}</p>
              <div className="text-gray-700 text-xs">
                <p className="font-semibold">
                  {checkScores.find((score) => score.module_id === module.id)?.score} /
                  {checkScores.find((score) => score.module_id === module.id)?.perfect_score}
                </p>
                <p className="text-gray-500">Time Spent: {formatTimeSpent(checkScores.find((score) => score.module_id === module.id)?.time_spent || 0)}</p>
              </div>
            </div>
          ))}
      </section>

      {/* Failed Lessons Section */}
      <section className="w-full lg:w-[45%] bg-white p-6 rounded-xl shadow-lg border border-red-300">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">Failed Lessons</h2>
        {failedModules.map((module, index) => (
          <div className="flex flex-col mb-3 p-4 bg-red-50 rounded-lg border border-red-400" key={index}>
            <p className="text-red-600 font-medium">{module.title}</p>
            <div className="flex justify-between items-center text-gray-700">
              <p>
                {checkScores.find((score) => score.module_id === module.id)?.score || "No Score"} /
                {checkScores.find((score) => score.module_id === module.id)?.perfect_score || "Quiz not taken"}
              </p>
              <p>Time Spent: {formatTimeSpent(checkScores.find((score) => score.module_id === module.id)?.time_spent || 0)}</p>
            </div>
            <Link
              to={`/modules/units/docs/${module.id}`}
              className="mt-3 self-end px-4 py-2 bg-red-500 rounded-lg text-sm text-white cursor-pointer hover:bg-red-700"
            >
              Review
            </Link>
          </div>
        ))}
      </section>

      {/* Passed Lessons Section */}
      <section className="w-full lg:w-[45%] bg-white p-6 rounded-xl shadow-lg border border-green-300">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Passed Lessons</h2>
        {passedModules.length > 0 ? (
          passedModules.map((module, index) => (
            <div className="flex flex-col mb-3 p-4 bg-green-50 rounded-lg border border-green-400" key={index}>
              <p className="text-green-700 font-medium">{module.title}</p>
              <div className="flex justify-between items-center text-gray-700">
                <p>
                  {checkScores.find((score) => score.module_id === module.id)?.score || "No Score"} /
                  {checkScores.find((score) => score.module_id === module.id)?.perfect_score || "Quiz not taken"}
                </p>
                <p>Time Spent: {formatTimeSpent(checkScores.find((score) => score.module_id === module.id)?.time_spent || 0)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-500">No quizzes passed yet.</p>
        )}
      </section>
    </div>
    )
}
