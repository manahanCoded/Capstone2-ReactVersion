import "quill/dist/quill.snow.css";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Reviewer() {
    const [checkUser, setCheckUser] = useState(null);
    const [checkModules, setCheckModules] = useState([]);
    const [checkScores, setCheckScores] = useState([]);

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


    const renderFeedback = () => {
        return checkModules.map((module) => {
            const moduleScore = checkScores.find((score) => score.module_id === module.id);
    
            return (
                <div
                    key={module.id}
                    className="w-full max-w-3xl bg-white shadow-md border border-gray-200 rounded-lg p-6 mb-6"
                >
                    {/* Module Title and Description */}
                    <div className="mb-4">
                        <h2
                            className="text-2xl font-semibold text-gray-800 mb-2"
                            dangerouslySetInnerHTML={{ __html: module.title }}
                        ></h2>
                        <p
                            className="text-gray-600"
                            dangerouslySetInnerHTML={{ __html: module.description }}
                        ></p>
                    </div>
    
                    {moduleScore ? (
                        <div className="flex flex-col gap-4">
                            {/* Score Details */}
                            <div className="bg-gray-100 rounded-lg p-4">
                                <p className="text-gray-700">
                                    <strong>Score:</strong> {moduleScore.score} /{" "}
                                    {moduleScore.prefect_score}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Attempt Number:</strong> {moduleScore.attempt_number}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Passed:</strong>{" "}
                                    <span
                                        className={`font-semibold ${
                                            moduleScore.passed ? "text-green-600" : "text-red-600"
                                        }`}
                                    >
                                        {moduleScore.passed ? "Yes" : "No"}
                                    </span>
                                </p>
                            </div>
    
                            {/* Feedback Section */}
                            <div className="mt-4">
                                <p className="text-lg font-semibold text-gray-800">Feedback:</p>
                                <div className="feedback-section mt-2">
                                    {moduleScore.feedback ? (
                                        moduleScore.feedback
                                            .split("Question: ")
                                            .map((feedbackItem, index) => {
                                                if (!feedbackItem.trim()) return null;
    
                                                const [question, rest] = feedbackItem.split(
                                                    "Your Answer:"
                                                );
                                                const [userAnswer, rest2] =
                                                    rest?.split("Correct Answer:") || ["", ""];
                                                const [correctAnswer, explanation] =
                                                    rest2?.split("Explanation:") || ["", ""];
    
                                                return (
                                                    <div
                                                        key={index}
                                                        className="feedback-item mb-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg"
                                                    >
                                                        <p className="text-gray-800">
                                                            <strong>Question:</strong> {question.trim()}
                                                        </p>
                                                        <p className="text-gray-800">
                                                            <strong>Your Answer:</strong>{" "}
                                                            {userAnswer.trim()}
                                                        </p>
                                                        <p className="text-gray-800">
                                                            <strong>Correct Answer:</strong>{" "}
                                                            {correctAnswer.trim()}
                                                        </p>
                                                        <p className="text-gray-800">
                                                            <strong>Explanation:</strong>{" "}
                                                            {explanation.trim()}
                                                        </p>
                                                    </div>
                                                );
                                            })
                                    ) : (
                                        <p className="text-gray-600 italic">
                                            No feedback available for this module.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // No Score or Feedback Section
                        <div className="mt-4 text-gray-600">
                            <p className="text-lg font-semibold text-red-500">
                                No score or feedback available for this module.
                            </p>
                        </div>
                    )}
                </div>
            );
        });
    };
    

    return (
        <div className="w-full flex flex-col items-center justify-evenly gap-6 py-4 overflow-y-auto h-full">
            <h1 className="text-2xl font-bold mb-6">Reviewer Section</h1>
            {renderFeedback()}
        </div>
    );
}