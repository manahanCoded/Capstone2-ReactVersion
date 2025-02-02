import "quill/dist/quill.snow.css";
import axios from "axios";
import { useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Reviewer() {
    const [checkUser, setCheckUser] = useState(null);
    const [checkModules, setCheckModules] = useState([]);
    const [checkScores, setCheckScores] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
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

    const renderFeedbackItem = (feedback) => {
        if (!feedback.trim()) return null;

        const [question, rest] = feedback.split("Your Answer:");
        const [userAnswer, rest2] = rest?.split("Correct Answer:") || ["", ""];
        const [correctAnswer, explanation] = rest2?.split("Explanation:") || ["", ""];

        return (
            <div className="feedback-item mb-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg shadow-sm">
                <p className="text-gray-800">
                    <strong>Question:</strong> {question.trim()}
                </p>
                <p className="text-gray-800">
                    <strong>Your Answer:</strong> {userAnswer.trim()}
                </p>
                <p className="text-gray-800">
                    <strong>Correct Answer:</strong> {correctAnswer.trim()}
                </p>
                <p className="text-gray-800">
                    <strong>Explanation:</strong> {explanation.trim()}
                </p>
            </div>
        );
    };

    const renderModuleDetails = () => {
        if (!selectedModule) {
            return (
                <div className="p-6 text-center text-gray-600">
                    <p className="text-lg italic">Select a module to view details.</p>
                </div>
            );
        }

        const moduleScore = checkScores.find((score) => score.module_id === selectedModule.id);

        return (
            <div className="w-full p-6 bg-white shadow-lg rounded-lg">
                <h2
                    className="text-2xl font-semibold text-gray-800 mb-4"
                    dangerouslySetInnerHTML={{ __html: selectedModule.title }}
                ></h2>
                <p
                    className="text-gray-600 mb-6 ql-editor"
                    dangerouslySetInnerHTML={{ __html: selectedModule.description }}
                ></p>
                <p
                    className="text-gray-600 mb-6 ql-editor"
                    dangerouslySetInnerHTML={{ __html: selectedModule.information }}
                ></p>

                {moduleScore ? (
                    <div className="flex flex-col gap-4">
                        <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
                            <p className="text-gray-700">
                                <strong>Score:</strong> {moduleScore.score} / {moduleScore.perfect_score}
                            </p>
                            <p className="text-gray-700">
                                <strong>Attempt Number:</strong> {moduleScore.attempt_number}
                            </p>
                            <p className="text-gray-700">
                                <strong>Passed:</strong>{" "}
                                <span
                                    className={`font-semibold ${moduleScore.passed ? "text-green-600" : "text-red-600"}`}
                                >
                                    {moduleScore.passed ? "Yes" : "No"}
                                </span>
                            </p>
                        </div>

                        <div className="mt-4">
                            <p className="text-lg font-semibold text-gray-800">Feedback:</p>
                            <div className="feedback-section mt-2">
                                {moduleScore.feedback ? (
                                    moduleScore.feedback
                                        .split("Question: ")
                                        .slice(1) // Slice off the first empty entry from the split
                                        .map((feedbackItem, index) => renderFeedbackItem(feedbackItem, index)) // Pass feedbackItem and index
                                ) : (
                                    <p className="text-gray-600 italic">
                                        No feedback available for this module.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 text-gray-600">
                        <p className="text-lg font-semibold text-red-500">
                            No score or feedback available for this module.
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex xl:flex-row flex-col w-full min-h-screen rounded-lg ">
            <div className="xl:w-[25%]">
                <div className="xl:hidden ">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                    >
                        <span className="text-sm  text-gray-800">Modules</span>
                        {isOpen ? <ExpandMoreIcon size={20} /> : <ExpandLessIcon size={20} />}
                    </button>
                </div>

                <div className={`sticky md:h-[90vh] top-16 w-full  pb-32 bg-white rounded-l-lg border-gray-200 p-4 overflow-y-auto shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]
                ${isOpen ? "block" : "hidden"} xl:block`}
                >
                    <h1 className="text-xl font-bold text-gray-800 mb-4 md:block hidden">Modules</h1>
                    <ul className="space-y-2">
                        {checkModules.map((module) => (
                            <li
                                key={module.id}
                                onClick={() => {
                                    setSelectedModule(module);
                                    setIsOpen(false); 
                                }}
                                className={`cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition ${selectedModule?.id === module.id
                                        ? "bg-gray-200 font-semibold"
                                        : "bg-white"
                                    }`}
                            >
                                <span>{module.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Section */}
            <div className="xl:mt-0 mt-4 xl:w-3/4 w-full xl:pl-4 ">
                {renderModuleDetails()}
            </div>
        </div>
    );
}
