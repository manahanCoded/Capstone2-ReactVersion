import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import EditorToolbar, { modules, formats } from "@/components/EditToolbar";

export default function Forum() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const [specifyQuestion, setSpecifyQuestion] = useState("all");
    const [all_QA, setAll_QA] = useState([]);
    const [imageFile, setImageFile] = useState();

    const [checkUser, setCheckUser] = useState(null);

    const [openQuestion, setOpenQuestion] = useState(null);
    const [questionText, setQuestionText] = useState('');
    const [topic, setTopic] = useState('');
    const [topicType, setTopicType] = useState('General');

    const [replyingTo, setReplyingTo] = useState(null);
    const [answers, setAnswers] = useState({});

    const [searchTerm, setSearchTerm] = useState("");
    const [acceptedAnswers, setAcceptedAnswers] = useState({});

    const toggleForm = () => {
        setIsOpen(!isOpen);
    };
    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };


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


    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!checkUser?.id) {
            alert("Log in first");
            navigate("/user/login");
            return;
        }

        if (!questionText || !topic || !topicType) {
            alert("Please fill in all fields");
            return;
        }

        const formData = new FormData();
        formData.append("user_id", checkUser.id);
        formData.append("question_text", questionText);
        formData.append("topic", topic);
        formData.append("topic_type", topicType);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const response = await fetch("http://localhost:5000/api/question-answer/question", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert("Question submitted successfully!");
                setAll_QA((prevData) => ({
                    ...prevData,
                    questions: [
                        ...prevData.questions,
                        {
                            question_id: data.question.question_id,
                            user_id: checkUser.id,
                            question_text: questionText,
                            topic: topic,
                            topic_type: topicType,
                            image: data.question.image,
                        },
                    ],
                }));

                setQuestionText("");
                setTopic("");
                setTopicType("");
                setImageFile(null);
            } else {
                alert("Error submitting question: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred");
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


    const handleAnswerSubmit = async (e, questionId, parentAnswerId = null) => {
        e.preventDefault();

        const answerKey = parentAnswerId || questionId; // Use parentAnswerId if replying to an answer
        const answerText = answers[answerKey]; // Get answer text from correct key

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
            parent_answer_id: parentAnswerId, // Include parent answer ID if replying to an answer
        };

        try {
            const response = await fetch("http://localhost:5000/api/question-answer/answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(answerData),
            });

            const data = await response.json();

            if (response.ok) {
                setAll_QA((prevData) => ({
                    ...prevData,
                    answers: [...prevData.answers, data.answer],
                }));
                setAnswers((prevAnswers) => ({ ...prevAnswers, [answerKey]: "" })); // Reset correct input
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
            <MaxWidthWrapper className=" mt-14 xl:mx-80 lg:mx-40 m-2">
                <section className="mt-20 h-12 w-full flex flex-row justify-between items-center">
                    <section className="flex flex-row justify-start gap-8 items-center  text-xs">
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
                <section className="mb-8 flex lg:flex-row flex-col-reverse gap-8 mt-2">
                    <section className="w-full ">
                        <button
                            className="py-2 px-4 mb-2 text-xs rounded-md border text-white bg-red-900 hover:bg-red-700 transition-all"
                            onClick={toggleForm}
                        >
                            {isOpen ? "Close Form" : "Ask a Question"}
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                                }`}
                        >
                            <form className="flex flex-col gap-2 pb-4 border-b-[1px]">
                                <h3 className="text-lg italic font-medium mb-2">Ask Question:</h3>
                                <input
                                    type="text"
                                    className="w-full border-[1px] border-gray-600 rounded-md mt-2 text-sm p-3"
                                    placeholder="About"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                                <EditorToolbar toolbarId="t3" />
                                <ReactQuill
                                    theme="snow"
                                    value={questionText}
                                    required
                                    onChange={setQuestionText}
                                    placeholder="Write something awesome..."
                                    modules={modules("t3")}
                                    formats={formats}
                                    className="bg-white border rounded  h-[55vh] overflow-y-auto"
                                />

                                <div className="flex flex-row justify-between items-center">
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
                                    <div className="flex flex-col items-center space-y-4">
                                        <label className="flex items-center cursor-pointer rounded-lg border border-gray-300 px-4 py-2 shadow-sm hover:bg-gray-100">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-red-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 16l4 4m0 0l4-4m-4 4V4m13 16V4m0 0l-4 4m4-4l4 4"
                                                />
                                            </svg>
                                            <div className="flex flex-col gap-1">
                                                <span className="ml-2 text-sm font-medium text-gray-700">

                                                    Choose Background Image
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                onChange={handleImageFileChange}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                        <span className="text-sm text-gray-500">{imageFile?.name}</span>
                                    </div>
                                </div>

                                <div className="w-full flex justify-end items-center">
                                    <button
                                        className="py-2 px-4 rounded-md border-[1px] text-sm text-white bg-red-900 hover:bg-red-700"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>

                        <section className="flex flex-col">
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
                                                <div key={question.question_id} className="p-4 border-b hover:bg-gray-100 rounded-xl">

                                                    <div className="w-full flex justify-between items-center mb-2">
                                                        <p className="text-sm text-gray-600">Topic: {question.topic_type}</p>
                                                        <p className="text-sm text-gray-500 mt-2">{new Date(question.created_at).toLocaleDateString()}</p>
                                                    </div>

                                                    <h3 className="text-base font-semibold">{question.topic}</h3>
                                                    {isExpanded ?
                                                        <p className="ql-editor text-base font-medium h-fit " dangerouslySetInnerHTML={{ __html: question.question_text ?? "No description available" }}></p>
                                                        :
                                                        null
                                                    }
                                                    <button
                                                        className="mb-2 text-gray-600 hover:text-blue-800 text-sm mt-2"
                                                        onClick={toggleExpansion}
                                                    >
                                                        {isExpanded ? 'Show Less' : 'More Information...'}
                                                    </button>

                                                    {question.image && (
                                                        <div
                                                            className="relative rounded-2xl bg-cover bg-center"
                                                            style={{ backgroundImage: `url(${question.image})` }}
                                                        >
                                                            <div className="absolute inset-0 bg-[#333333] opacity-50 rounded-2xl"></div>
                                                            <img
                                                                className="w-full h-96 object-contain  backdrop-blur-sm rounded-2xl"
                                                                src={question.image}
                                                                alt="Uploaded"
                                                            />
                                                        </div>

                                                    )}
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
                                                                <section className="my-2 px-3 flex flex-row items-center justify-between gap-2">
                                                                    <div className=" flex flex-row items-center gap-2">
                                                                        <div className="flex flex-row items-center ">
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
                                                                            {questionVotes.filter((vote) => vote.vote_type === "up").length > 0 ? (
                                                                                <h4 className="list-disc text-sm text-gray-600">
                                                                                    {questionVotes.filter((vote) => vote.vote_type === "up").length}
                                                                                </h4>
                                                                            ) : (
                                                                                null
                                                                            )}
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => toggleDropdown(question.question_id)}
                                                                            className="text-gray-500"
                                                                        >
                                                                            {openQuestion === question.question_id ? (
                                                                                <ChatBubbleRoundedIcon />
                                                                            ) : (
                                                                                <ChatBubbleOutlineRoundedIcon />
                                                                            )}
                                                                            <span className="ml-2 text-gray-500 text-sm">
                                                                                {(() => {
                                                                                    const commentCount = all_QA.answers.filter(
                                                                                        (answer) => answer.question_id === question.question_id
                                                                                    ).length;


                                                                                    return commentCount > 0 ? commentCount : null;
                                                                                })()}
                                                                            </span>
                                                                        </button>
                                                                    </div>
                                                                    {(checkUser?.id === question.user_id || checkUser?.role === "admin") && (
                                                                        <button
                                                                            onClick={() => handleDelete(question.question_id)}
                                                                            className="text-red-700"
                                                                        >
                                                                            <DeleteOutlineIcon />
                                                                        </button>
                                                                    )}
                                                                </section>
                                                            );
                                                        })()}
                                                    </div>

                                                    <div
                                                        className={`mt-4 overflow-y-auto transition-all duration-500 ease-in-out ${openQuestion === question.question_id ? "max-h-screen" : "max-h-0"
                                                            }`}
                                                    >
                                                        <div className="h-72 overflow-y-auto space-y-2">
                                                            {relatedAnswers.length > 0 ? (
                                                                relatedAnswers
                                                                    .filter((answer) => !answer.parent_answer_id)
                                                                    .map((answer) => {
                                                                        if (!answer.answer_id) {
                                                                            console.error("Missing answer_id for answer:", answer);
                                                                            return null;
                                                                        }

                                                                        const answerVotes = all_QA.votes.filter(
                                                                            (vote) => vote.target_id === answer.answer_id && vote.target_type === "answer"
                                                                        );
                                                                        const userVote = answerVotes.find((vote) => vote.user_id === checkUser?.id); // Find the user's vote (if any)

                                                                        const isLiked = userVote?.vote_type === "up";
                                                                        const isDisliked = userVote?.vote_type === "down";

                                                                        return (
                                                                            <div key={answer.answer_id} className=" p-2 bg-gray-50 rounded-md">

                                                                                <div className="flex flex-row justify-between items-center">
                                                                                    <p className="text-gray-700">
                                                                                        {answer.answer_text}
                                                                                    </p>

                                                                                    {checkUser?.role === "admin" && (
                                                                                        <button
                                                                                            onClick={() => handleAccept(answer.answer_id, acceptedAnswers[answer.answer_id])}
                                                                                            className="px-2 py-2 rounded text-xs bg-[#333333] text-white"
                                                                                        >
                                                                                            {acceptedAnswers[answer.answer_id] ?? answer.is_accepted ? "Unaccept" : "Accept"}
                                                                                        </button>
                                                                                    )}
                                                                                </div>

                                                                                <p className="text-sm text-gray-500">
                                                                                    {answerVotes.length} votes
                                                                                    {answer.is_accepted && <span className="ml-2 text-green-500">(Accepted)</span>}
                                                                                </p>

                                                                                <div className="mt-2">
                                                                                    <button
                                                                                        className={`mr-2 ${isLiked ? "text-blue-500" : "text-gray-500"}`}
                                                                                        onClick={() => handleVote(answer.answer_id, "answer", "up")}
                                                                                    >
                                                                                        {isLiked ? (
                                                                                            <ThumbUpAltIcon />
                                                                                        ) : (
                                                                                            <ThumbUpOffAltIcon />
                                                                                        )}
                                                                                       
                                                                                    </button>
                                                                                    <button
                                                                                        className={`text-red-500 ${isDisliked ? "text-red-700" : "text-gray-500"}`}
                                                                                        onClick={() => handleVote(answer.answer_id, "answer", "down")}
                                                                                    >
                                                                                        {isDisliked ? (
                                                                                            <ThumbDownAltIcon />
                                                                                        ) : (
                                                                                            <ThumbDownOffAltIcon />
                                                                                        )}
                                                                                        
                                                                                    </button>
                                                                                </div>


                                                                                <button
                                                                                    className="text-blue-500 mt-2"
                                                                                    onClick={() => setReplyingTo(replyingTo === answer.answer_id ? null : answer.answer_id)}
                                                                                >
                                                                                    {replyingTo === answer.answer_id ? "Cancel Reply" : "Reply"}
                                                                                </button>


                                                                                {replyingTo === answer.answer_id && (
                                                                                    <form onSubmit={(e) => handleAnswerSubmit(e, answer.question_id, answer.answer_id)} className="mt-2">
                                                                                        <textarea
                                                                                            className="w-full p-2 border rounded"
                                                                                            placeholder="Write a reply..."
                                                                                            value={answers[answer.answer_id] || ""}
                                                                                            onChange={(e) => setAnswers((prev) => ({ ...prev, [answer.answer_id]: e.target.value }))}
                                                                                        />
                                                                                        <button type="submit" className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">
                                                                                            Submit Reply
                                                                                        </button>
                                                                                    </form>
                                                                                )}

                                                                                {/* Nested Replies */}
                                                                                <div className="ml-6 border-l pl-4 mt-2">
                                                                                    {all_QA.answers
                                                                                        .filter((reply) => reply.parent_answer_id === answer.answer_id) // Replies to the current answer
                                                                                        .map((reply) => (
                                                                                            <div key={reply.answer_id} className="p-2 bg-gray-100 rounded-md">
                                                                                                {/* Nested Reply Text */}
                                                                                                <p className="text-gray-700">{reply.answer_text}</p>
                                                                                                <p className="text-sm text-gray-500">By User {reply.user_id}</p>

                                                                                                {/* Reply Button for Nested Reply */}
                                                                                                <button
                                                                                                    className="text-blue-500 mt-2"
                                                                                                    onClick={() => setReplyingTo(replyingTo === reply.answer_id ? null : reply.answer_id)}
                                                                                                >
                                                                                                    {replyingTo === reply.answer_id ? "Cancel Reply" : "Reply"}
                                                                                                </button>

                                                                                                {/* Reply Form for Nested Reply */}
                                                                                                {replyingTo === reply.answer_id && (
                                                                                                    <form onSubmit={(e) => handleAnswerSubmit(e, reply.question_id, reply.answer_id)} className="mt-2">
                                                                                                        <textarea
                                                                                                            className="w-full p-2 border rounded"
                                                                                                            placeholder="Write a reply..."
                                                                                                            value={answers[reply.answer_id] || ""}
                                                                                                            onChange={(e) => setAnswers((prev) => ({ ...prev, [reply.answer_id]: e.target.value }))}
                                                                                                        />
                                                                                                        <button type="submit" className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">
                                                                                                            Submit Reply
                                                                                                        </button>
                                                                                                    </form>
                                                                                                )}

                                                                                                {/* Nested Replies to a Nested Reply */}
                                                                                                <div className="ml-6 border-l pl-4 mt-2">
                                                                                                    {all_QA.answers
                                                                                                        .filter((nestedReply) => nestedReply.parent_answer_id === reply.answer_id) // Replies to the nested reply
                                                                                                        .map((nestedReply) => (
                                                                                                            <div key={nestedReply.answer_id} className="p-2 mb-2 bg-gray-200 rounded-md">
                                                                                                                <p className="text-gray-700">{nestedReply.answer_text}</p>
                                                                                                                <p className="text-sm text-gray-500">By User {nestedReply.user_id}</p>
                                                                                                            </div>
                                                                                                        ))}
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
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
                                                    <form onSubmit={(e) => handleAnswerSubmit(e, question.question_id)} className="">
                                                        <textarea
                                                            className="flex items-center min-h-14 w-full border-[1px] border-gray-600 rounded-md mt-2 text-sm p-3"
                                                            placeholder="Comment or Answer here."
                                                            value={answers[question.question_id] || ""}
                                                            onChange={(e) =>
                                                                handleAnswerChange(question.question_id, e.target.value)
                                                            }
                                                        ></textarea>

                                                        <div className="mt-2 w-full flex justify-end items-center gap-x-4 ">
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

                </section>
            </MaxWidthWrapper>
            <Footer />
        </div>
    );
}
