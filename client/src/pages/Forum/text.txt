import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
export default function QuestionAnswer() {
    const navigate = useNavigate()

    const [specifyQuestion, setSpecifyQuestion] = useState("all");
    const [all_QA, setAll_QA] = useState([]);
    const [checkUser, setCheckUser] = useState(null);

    const [openQuestion, setOpenQuestion] = useState(null);
    const [questionText, setQuestionText] = useState('');
    const [topic, setTopic] = useState('');
    const [topicType, setTopicType] = useState('General');

    const [answers, setAnswers] = useState({});

    const [searchTerm, setSearchTerm] = useState("");
    const [acceptedAnswers, setAcceptedAnswers] = useState({});

    useEffect(() => {
        async function checkUser() {
            try {
                const res = await fetch("http://localhost:5000/api/user/profile", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                setCheckUser(data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        }

        checkUser();
    }, []);


    useEffect(() => {
        async function handleAll_QA() {
            try {
                const res = await fetch("http://localhost:5000/api/question-answer/all");
                const data = await res.json();
                setAll_QA(data);
            } catch (err) {
                console.log('Error fetching QA data:', err);
            }
        }

        handleAll_QA();
    }, []);


    const handleTopicType = (event) => {
        setTopicType(event.target.value);
    };


    const handleSubmit = async (e) => {
        if (!checkUser?.id) {
            alert("Log in first");
            navigate("/user/login");
            return;
        }

        if (!questionText || !topic || !topicType) {
            alert('Please fill in all fields');
            return;
        }

        const questionData = {
            user_id: checkUser.id,
            question_text: questionText,
            topic: topic,
            topic_type: topicType,
        };

        try {
            const response = await fetch('http://localhost:5000/api/question-answer/question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(questionData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Question submitted successfully!');

                setAll_QA((prevData) => ({
                    ...prevData,
                    questions: [
                        ...prevData.questions,
                        {
                            question_id: data.question_id,
                            user_id: checkUser.id,
                            question_text: questionText,
                            topic: topic,
                            topic_type: topicType,
                        },
                    ],
                }));

                setQuestionText('');
                setTopic('');
                setTopicType('');
            } else {
                alert('Error submitting question: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };


    const toggleDropdown = (questionId) => {
        setOpenQuestion((prev) => (prev === questionId ? null : questionId));
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: value,
        }));
    };


    const handleAnswerSubmit = async (e, questionId) => {
        e.preventDefault()
        const answerText = answers[questionId];
        if (!checkUser?.id) {
            alert("Log in first");
            navigate("/user/login");
            return;
        }

        if (!answerText) {
            alert("Please write an answer.");
            return;
        }

        const answerData = {
            question_id: questionId,
            user_id: checkUser.id,
            answer_text: answerText,
        };

        try {
            const response = await fetch("http://localhost:5000/api/question-answer/answer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(answerData),
            });

            const data = await response.json();

            if (response.ok) {
                setAll_QA((prevData) => ({
                    ...prevData,
                    answers: [
                        ...prevData.answers,
                        {
                            answer_id: data.answer_id,
                            question_id: questionId,
                            user_id: checkUser.id,
                            answer_text: answerText,
                            created_at: new Date().toISOString(),
                        },
                    ],
                }));
                setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: "" }));

            } else {
                alert("Error submitting answer: " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred");
        }
    };



    const handleVote = async (targetId, targetType, voteType) => {
        if (!checkUser?.id) {
            alert("Log in first")
            navigate("/user/login")
        }
        try {
            const response = await fetch("http://localhost:5000/api/question-answer/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    target_id: targetId,
                    target_type: targetType,
                    user_id: checkUser.id,
                    vote_type: voteType,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const data = await response.json();
            setAll_QA((prevData) => ({
                ...prevData,
                votes: [
                    ...prevData.votes.filter(
                        (vote) =>
                            !(vote.target_id === targetId && vote.target_type === targetType && vote.user_id === checkUser.id)
                    ),
                    data.vote,
                ],
            }));
        } catch (error) {
            console.error("Error during voting:", error);
            alert(error.message || "An error occurred while processing your vote.");
        }
    };


    const handleDelete = async (questionId) => {
        if (!checkUser?.id) {
            alert("You need to log in first.");
            navigate("/user/login");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this question?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/api/question-answer/delete/${questionId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setAll_QA((prevData) => ({
                    ...prevData,
                    questions: prevData.questions.filter(
                        (question) => question.question_id !== questionId
                    ),
                }));
            } else {
                alert(`Error deleting question: ${data.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error deleting question:", error);
            alert("An error occurred while deleting the question. Please try again.");
        }
    };


    const handleAccept = async (acceptID, isAccepted) => {
        try {
            const res = await fetch(`http://localhost:5000/api/question-answer/accept/${acceptID}`, {
                method: "PATCH",
                credentials: "include",
            });
    
            const data = await res.json();
    
            if (res.ok) {
                alert(data.message);
                setAcceptedAnswers((prev) => ({
                    ...prev,
                    [acceptID]: !isAccepted,
                }));
            } else {
                alert(data.error || "An error occurred on the server.");
            }
        } catch (error) {
            console.error("Network or unexpected error:", error);
            alert("An unexpected error occurred. Please try again later.");
        }
    };



    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredQuestions = (all_QA?.questions || []).filter((question) =>
        question.topic.toLowerCase().includes(searchTerm) ||
        question.topic_type?.toLowerCase().includes(searchTerm) ||
        question.question_text.toLowerCase().includes(searchTerm)

    );


    return (
        <div className="h-screen">
            <MaxWidthWrapper className=" mt-14 xl:mx-56 lg:mx-40 m-2">
                <section className="mt-14 h-12 flex flex-row justify-start gap-8 items-center  text-xs">
                    {["all", "Modules", "Jobs", "Announcements"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setSpecifyQuestion(type)}
                            className={`px-3 py-1 rounded-2xl  ${specifyQuestion === type ? "bg-gray-200 border-[1px]" : "bg-transparent"
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </section>
                {specifyQuestion === "all" &&
                    <section className="h-96 w-full px-14 py-20 rounded-md bg-[#333333] text-white">
                        <div className="lg:w-3/4">
                            <h1 className="text-5xl font-semibold italic">Question & Answer</h1>
                            <p className="lg:text-lg text-sm font-extralight mt-4">
                                Ensure your question is relevant to the topic, and avoid using inappropriate or offensive language. Remember, this is a community space—let's maintain a positive and constructive environment for everyone.
                            </p>
                        </div>
                    </section>}
                <section className="mb-8 flex lg:flex-row flex-col-reverse gap-8 mt-10">
                    <section className="w-full ">
                        <form className="pb-4 border-b-[1px]">
                            <h3 className="text-lg italic font-medium mb-2">Ask Question:</h3>
                            <input
                                type="text"
                                className="w-full border-[1px] border-gray-600 rounded-md mt-2 text-sm p-3"
                                placeholder="About"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                            <textarea
                                className="min-h-40 w-full border-[1px] border-gray-600 rounded-md mt-2 text-sm p-3"
                                placeholder="Write your question here."
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                            ></textarea>
                            <select
                                className="w-fit border-[1px] border-gray-600 rounded-md mt-2 text-sm p-3 pr-10"
                                value={topicType}
                                onChange={handleTopicType}
                            >
                                <option value="General">General</option>
                                <option value="Modules">Module</option>
                                <option value="Jobs">Job</option>
                                <option value="Announcements">Announcement</option>
                            </select>
                            <div className="w-full flex justify-end items-center">
                                <button
                                    className="py-2 px-4 rounded-md border-[1px] text-sm text-white bg-red-900 hover:bg-red-700"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>

                        <section className="flex flex-col">
                            <section className="h-14 py-8 flex flex-row justify-between items-center">
                                <h3 className="text-4xl font-semibold mb-2 italic">Check Questions</h3>
                                <div className="lg:w-1/3 w-full flex flex-row items-center border-[1px] rounded-lg overflow-hidden bg-slate-100">
                                    <input
                                        placeholder="Search for related questions"
                                        type="text"
                                        className="h-9 text-xs w-full py-2 pl-4 outline-none bg-slate-100"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                    <SearchOutlinedIcon className="mr-2" />
                                </div>
                            </section>

                            {/* Question List */}
                            <section>
                                {filteredQuestions && filteredQuestions.length > 0 ? (
                                    filteredQuestions
                                        .filter((question) => specifyQuestion === "all" || question.topic_type === specifyQuestion)
                                        .map((question) => {
                                            const relatedAnswers = all_QA.answers.filter(
                                                (answer) => answer.question_id === question.question_id
                                            );

                                            // Fallback for missing answer_id

                                            const questionVotes = all_QA.votes.filter(
                                                (vote) => vote.target_id === question.question_id && vote.target_type === "question"
                                            );

                                            return (
                                                <div key={question.question_id} className="p-4 border-b">

                                                    <div className="w-full flex justify-between items-center mb-2">
                                                        <p className="text-sm text-gray-600">Topic: {question.topic_type}</p>
                                                        <div>

                                                            {(() => {
                                                                const userVote =
                                                                    all_QA?.votes?.find(
                                                                        (vote) =>
                                                                            vote?.target_id === question.question_id &&
                                                                            vote?.target_type === "question" &&
                                                                            vote?.user_id === checkUser?.id
                                                                    ) || null;

                                                                const isUpvoted = userVote?.vote_type === "up";
                                                                return (
                                                                    <>

                                                                        <button
                                                                            className={`mr-2 ${isUpvoted ? "text-red-500" : "text-black"}`}
                                                                            onClick={() =>
                                                                                handleVote(
                                                                                    question.question_id,
                                                                                    "question",
                                                                                    isUpvoted ? "down" : "up"
                                                                                )
                                                                            }
                                                                        >
                                                                            {isUpvoted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                                        </button>
                                                                    </>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                    <h3 className="text-xl font-semibold">About: {question.topic}</h3>
                                                    <p className="text-base font-medium">{question.question_text}</p>
                                                    <p className="text-sm text-gray-500 mt-2">{new Date(question.created_at).toLocaleDateString()}</p>


                                                    <div className="mt-2">
                                                        {questionVotes.filter((vote) => vote.vote_type === "up").length > 0 ? (
                                                            <h4 className="list-disc text-sm text-gray-600">
                                                                Question Votes: {questionVotes.filter((vote) => vote.vote_type === "up").length}
                                                            </h4>
                                                        ) : (
                                                            <p className="text-sm text-gray-600">No votes yet</p>
                                                        )}
                                                    </div>


                                                    <div
                                                        type="button"
                                                        onClick={() => toggleDropdown(question.question_id)}
                                                        className="w-fit bg-[#333333] hover:bg-[#121212] rounded-md text-white text-sm"
                                                    >
                                                        {openQuestion === question.question_id ? (
                                                            <button className="flex justify-between items-center gap-8 w-52 mt-4 px-4 py-1.5 rounded-md bg-red-700">
                                                                Hide Answers <KeyboardArrowUpIcon />
                                                            </button>
                                                        ) : (
                                                            <button className="flex justify-between items-center gap-8 w-52 mt-4 px-4 py-1.5 rounded-md">
                                                                Show Answers <KeyboardArrowDownIcon />
                                                            </button>
                                                        )}
                                                    </div>


                                                    <div
                                                        className={`mt-4 overflow-y-auto transition-all duration-500 ease-in-out ${openQuestion === question.question_id ? "max-h-screen" : "max-h-0"
                                                            }`}
                                                    >
                                                        <div className="space-y-2">
                                                            {relatedAnswers.length > 0 ? (
                                                                relatedAnswers.map((answer) => {
                                                                    if (!answer.answer_id) {
                                                                        console.error("Missing answer_id for answer:", answer);
                                                                        return null;
                                                                    }
                                                                    const answerVotes = all_QA.votes.filter(
                                                                        (vote) => vote.target_id === answer.answer_id && vote.target_type === "answer"
                                                                    );

                                                                    return (
                                                                        <div key={answer.answer_id} className="p-2 bg-gray-50 rounded-md">
                                                                            <div className="flex flex-row justify-between items-center">
                                                                                <p className="text-gray-700">{answer.answer_text}</p>
                                                                                {checkUser?.role === "admin" &&
                                                                                    <button
                                                                                        onClick={() => handleAccept(answer.answer_id, acceptedAnswers[answer.answer_id])}
                                                                                        className="px-2 py-2 rounded text-xs bg-[#333333] text-white"
                                                                                    >
                                                                                        {acceptedAnswers[answer.answer_id] ?? answer.is_accepted ? "Unaccept" : "Accept"}
                                                                                    </button>}
                                                                            </div>
                                                                            <p className="text-sm text-gray-500">
                                                                                {answerVotes.length} votes
                                                                                {answer.is_accepted && (
                                                                                    <span className="ml-2 text-green-500">(Accepted)</span>
                                                                                )}
                                                                            </p>
                                                                            <div className="mt-2">
                                                                                <button
                                                                                    className="mr-2 text-blue-500"
                                                                                    onClick={() => handleVote(answer.answer_id, "answer", "up")}
                                                                                >
                                                                                    👍 Like
                                                                                </button>
                                                                                <button
                                                                                    className="text-red-500"
                                                                                    onClick={() => handleVote(answer.answer_id, "answer", "down")}
                                                                                >
                                                                                    👎 Dislike
                                                                                </button>
                                                                            </div>

                                                                            {/* Answer Votes */}
                                                                            <div className="mt-1">
                                                                                <h5 className="font-semibold">Answer Votes:</h5>
                                                                                {answerVotes.length > 0 ? (
                                                                                    <ul className="list-disc pl-5 text-gray-600">
                                                                                        {answerVotes.map((vote) => (
                                                                                            <li key={vote.vote_id}>
                                                                                                {vote.vote_type.charAt(0).toUpperCase() +
                                                                                                    vote.vote_type.slice(1)}{" "}
                                                                                                by User {vote.user_id}
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                ) : (
                                                                                    <p className="text-gray-500">No votes yet</p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            ) : (
                                                                <p className="text-gray-500">No answers yet</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* Answer Form */}
                                                    <form onSubmit={(e) => handleAnswerSubmit(e, question.question_id)} className="mt-4">
                                                        <textarea
                                                            className="min-h-20 w-full border-[1px] border-gray-600 rounded-sm mt-2 text-sm p-3"
                                                            placeholder="Comment or Answer here."
                                                            value={answers[question.question_id] || ""}
                                                            onChange={(e) =>
                                                                handleAnswerChange(question.question_id, e.target.value)
                                                            }
                                                        ></textarea>

                                                        <div className="mt-2 w-full flex justify-end items-center gap-x-4 ">
                                                            {(checkUser?.id === question.user_id || checkUser?.role === "admin") && (
                                                                <p
                                                                    onClick={() => handleDelete(question.question_id)}
                                                                    className="text-xs py-1 px-4 rounded-sm border-[1px] cursor-pointer border-gray-600 hover:bg-[#333333] hover:text-white"
                                                                >
                                                                    <DeleteOutlineIcon />
                                                                </p>
                                                            )}
                                                            <button
                                                                type="submit"
                                                                className="text-xs py-2 px-4 rounded-sm text-white border-[1px] border-red-900 hover:border-red-700 bg-red-900 hover:bg-red-700"
                                                            >
                                                                Reply
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            );
                                        })
                                ) : (
                                    <p>No Questions Available</p>
                                )}
                            </section>
                        </section>

                    </section>
                    <section className="lg:w-2/4">
                        <div className="h-fit rounded-md p-4 bg-gray-100">
                            <h3 className="font-serif font-bold text-2xl italic">Rules</h3>
                            <p className="mt-2 text-sm  text-gray-600">
                                Following the rules ensures a respectful and productive environment for everyone.
                                Please adhere to them to maintain constructive discussions and avoid conflicts.
                            </p>
                        </div>
                        <div className="pl-2 py-4">
                            <ul className="flex flex-col gap-2 list-disc ml-5 text-base ">
                                <li>Be respectful and polite.</li>
                                <li>Stay relevant to the topic.</li>
                                <li>Ask clear, concise questions.</li>
                                <li>Check for existing answers.</li>
                                <li>Avoid personal attacks.</li>
                                <li>Provide enough context.</li>
                                <li>Ask one question at a time.</li>
                                <li>No spam or promotions.</li>
                                <li>Focus on constructive input.</li>
                                <li>Be patient for responses.</li>
                            </ul>
                        </div>
                    </section>
                </section>
            </MaxWidthWrapper>
            <Footer />
        </div>
    );
}
