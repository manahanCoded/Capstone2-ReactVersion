import React, { useState, useEffect } from "react";
import "quill/dist/quill.snow.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import CloseIcon from "@mui/icons-material/Close";
import Dashboard from "@/components/Dashboard";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function DocsPage() {
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState([]);
  const [previousPage, setPreviousPage] = useState([]);
  const [openNextPage, setOpenNextPage] =useState(false)
  const [openPreviousPage, setOpenPreviousPage] =useState(false)
  const navigate = useNavigate();
  const { id } = useParams();
  const [userId, setUserId] = useState(null);

  const [openQuiz, setOpenQuiz] = useState(false);
  const [itemQuiz, setItemQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);


  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        navigate("/user/login");
      } else {
        const userData = await res.json();
        setUserId(userData.id);
      }
    }
    checkUser();
  }, [navigate]);

  useEffect(() => {
    async function fetchModule() {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}/api/module/getPostId`, {
          ids: id,
        });
        if (response.data.success) {
          setPosts(response.data.listId);
        } else {
          console.error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching module:", error);
      }finally {
        setIsLoading(false); // End loading
      }
    }
    fetchModule();
  }, [id]);

  useEffect(() => {
    async function fetchNextUnits() {
      if (!posts?.[0]?.storage_section_id) {
        console.error("Posts or storage_section_id is undefined.");
        return;
      }
      try {
        
        const unitsRes = await axios.get(`${API_URL}/api/module/module-units/${posts[0].storage_section_id}`);
        const response = unitsRes.data.listall;

        if (Array.isArray(response)) {
          const nextUnits = response.findIndex(nextUnit => nextUnit.id === posts[0]?.id);
          if(nextUnits <= response.length){
            setNextPage(response[nextUnits + 1])
          }
          if (nextUnits + 1 < response.length) {
            setPreviousPage(response[nextUnits - 1])
          }
        } else {
          console.error("Data is not an array.");
        }
      } catch (error) {
        console.error("Error fetching next page:", error);
      }
    }
    fetchNextUnits();
  }, [posts]);

  useEffect(() => {
    if (posts.length > 0) {
      async function fetchQuestions() {
        try {
          const title = posts[0].id;
          const res = await axios.get(
            `${API_URL}/api/module/allQuestions?id=${encodeURIComponent(id)}`
          );
          setItemQuiz(res.data);
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      }
      fetchQuestions();
    }
  }, [posts]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    const currentQuestion = itemQuiz[currentQuestionIndex];
    if (selectedOption !== currentQuestion.correct_option) {
      setWrongAnswers((prev) => [
        ...prev,
        {
          module_title: currentQuestion.module_title,
          question: currentQuestion.question_text,
          user_answer: selectedOption || "N/A",
          user_answer_text: selectedOption
            ? currentQuestion?.[`option_${selectedOption.toLowerCase()}`] || "Unknown Answer"
            : "No Answer",
          correct_answer: currentQuestion.correct_option,
          correct_answer_text: currentQuestion[`option_${currentQuestion.correct_option.toLowerCase()}`],
        },
      ]);
    } else if (selectedOption) {
      setScore((prev) => prev + 1)
    }

    setSelectedOption(null);

    if (currentQuestionIndex < itemQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
      setIsQuizCompleted(true);
      setTimeout(() => {
        saveQuizProgress();
      }, 100);
    }
  };


  const handleQuizStart = () => {
    setQuizStartTime(new Date());  // Record the start time of the quiz
    setOpenQuiz(true);
  };

  const saveQuizProgress = async () => {

    const timeSpent = quizStartTime ? Math.floor((new Date() - quizStartTime) / 1000) : 0;

    const passed = score >= itemQuiz.length * 0.7 ? 1 : 0;

    const perfectScore = itemQuiz.length;

    const progressData = {
      user_id: userId,
      module_id: id,
      score,
      passed,
      attempt_number: 0,
      timeSpent,
      feedback: "",
      completed: true,
      perfect_score: perfectScore,
    };

    try {
      await axios.post(`${API_URL}/api/module/update-module-score`, progressData);
    } catch (error) {
      console.error("Error saving quiz progress:", error);
    }
  };


  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setWrongAnswers([]);
    setIsQuizCompleted(false);
  };

  return (
    <div className="mt-14">
      <MaxWidthWrapper className="py-14">
      {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin h-16 w-16 border-4 border-red-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
        <div className="lg:w-3/5 md:w-4/5 m-auto">
          {posts.map((post) => (
            <div key={post.id}>
              <h1 className="flex flex-col font-extrabold lg:text-5xl text-2xl leading-tight">
                <span className="font-bold text-red-900 text-lg">Introducing</span>
                {post.title}
              </h1>
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{ __html: post.description }}
              />
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{ __html: post.information }}
              />
            </div>
          ))}

          <div className="mt-10 flex flex-col md:flex-row md:justify-between items-center gap-4">
          {itemQuiz.length > 0 ?(
            <button
              className="w-full  md:h-12 h-10 flex items-center justify-center gap-2 font-semibold text-white rounded-lg bg-red-700 hover:bg-red-800 transition"
              onClick={handleQuizStart}
            >
              <img src="/IMG_Home/Quiz_white.png" className="h-8 " alt="Quiz Icon" />
              Start Quiz
            </button>
            ):
            (
              <div></div>
            )
            }
            <div className="w-full md:w-[50%]  flex flex-row items-center justify-end gap-4">
            <Link
                className=" md:h-12 h-10  flex px-4 items-center justify-center gap-2 font-semibold border-2 border-[#333333] hover:text-white hover:bg-[#333333] rounded-lg  transition"
                to={`/modules/units/docs/${previousPage?.id? previousPage?.id: posts[0]?.id}`}
              >
                <ArrowBackIosIcon />
                Back
              </Link>
              <Link
                className=" md:h-12 h-10  flex px-4 items-center justify-center gap-2 font-semibold border-2 border-[#333333] hover:text-white hover:bg-[#333333] rounded-lg  transition"
                to={`/modules/units/docs/${nextPage?.id? nextPage?.id: posts[0]?.id}`}
              >
                Next
                <ArrowForwardIosIcon />
              </Link>
            </div>
          </div>
        </div>
        )}
      </MaxWidthWrapper>

      {openQuiz && (
        <section className="w-screen h-screen fixed flex items-center pt-8 justify-center inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="lg:w-2/3 md:w-[75%] w-[95%] h-5/6 m-auto bg-white rounded-md p-8 overflow-y-auto">
            {!showResult && itemQuiz.length > 0 ? (
              <div>
                <div className="w-full flex justify-between items-center">
                  <h2 className="text-lg font-bold mb-4">
                    Question {currentQuestionIndex + 1} of {itemQuiz.length}
                  </h2>
                  <button
                    onClick={() => setOpenQuiz(false)}
                    className="hover:bg-slate-200 px-4 py-2 rounded-md"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <p className="text-gray-700 mb-4">{itemQuiz[currentQuestionIndex].question_text}</p>
                <div className="space-y-2 flex items-center flex-col justify-center w-[95%]  px-4">
                  {["A", "B", "C", "D"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      className={`block w-full text-left px-4 py-2 border rounded-md ${selectedOption === option ? "bg-blue-100 border-blue-500" : "border-gray-300"
                        }`}
                    >
                      {option}: {itemQuiz[currentQuestionIndex][`option_${option.toLowerCase()}`]}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    {currentQuestionIndex === itemQuiz.length - 1 ? "Finish" : "Next"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full text-center">
                <div className="w-full flex justify-between items-center">
                  <h2 className="text-2xl font-bold mb-4">Quiz Completed</h2>
                  <button
                    onClick={() => setOpenQuiz(false)}
                    className="hover:bg-slate-200 px-4 py-2 rounded-md"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <p className="text-lg m-auto mt-14">Your Score: {score} / {itemQuiz.length}</p>
                <button
                  onClick={restartQuiz}
                  className="bg-green-500 text-white px-4 py-2 rounded-md mt-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {isQuizCompleted && (
        <Dashboard
          user_id={userId}
          module_id={id}
          isQuizCompleted={isQuizCompleted}
          wrongAnswers={wrongAnswers}
          score={score}
          timeSpent={Math.floor((new Date() - quizStartTime) / 1000)}
          completed={true}
          perfect_score={itemQuiz.length}
        />
      )}
    </div>
  );
}


