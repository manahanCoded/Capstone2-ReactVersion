import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = ({ wrongAnswers, isQuizCompleted, userId, moduleId }) => {
  const [aiResponse, setAiResponse] = useState([]);

  // Define the passing score as a constant (70%)
  const passingScore = 0.7; 

  // Function to save user progress to the backend
  const saveQuizProgress = async (aiData) => {
    const score = calculateScore(aiData);
    const progressData = {
      userId, // Pass the userId as a prop
      moduleId, // Pass the moduleId as a prop
      score: score, // Custom function to calculate the score
      completed: true,
      passed: score >= passingScore, // Pass if score >= 70%
      attemptNumber: 1, // Replace with the actual attempt number logic
      feedback: aiData
        .map(
          (answer) =>
            `Question: ${answer.question}\nYour Answer: ${answer.user_answer}\nCorrect Answer: ${answer.correct_answer}\nExplanation: ${answer.explanation || "N/A"}`
        )
        .join("\n\n"),
    };

    try {
      if (score >= passingScore) {
        console.log("Passed!");
      }
      const response = await axios.post("http://localhost:5000/api/module/update-module-score", progressData);
      console.log("Progress saved successfully:", response.data.message);
    } catch (error) {
      console.error("Error saving quiz progress:", error);
    }
  };

  // Fetch AI response and save progress when the quiz is completed
  useEffect(() => {
    if (!isQuizCompleted) return;

    const fetchAiResponse = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/dashboard/allDashboards", {
          wrongAnswers,
        });
        const aiData = response.data;
        setAiResponse(aiData);

        // Save quiz progress after fetching AI response
        saveQuizProgress(aiData);
      } catch (error) {
        console.error("Error fetching AI response:", error);
      }
    };

    fetchAiResponse();
  }, [isQuizCompleted, wrongAnswers]);

  // Custom function to calculate the score
 const calculateScore = (aiData) => {
  // Your logic to calculate score
  return aiData.reduce((score, answer) => score + (answer.correct ? 1 : 0), 0);
};

  return (
    <div className="mt-14">
      {isQuizCompleted ? (
        <div>
          <h2>Your Incorrect Answers:</h2>
          <ul className="space-y-4">
            {aiResponse.length > 0 ? (
              aiResponse.map((answer, index) => (
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
              ))
            ) : (
              <p className="text-gray-500 text-center">Loading explanations...</p>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
