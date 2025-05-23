import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Dashboard = ({ wrongAnswers, isQuizCompleted, module_id, user_id, score, timeSpent, perfect_score, completed }) => {
  const [aiResponse, setAiResponse] = useState([]);

  const passingScore = 0.5;

  const saveQuizProgress = async (aiData) => {
    const feedbackText = aiData.length > 0
      ? aiData.map(
        (answer) =>
          `Question: ${answer.question}\nYour Answer: ${answer.user_answer}\nCorrect Answer: ${answer.correct_answer}\nExplanation: ${answer.explanation || "N/A"}`
      ).join("\n\n")
      : "Perfect score! No incorrect answers.";

    const progressData = {
      user_id,
      module_id,
      score: score === perfect_score ? perfect_score : score,
      timeSpent,
      completed,
      passed: score >= perfect_score * passingScore,
      attempt_number: 1,
      feedback: feedbackText,
      perfect_score
    };

    try {
      await axios.post(`${API_URL}/api/module/update-module-score`, progressData);
    } catch (error) {
      console.error("Error saving quiz progress:", error);
    }
  };

  // ✅ Move fetchAiResponse here
  const fetchAiResponse = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/dashboard/allDashboards`, {
        wrongAnswers,
      });
      const aiData = response.data;
      setAiResponse(aiData);

      // Save quiz progress after fetching AI response
      await saveQuizProgress(aiData);
    } catch (error) {
      await saveQuizProgress([]);
    }
  };

  // ✅ Call fetchAiResponse when quiz is completed
  useEffect(() => {
    if (!isQuizCompleted) return;
    fetchAiResponse();
  }, [isQuizCompleted, wrongAnswers]);

  return (
    <div className=" w-[90%] m-auto py-6">
      {score === perfect_score ? "" :
        <div>
          <h3 className="text-3xl mb-2">Reviewer</h3>
          <p className="mb-10">Reviewer is save on profile check it out.</p>
        </div>
      }
      {
        isQuizCompleted ? (
          score === perfect_score ? (
            <p className="text-green-500 text-center font-bold">Perfect score! Congratulations!</p>
          ) : aiResponse.length > 0 ? (
            <div>
              <h2 className="mb-4">Your Incorrect Answers:</h2>
              <ul className="space-y-4">
                {aiResponse.map((answer, index) => (
                  <li
                    key={index}
                    className="p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-xl transition-all"
                  >
                    <div className="mb-2">
                      <strong className="text-lg font-semibold text-gray-800">Question:</strong>
                      <p className="text-gray-700 mt-1">{answer.question}</p>
                    </div>
                    <div className="mb-2">
                      <strong className="text-lg font-semibold text-gray-800">Your Answer:</strong>
                      <p className="text-gray-700 mt-1">{answer.user_answer}</p>
                    </div>
                    <div className="mb-2">
                      <strong className="text-lg font-semibold text-gray-800">Correct Answer:</strong>
                      <p className="text-gray-700 mt-1">{answer.correct_answer}</p>
                    </div>
                    {answer.explanation && (
                      <div className="mt-2">
                        <strong className="text-lg font-semibold text-gray-800">Explanation:</strong>
                        <p className="text-gray-700 mt-1">{answer.explanation}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Loading explanations...</p>
          )
        ) : null
      }
    </div >
  );
};

export default Dashboard;
