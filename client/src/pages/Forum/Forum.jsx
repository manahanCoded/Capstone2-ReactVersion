import { useEffect, useState, useRef, useCallback } from "react";
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
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import {
    ForumOutlined,
    DashboardOutlined,
    Dashboard,
    WorkOutline,
    Work,
    CampaignOutlined,
    Campaign,
} from "@mui/icons-material"
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonIcon from '@mui/icons-material/Person';
import ForumIcon from '@mui/icons-material/Forum';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import CloseIcon from '@mui/icons-material/Close';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import Reply from "@/pages/Forum/Reply";
import CheckIcon from '@mui/icons-material/Check';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import { Filter } from "bad-words";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


export default function Forum() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [loadingReply, setLoadingReply] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const [specifyQuestion, setSpecifyQuestion] = useState("all");
    const [showUnapprovedOnly, setShowUnapprovedOnly] = useState(false);
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
    const [mobileFilter, setMobileFilter] = useState(false)
    const [acceptedAnswers, setAcceptedAnswers] = useState({});

    const [openEditQuestion, setOpenEditQuestion] = useState(false)
    const [editQuestion, setEditQuestion] = useState()

    const [checkImage, setCheckImage] = useState(false);

    const [unseenQuestions, setUnseenQuestions] = useState([]);

    const filter = new Filter();

    const [openPostId, setOpenPostId] = useState(null);
    const openPostOption = (postId) => {
        if (!checkUser?.id) {
            alert("Log in first");
            navigate("/user/login");
            return;
        }
        setOpenPostId(openPostId === postId ? null : postId)
    }

    const [checkQuestion, setCheckQuestion] = useState()

    const firstCommentRef = useRef(null);
    const handleInputFirstCommentRef = () => {
        if (firstCommentRef.current) {
            firstCommentRef.current.style.height = "auto";
            firstCommentRef.current.style.height = `${firstCommentRef.current.scrollHeight}px`;
        }
    };
    const handleClickFirstCommentRef = () => {
        firstCommentRef.current?.focus();
    };

    const textareaRef = useRef(null);
    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };
    const handleClick = () => {
        textareaRef.current?.focus();
    };

    const [editReply, setEditReply] = useState({})
    const [showEdit, setShowEdit] = useState(false)

    const handleEdit = (editID, editText) => {
        if (editID === editReply.anser_id) {
            setEditReply({
                anser_id: null,
                answer_text: null
            })
        } else {
            setEditReply({
                anser_id: editID,
                answer_text: editText
            })
        }
    }

    const toggleForm = () => {
        setIsOpen(!isOpen);
    };
    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        async function checkUser() {
            try {
                const res = await fetch(`${API_URL}/api/user/profile`, {
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
            setLoading(true)
            try {
                const res = await fetch(`${API_URL}/api/question-answer/all`);
                const data = await res.json();
                setAll_QA(data);

                if (!checkUser || checkUser.role !== "admin") return;

                try {
                    const unseen = data.questions.filter(q =>
                        !q.is_resolved && (!q.seen_by || !q.seen_by.includes(checkUser.id) && !q.seen_by.includes(checkUser.id.toString()))
                    );

                    setUnseenQuestions(unseen);
                } catch (err) {
                    console.error("❌ Error fetching unseen questions:", err);
                }
            } catch (err) {
                console.error('Error fetching QA data:', err);
            } finally {
                setLoading(false)
            }
        }

        handleAll_QA();
    }, [checkUser]);


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
        e.preventDefault()
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
        formData.append("question_text", filter.clean(questionText));
        formData.append("topic", topic);
        formData.append("topic_type", topicType);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const response = await fetch(`${API_URL}/api/question-answer/question`, {
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
                window.location.reload()
            } else {
                alert("Error submitting question: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleAllowQuestion = async (questionID, isAllow) => {
        try {

            setVisibleQuestions((prevQuestions) =>
                prevQuestions.map((q) =>
                    q.question_id === questionID ? { ...q, is_resolved: isAllow } : q
                )
            );
            if (checkQuestion) {
                setCheckQuestion((prevQuestions) => ({ ...prevQuestions, is_resolved: isAllow }));
            }

            const response = await fetch(`${API_URL}/api/question-answer/allow-question/${questionID}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_resolved: isAllow }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to update question status");
            }
            openPostOption(null)
            fetchAllQA();
            setUnseenQuestions((prevUnseen) =>
                prevUnseen.filter(q => q.question_id !== questionID)
            );
        } catch (error) {
            alert("An error occurred: " + error.message);
        }
    };


    const handleEditSubmitQuestion = async (e, questionID) => {
        e.preventDefault()
        const questionUpdateData = new FormData()
        questionUpdateData.append("question_text", editQuestion.question_text)
        questionUpdateData.append("topic", editQuestion.topic)
        questionUpdateData.append("topic_type", editQuestion.topic_type)
        questionUpdateData.append("image", editQuestion.image)
        questionUpdateData.append("user_id", checkUser.id);

        try {
            const response = await fetch(`${API_URL}/api/question-answer/update-question/${questionID}`, {
                method: "PATCH",
                body: questionUpdateData,
                credentials: "include"
            })

            if (response.ok) {
                alert("Update Successful")
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert("Error submitting answer: " + (errorData.error || "Unknown error occurred"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred");
        }

    }

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
        setLoadingReply(true);
        const answerKey = parentAnswerId || questionId;
        const answerText = answers[answerKey];

        setReplyingTo(replyingTo === parentAnswerId ? null : parentAnswerId)

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
            parent_answer_id: parentAnswerId,
        };

        try {
            const response = await fetch(`${API_URL}/api/question-answer/answer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(answerData),
            });

            const data = await response.json();

            if (response.ok) {
                fetchAllQA()
                setAnswers((prevAnswers) => ({ ...prevAnswers, [answerKey]: "" }));
            } else {
                alert("Error submitting answer: " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred");
        } finally {
            setLoadingReply(false);
        }
    };

    const handleEditAnswer = async (e, answerId) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/api/question-answer/update-answer/${answerId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer_text: editReply.answer_text }),
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                fetchAllQA()
            } else {
                alert("Error submitting answer: " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred");
        }
    };


    const fetchAllQA = async () => {
        try {
            const response = await fetch(`${API_URL}/api/question-answer/all`);
            const data = await response.json();
            if (response.ok) {
                setAll_QA(data);
            }
        } catch (error) {
            console.error("Error fetching QA data:", error);
        }
    };


    const handleVote = async (targetId, targetType, voteType) => {
        if (!checkUser?.id) {
            alert("Log in first");
            navigate("/user/login");
            return;
        }

        const existingVote = all_QA.votes.find(
            (vote) => vote.target_id === targetId && vote.target_type === targetType && vote.user_id === checkUser.id
        );

        const newVoteType = existingVote?.vote_type === voteType ? "remove" : voteType;

        try {
            const response = await fetch(`${API_URL}/api/question-answer/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    target_id: targetId,
                    target_type: targetType,
                    user_id: checkUser.id,
                    vote_type: newVoteType,
                }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();

            setAll_QA((prevData) => ({
                ...prevData,
                votes: newVoteType === "remove"
                    ? prevData.votes.filter((vote) => !(vote.target_id === targetId && vote.target_type === targetType && vote.user_id === checkUser.id))
                    : [...prevData.votes.filter((vote) => !(vote.target_id === targetId && vote.target_type === targetType && vote.user_id === checkUser.id)), data.vote]
            }));
        } catch (error) {
            console.error("Error during voting:", error);
            alert(error.message || "An error occurred while processing your vote.");
        }
    };


    const handleEditQuestion = (questionId) => {
        const questionToEdit = filteredQuestions.find(q => q.question_id === questionId);
        if (questionToEdit) {
            setEditQuestion(questionToEdit);
        }
    };



    const [updateDeleteKey, setUpdateDeleteKey] = useState(0);

    const handleDeleteQuestion = async (questionId) => {
        if (!checkUser?.id) {
            alert("You need to log in first.");
            navigate("/user/login");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this question?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${API_URL}/api/question-answer/delete-question/${questionId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setAll_QA((prevData) => {
                    const updatedQuestions = prevData.questions.filter((q) => q.question_id !== questionId);
                    return { ...prevData, questions: updatedQuestions };
                });

                setUpdateDeleteKey((prevKey) => prevKey + 1);

                setUnseenQuestions((prevUnseen) =>
                    prevUnseen.filter(q => q.question_id !== questionId)
                );

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
            const res = await fetch(`${API_URL}/api/question-answer/accept/${acceptID}`, {
                method: "PATCH",
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                fetchAllQA()
                setOpenPostId(null)
                setUnseenQuestions((prevUnseen) =>
                    prevUnseen.filter(q => q.question_id !== acceptID)
                );
            } else {
                alert(data.error || "An error occurred on the server.");
            }
        } catch (error) {
            console.error("Network or unexpected error:", error);
            alert("An unexpected error occurred. Please try again later.");
        }
    };


    const handleDeleteAnswer = async (answerID) => {
        if (!checkUser?.id) {
            alert("You need to log in first.");
            navigate("/user/login");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this question?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${API_URL}/api/question-answer/delete-answer/${answerID}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                fetchAllQA()
            } else {
                alert(`Error deleting answer: ${data.error || "Unknown error"}`);
            }

        } catch (error) {
            console.error("Error deleting answer:", error);
            alert("An error occurred while deleting the question. Please try again.");
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

    const handleCheckQuestion = (questionID) => {
        const data = filteredQuestions.filter((question) => questionID === question.question_id)
        setCheckQuestion(data[0])
    }

    const types = [
        { name: "all", outlined: <ForumOutlined />, filled: <ForumIcon />, value: "all" },
        { name: "Modules", outlined: <DashboardOutlined />, filled: <Dashboard />, value: "Modules" },
        { name: "Jobs", outlined: <WorkOutline />, filled: <Work />, value: "Jobs" },
        { name: "Announcements", outlined: <CampaignOutlined />, filled: <Campaign />, value: "Announcements" },
        { name: "My post", outlined: <PersonOutlineIcon />, filled: <PersonIcon />, value: checkUser?.email },
    ];

    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent;
    };

    function timeAgo(timestamp) {
        const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            day: 86400,
            hour: 3600,
            minute: 60,
        };
        for (const [unit, value] of Object.entries(intervals)) {
            const count = Math.floor(seconds / value);
            if (count >= 1) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
        }
        return "Just now";
    }


    // Loader
    const [visibleQuestions, setVisibleQuestions] = useState([]);
    const [page, setPage] = useState(1);
    const [loadingPage, setLoadingPage] = useState(false);
    const observerRef = useRef(null);

    const QUESTIONS_PER_PAGE = 5;

    useEffect(() => {
        const newQuestions = filteredQuestions.slice(0, QUESTIONS_PER_PAGE * page);
        if (newQuestions.length !== visibleQuestions.length) {
            setVisibleQuestions(newQuestions);
        }
    }, [filteredQuestions, page]);


    const observerCallback = useCallback(
        (entries) => {
            const target = entries[0];

            if (target.isIntersecting && !loadingPage && visibleQuestions.length < filteredQuestions.length) {
                setLoadingPage(true);
                setTimeout(() => {
                    setPage((prevPage) => prevPage + 1);
                    setLoadingPage(false);
                }, 1000);
            }
        },
        [loadingPage, visibleQuestions.length, filteredQuestions.length]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(observerCallback, { threshold: 1.0 });

        if (observerRef.current) observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [observerCallback]);

    return (
        <div className="h-screen ">
            <div className="w-full flex md:flex-row flex-col justify-between md:gap-14 px-3.5 md:px-8">
                <section className="md:sticky top-0 md:h-screen md:w-[24rem] md:pt-24 pt-14 md:pr-6 flex flex-col gap-1 items-center md:border-r md:border-gray-400 border-b md:px-0 px-3.5 md:-mx-0 -mx-4">
                    <div className="w-full md:py-0 py-2 flex flex-row gap-1 justify-between items-center ">
                        {checkUser?.id &&
                            <p
                                className={`md:hidden text-sm h-9 px-2 py-1 flex items-center gap-1 rounded-md cursor-pointer ${isOpen ? "bg-red-700 text-white" : "hover:bg-red-800 hover:text-white"}`}
                                onClick={toggleForm}
                            >
                                {isOpen ?
                                    <SchoolRoundedIcon className="mr-1" /> :
                                    <SchoolOutlinedIcon className="mr-1" />
                                }
                                Question
                            </p>
                        }
                        <div className=" w-full flex flex-row pl-4 px-2 py-1 md:mb-4 justify-between items-center border rounded-xl text-xs">
                            <input
                                placeholder="Search related questions"
                                type="text"
                                className="md:h-10 h-7 w-full outline-none"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <SearchOutlinedIcon className="" />
                        </div>
                        {checkUser?.role === "admin" && (
                            <p
                                onClick={() => {
                                    setCheckQuestion(null)
                                    setShowUnapprovedOnly((prev) => !prev)
                                }}
                                className={`md:hidden relative h-9 px-3 py-1 mr-1 flex items-center gap-2 text-[#333333] rounded-md cursor-pointer ${showUnapprovedOnly
                                    ? "bg-red-700 text-white"
                                    : "hover:bg-red-800 hover:text-white"
                                    }`}
                            >
                                <ChecklistOutlinedIcon />
                                {unseenQuestions.length > 0 && (
                                    <span className="absolute top-0 -right-1 text-[0.5rem]  bg-red-500 text-white  px-2 py-1 rounded-full">
                                        {unseenQuestions.length}
                                    </span>
                                )}
                            </p>
                        )}

                        <div className="w-16 relative md:hidden flex flex-row px-2 py-1 justify-between items-center ">
                            {mobileFilter ?
                                <img
                                    onClick={() => setMobileFilter(false)}
                                    className=' h-5'
                                    src="/IMG_Forum/filter_black.png" alt="" />
                                :
                                <img
                                    onClick={() => setMobileFilter(true)}
                                    className=' h-5'
                                    src="/IMG_Forum/filter_white.png" alt="" />
                            }
                            {mobileFilter &&
                                <div className="h-fit w-44 absolute top-[2.65rem] right-2 z-30 flex flex-col overflow-y-auto overflow-hidden rounded-md text-xs bg-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                                    {types.map((type) => (
                                        <p
                                            key={type.name}
                                            onClick={() => {
                                                setCheckQuestion(null)
                                                setSpecifyQuestion(type.value)
                                            }}
                                            className={`h-11 px-3 md:pl-6 py-1 flex items-center gap-2 text-[#333333] hover:bg-gray-100  cursor-pointer ${specifyQuestion === type.value ? "bg-gray-200 " : "bg-transparent"
                                                }`}
                                        >
                                            {specifyQuestion === type.value ? type.filled : type.outlined}
                                            {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                                        </p>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>
                    <section className="hidden w-full md:flex md:flex-col flex-wrap gap-1 text-sm">
                        {types.map((type) => (
                            <p
                                key={type.name}
                                onClick={() => {
                                    setCheckQuestion(null)
                                    setSpecifyQuestion(type.value)
                                }}
                                className={`h-11 px-3 md:pl-6 py-1 flex items-center gap-2 text-[#333333] hover:bg-gray-100 rounded-md cursor-pointer ${specifyQuestion === type.value ? "bg-gray-200 " : "bg-transparent"
                                    }`}
                            >
                                {specifyQuestion === type.value ? type.filled : type.outlined}
                                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                            </p>
                        ))}
                        <div className="md:mt-4 md:pt-4 md:border-t flex md:flex-col flex-row gap-1 border-gray-400">
                            {checkUser?.id &&
                                <p
                                    className={`h-11 px-3 md:pl-6 py-1 flex items-center gap-2 rounded-md cursor-pointer ${isOpen ? "bg-red-700 text-white" : "hover:bg-red-800 hover:text-white"}`}
                                    onClick={toggleForm}
                                >
                                    {isOpen ?
                                        <SchoolRoundedIcon className="mr-2" /> :
                                        <SchoolOutlinedIcon className="mr-2" />
                                    }
                                    Ask a Question
                                </p>
                            }
                            {checkUser?.role === "admin" && (
                                <p
                                    onClick={() => {
                                        setCheckQuestion(null)
                                        setShowUnapprovedOnly((prev) => !prev)
                                    }}
                                    className={`h-11 px-3 md:pl-6 py-1 flex items-center gap-2 text-[#333333] rounded-md cursor-pointer ${showUnapprovedOnly
                                        ? "bg-red-700 text-white"
                                        : "hover:bg-red-800 hover:text-white"
                                        }`}
                                >
                                    <ChecklistOutlinedIcon />
                                    Approval

                                    {unseenQuestions.length > 0 && (
                                        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            {unseenQuestions.length}
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>
                    </section>
                </section>
                <MaxWidthWrapper className="w-full mb-8 flex lg:flex-row flex-col-reverse md:pt-24 pt-4 gap-8 px-0 md:px-0">
                    <section className="w-full ">
                        {isOpen &&
                            <section className="fixed h-screen flex items-center justify-center inset-0 z-50 bg-black bg-opacity-50">
                                <div className="h-[42rem] w-[60rem] mt-4 flex flex-col gap-4 rounded-xl py-4 px-6  mb-4 bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
                                    <section className="w-full flex flex-row items-center gap-4">
                                        {checkUser?.image ? (
                                            <img
                                                src={`data:${checkUser?.file_mime_type};base64,${checkUser?.image}`}
                                                className="h-11 w-11 object-cover rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                                                alt="Profile Picture"
                                            />
                                        ) : (
                                            <AccountCircleIcon
                                                style={{
                                                    width: '2.5rem',
                                                    height: '2.5rem',
                                                    color: 'rgb(69 10 10 / var(--tw-text-opacity, 1))',
                                                }}
                                            />
                                        )}
                                        <p className="w-full"> {checkUser?.name ? checkUser.name : checkUser.email}</p>
                                        <div className="p-1 cursor-pointer  rounded-full hover:bg-gray-300" onClick={toggleForm} >
                                            <CloseIcon className="" />
                                        </div>
                                    </section>
                                    <section
                                        className={`overflow-y-scroll transition-all duration-500 "
                                        }`}
                                    >
                                        <form className="flex flex-col px-3 gap-1 pb-4">
                                            <div className="flex flex-col gap-1">
                                                <input
                                                    type="text"
                                                    className="w-full border-[1px] border-gray-600 rounded-md mt-2 text-sm p-3"
                                                    placeholder="Question about"
                                                    value={topic}
                                                    onChange={(e) => setTopic(filter.clean(e.target.value))}
                                                />
                                                <p className="w-full flex justify-end  text-[0.7rem]">({topic.length}/300)</p>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <label className="w-fit">
                                                    <div className=" mt-3 flex justify-between gap-2 items-center flex-col p-4 rounded-xl border-2 border-dashed border-gray-500 bg-gray-200 cursor-pointer">
                                                        <img
                                                            src={imageFile instanceof File ? URL.createObjectURL(imageFile) : "/Icons/AddPic.png"}
                                                            className="h-12"
                                                            alt="Profile Preview"
                                                        />
                                                        <p className="text-center text-xs">Post Image</p>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={handleImageFileChange}
                                                        />
                                                    </div>
                                                </label>
                                                <p className="w-fit py-1 px-2 text-sm cursor-pointer text-gray-500 hover:text-red-400"
                                                    onClick={() => setImageFile(null)}
                                                >{imageFile?.name && "Remove Image"}</p>
                                            </div>
                                            <EditorToolbar toolbarId="t3" />
                                            <ReactQuill
                                                theme="snow"
                                                value={questionText}
                                                required
                                                onChange={setQuestionText}
                                                placeholder="Elaborate question..."
                                                modules={modules("t3")}
                                                formats={formats}
                                                className="bg-white border rounded  h-[55vh]  overflow-y-auto"
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
                                    </section>
                                </div>
                            </section>
                        }
                        {openEditQuestion &&
                            <section className="fixed h-screen flex items-center justify-center inset-0 z-50 bg-black bg-opacity-50">
                                <div className="h-[42rem] w-[60rem] mt-4 flex flex-col gap-4 rounded-xl py-4 px-6  mb-4 bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
                                    <section className="w-full flex flex-row items-center gap-4">
                                        {editQuestion?.user_image ? (
                                            <img
                                                src={editQuestion?.user_image}
                                                className="h-11 w-11 object-cover rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                                                alt="Profile Picture"
                                            />
                                        ) : (
                                            <AccountCircleIcon
                                                style={{
                                                    width: '2.5rem',
                                                    height: '2.5rem',
                                                    color: 'rgb(69 10 10 / var(--tw-text-opacity, 1))',
                                                }}
                                            />
                                        )}
                                        <p className="w-full"> {editQuestion?.name ? editQuestion.name : editQuestion.email}</p>
                                        <div className="p-1 cursor-pointer  rounded-full hover:bg-gray-300"
                                            onClick={() => setOpenEditQuestion(false)} >
                                            <CloseIcon className="" />
                                        </div>
                                    </section>
                                    <section
                                        className={`overflow-y-scroll transition-all duration-500 `}
                                    >
                                        <form
                                            onSubmit={(e) => handleEditSubmitQuestion(e, editQuestion.question_id)}
                                            className="flex flex-col px-3 gap-1 pb-4">
                                            <div className="flex flex-col gap-1">
                                                <input
                                                    type="text"
                                                    className="w-full border-[1px] border-gray-600 rounded-md mt-2 text-sm p-3"
                                                    placeholder="Question about"
                                                    value={editQuestion?.topic}
                                                    onChange={(e) => setEditQuestion({ ...editQuestion, topic: e.target.value })}
                                                />
                                                <p className="w-full flex justify-end  text-[0.7rem]">({editQuestion.topic.length}/300)</p>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <label className="w-fit">
                                                    <div className=" mt-3 flex justify-between gap-2 items-center flex-col p-4 rounded-xl border-2 border-dashed border-gray-500 bg-gray-200 cursor-pointer">
                                                        <img
                                                            src={editQuestion?.displayImageChange || editQuestion?.image || "/Icons/AddPic.png"}
                                                            className="h-12"
                                                            alt="Profile Preview"
                                                        />
                                                        <p className="text-center text-xs">Post Image</p>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const imageUrl = URL.createObjectURL(file);
                                                                    setEditQuestion({ ...editQuestion, image: file, displayImageChange: imageUrl });
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </label>
                                                <p className="w-fit py-1 px-2 text-sm cursor-pointer text-gray-500 hover:text-red-400"
                                                    onClick={() => setEditQuestion({ ...editQuestion, image: null })}
                                                >{editQuestion?.name && "Remove Image"}</p>
                                            </div>
                                            <EditorToolbar toolbarId="t2" />
                                            <ReactQuill
                                                key={editQuestion.question_id}
                                                theme="snow"
                                                value={editQuestion.question_text}
                                                onChange={(value) => setEditQuestion({ ...editQuestion, question_text: value })}
                                                placeholder="Elaborate question..."
                                                modules={modules("t2")}
                                                formats={formats}
                                                className="bg-white border rounded h-[55vh] overflow-y-auto"
                                            />

                                            <div className="flex flex-row justify-between items-center">
                                                <select
                                                    className="w-fit border-[1px] border-gray-600 rounded-md mt-2 text-sm p-3 pr-10"
                                                    value={editQuestion.topic_type}
                                                    onChange={(e) => setEditQuestion({ ...editQuestion, topic_type: e.target.value })}
                                                >
                                                    <option value="General">General</option>
                                                    <option value="Modules">Module</option>
                                                    <option value="Jobs">Job</option>
                                                    <option value="Announcements">Announcement</option>
                                                </select>
                                            </div>

                                            <div className="w-full flex justify-end items-center">
                                                <button
                                                    className="py-2 px-4 rounded-md border-[1px] text-sm text-white bg-red-900 hover:bg-red-700"
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </section>
                                </div>
                            </section>
                        }
                        <section className="m-auto  max-w-[780px]">
                            {/* Question List and Clicked question*/}
                            {checkQuestion ?
                                <section className="flex flex-col gap-2">
                                    <section className="flex flex-row gap-2 items-center">
                                        <div className=" flex items-center mr-2 bg-gray-100 hover:bg-gray-200 p-1 rounded-full cursor-pointer"
                                            onClick={() => setCheckQuestion(null)}
                                        >
                                            <ArrowBackOutlinedIcon style={{ fontSize: "20px" }} />
                                        </div>
                                        <div className="w-full flex flex-row items-center ">
                                            {checkQuestion?.user_image ? (
                                                <img
                                                    src={checkQuestion.user_image}
                                                    className="h-9 w-9 object-cover mr-2 rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                                                    alt="Profile Picture"
                                                />
                                            ) : (
                                                <AccountCircleIcon
                                                    style={{
                                                        width: '2.5rem',
                                                        height: '2.5rem',
                                                        marginRight: '0.5rem',
                                                        color: 'rgb(69 10 10 / var(--tw-text-opacity, 1))',
                                                    }}
                                                />
                                            )}
                                            <div className="flex flex-col gap-1 text-xs">
                                                {(checkUser?.id === checkQuestion.user_id || checkUser?.role === "admin") && (
                                                    <div className={`gap-1 text-xs ${checkQuestion.is_resolved ? "text-green-500" : "text-red-500"}`}>
                                                        <p>{checkQuestion.is_resolved ? "(Approved)" : "(Unapprove)"}</p>
                                                    </div>

                                                )}
                                                <div className="flex flex-wrap gap-1 items-center text-xs">
                                                    <p className=" text-gray-600">{checkQuestion.name ? checkQuestion.name : checkQuestion.email}</p>
                                                    <p>•</p>
                                                    <p className=" text-gray-500">{timeAgo(checkQuestion.created_at)}</p>
                                                    <p>•</p>
                                                    <p className=" text-gray-600">{checkQuestion.topic_type}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${checkUser.id ? "" : "hidden"}relative p-1 rounded-full cursor-pointer hover:bg-gray-300`}
                                            onClick={() => openPostOption(checkQuestion.question_id)} >
                                            <MoreHorizIcon className="" />
                                            {openPostId === checkQuestion.question_id &&
                                                <div className="w-36 absolute top-10 z-30 flex flex-col right-0 rounded-lg overflow-hidden text-sm bg-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                                                    {(checkUser?.role === "admin") && (
                                                        <div
                                                            onClick={(e) => {
                                                                handleAllowQuestion(checkQuestion.question_id, !checkQuestion.is_resolved);
                                                                e.stopPropagation();
                                                            }}
                                                            className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            {checkQuestion.is_resolved ? <CloseIcon /> : <CheckIcon />}
                                                            <p>{checkQuestion.is_resolved ? "Disapprove" : "Approve"}</p>
                                                        </div>

                                                    )}
                                                    {(checkUser?.id === checkQuestion.user_id || checkUser?.role === "admin") && (
                                                        <div
                                                            onClick={(e) => {
                                                                openPostOption()
                                                                handleEditQuestion(checkQuestion.question_id)
                                                                setOpenEditQuestion(true)
                                                                e.stopPropagation()
                                                            }}
                                                            className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            <EditOutlinedIcon />
                                                            <p>Edit</p>
                                                        </div>
                                                    )}
                                                    {(checkUser?.id === checkQuestion.user_id || checkUser?.role === "admin") && (
                                                        <div
                                                            key={updateDeleteKey}
                                                            onClick={() => {
                                                                setCheckQuestion(null)
                                                                handleDeleteQuestion(checkQuestion.question_id)
                                                            }}
                                                            className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            <DeleteOutlineIcon />
                                                            <p>Delete</p>
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        </div>
                                    </section>
                                    <h3 className="text-lg font-semibold">{checkQuestion.topic}</h3>
                                    <p className="ql-editor h-fit " dangerouslySetInnerHTML={{ __html: checkQuestion.question_text ?? "No description available" }}></p>
                                    {checkQuestion.image && (
                                        <div
                                            className="w-full h-auto relative rounded-xl bg-cover bg-center flex justify-center"
                                            style={{ backgroundImage: `url(${checkQuestion.image})` }}
                                        >
                                            <div className="absolute inset-0 bg-black/50 rounded-xl backdrop-blur-sm"></div>
                                            <img
                                                className="w-full aspect-[20/13] rounded-lg object-contain  cursor-pointer backdrop-blur-sm"
                                                src={checkQuestion.image}
                                                alt="Uploaded"
                                                onClick={() => setCheckImage(true)}
                                            />
                                            {checkImage && (
                                                <div
                                                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                                                    onClick={() => setCheckImage(false)}
                                                >
                                                    <div
                                                        className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <img className="w-full h-full object-contain"
                                                            src={checkQuestion.image} alt="Expanded" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    )}
                                    <div>
                                        {(() => {
                                            const userVote =
                                                all_QA?.votes?.find(
                                                    (vote) =>
                                                        vote?.target_id === checkQuestion.question_id &&
                                                        vote?.target_type === "question" &&
                                                        vote?.user_id === checkUser?.id
                                                ) || null;

                                            const isUpvoted = userVote?.vote_type === "up";
                                            const questionVotes = all_QA.votes.filter(
                                                (vote) => vote.target_id === checkQuestion.question_id && vote.target_type === "question");
                                            return (
                                                <section className="my-2 flex flex-row items-center justify-between gap-2">
                                                    <div className=" flex flex-row items-center gap-2 text-sm">
                                                        <button
                                                            className={`flex flex-row items-center justify-center w-20 px-2 py-1 rounded-full border bg-gray-100 hover:bg-gray-200  ${isUpvoted ? "text-red-500" : "text-black"}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleVote(
                                                                    checkQuestion.question_id,
                                                                    "question",
                                                                    isUpvoted ? "down" : "up"
                                                                )
                                                            }
                                                            }
                                                        >
                                                            {isUpvoted ? <FavoriteIcon style={{ fontSize: "18px" }} />
                                                                : <FavoriteBorderIcon style={{ fontSize: "18px" }} />}

                                                            <span className="ml-2 ">
                                                                {(() => {
                                                                    const heartCount = questionVotes.filter((vote) => vote.vote_type === "up").length
                                                                    return heartCount > 0 ? heartCount : 0
                                                                })()}
                                                            </span>
                                                        </button>

                                                        <a
                                                            href="#comment"
                                                            className="flex flex-row items-center justify-center w-20 px-2 py-1 rounded-full border bg-gray-100 hover:bg-gray-200"
                                                        >
                                                            <ChatBubbleOutlineRoundedIcon style={{ fontSize: "18px" }} />
                                                            <span className="ml-2 text-gray-500 ">
                                                                {(() => {
                                                                    const commentCount = all_QA.answers.filter(
                                                                        (answer) => answer.question_id === checkQuestion.question_id
                                                                    ).length;


                                                                    return commentCount > 0 ? commentCount : null;
                                                                })()}
                                                            </span>
                                                        </a>
                                                    </div>
                                                </section>
                                            );
                                        })()}
                                    </div>
                                    {/* Answer Form */}
                                    <form
                                        onClick={handleClickFirstCommentRef}
                                        onSubmit={(e) => handleAnswerSubmit(e, checkQuestion.question_id)}
                                        className="w-full max-h-36 overflow-y-auto py-3 text-xs cursor-pointer border-[1px] border-gray-600 rounded-3xl">
                                        <textarea
                                            ref={firstCommentRef}
                                            className="w-full px-4 outline-none"
                                            placeholder="Comment or Answer here."
                                            onInput={handleInputFirstCommentRef}
                                            value={answers[checkQuestion.question_id] || ""}
                                            rows={1}
                                            onChange={(e) =>
                                                handleAnswerChange(checkQuestion.question_id, filter.clean(e.target.value))
                                            }
                                        ></textarea>

                                        <div className=" w-full flex justify-end items-center text-[0.7rem] px-2 ">
                                            <button
                                                type="submit"
                                                className="py-2 px-4 rounded-3xl text-white border-[1px] border-red-900 hover:border-red-700 bg-red-900 hover:bg-red-700"
                                                disabled={loadingReply}
                                            >
                                                {loadingReply ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                                ) : (
                                                    "Reply"
                                                )}
                                            </button>
                                        </div>
                                    </form>


                                    <div id="comment" className="mt-4 transition-all duration-500 ease-in-out">
                                        <div className="space-y-2">
                                            {(() => {
                                                const relatedAnswers = all_QA.answers.filter(
                                                    (answer) => answer.question_id === checkQuestion?.question_id
                                                );

                                                return relatedAnswers.length > 0 ? (
                                                    relatedAnswers
                                                        .filter((answer) => !answer.parent_answer_id)
                                                        .map((answer) => {
                                                            const answerVotes = all_QA.votes.filter(
                                                                (vote) => vote.target_id === answer.answer_id && vote.target_type === "answer"
                                                            );
                                                            const userVote = answerVotes.find((vote) => vote.user_id === checkUser?.id);

                                                            const isLiked = userVote?.vote_type === "up";
                                                            const isDisliked = userVote?.vote_type === "down";

                                                            return (
                                                                <section key={answer.answer_id} className="flex flex-col gap-2 text-xs p-2">
                                                                    {/* Answer Header */}
                                                                    <div className="flex flex-row justify-between items-center">
                                                                        <div className="w-full flex flex-row items-center">
                                                                            {answer?.image ? (
                                                                                <img
                                                                                    src={answer.image}
                                                                                    className="h-9 w-9 object-cover mr-2 rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                                                                                    alt="Profile Picture"
                                                                                />
                                                                            ) : (
                                                                                <AccountCircleIcon
                                                                                    style={{
                                                                                        width: '2.5rem',
                                                                                        height: '2.5rem',
                                                                                        marginRight: '0.5rem',
                                                                                        color: 'rgb(69 10 10 / var(--tw-text-opacity, 1))',
                                                                                    }}
                                                                                />
                                                                            )}
                                                                            <p className="text-gray-600">{answer.name ? answer.name : answer.email}</p>
                                                                        </div>
                                                                        <div className={`${checkUser.id ? "" : "hidden"}relative p-1 rounded-full hover:bg-gray-300`}>
                                                                            <MoreHorizIcon className="cursor-pointer"
                                                                                onClick={() => openPostOption(answer.answer_id)} />
                                                                            {openPostId === answer.answer_id &&
                                                                                <div className="w-32 absolute top-10 z-30 flex flex-col right-0 rounded-lg overflow-hidden text-xs bg-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                                                                                    {(checkUser?.id === answer.user_id || checkUser?.role === "admin") && (
                                                                                        <div
                                                                                            onClick={() => {
                                                                                                openPostOption()
                                                                                                handleEdit(answer.answer_id, answer.answer_text)
                                                                                            }}
                                                                                            className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                                                                        >
                                                                                            <EditOutlinedIcon style={{ fontSize: "20px" }} />
                                                                                            <p>Edit</p>
                                                                                        </div>
                                                                                    )}
                                                                                    {(checkUser?.id === answer.user_id || checkUser?.role === "admin") && (
                                                                                        <div
                                                                                            onClick={() => handleDeleteAnswer(answer.answer_id)}
                                                                                            className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                                                                        >
                                                                                            <DeleteOutlineIcon style={{ fontSize: "20px" }} />
                                                                                            <p>Delete</p>
                                                                                        </div>
                                                                                    )}
                                                                                    {checkUser?.role === "admin" && (
                                                                                        <div
                                                                                            onClick={() => handleAccept(answer.answer_id, acceptedAnswers[answer.answer_id])}
                                                                                            className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                                                                        >
                                                                                            {acceptedAnswers[answer.answer_id] ?? answer.is_accepted ? <CloseIcon style={{ fontSize: "20px" }} /> : <CheckIcon style={{ fontSize: "20px" }} />}
                                                                                            {acceptedAnswers[answer.answer_id] ?? answer.is_accepted ? "Unaccept" : "Accept"}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    {editReply && editReply.anser_id == answer.answer_id ?
                                                                        <form
                                                                            onSubmit={(e) => {
                                                                                handleEdit(null, null)
                                                                                handleEditAnswer(e, answer.answer_id)
                                                                            }} className="w-full max-h-36 overflow-y-auto py-3 text-xs  border-[1px] border-gray-600 rounded-3xl">
                                                                            <textarea
                                                                                ref={textareaRef}
                                                                                className="w-full px-4 outline-none"
                                                                                onInput={handleInput}
                                                                                rows={1}
                                                                                placeholder="Write a reply..."
                                                                                value={editReply.answer_text}
                                                                                onChange={(e) => setEditReply((prev) => ({ ...prev, answer_text: filter.clean(e.target.value) }))}
                                                                            />
                                                                            <div className=" w-full flex justify-end items-center text-[0.7rem] gap-2 px-2 ">
                                                                                <button
                                                                                    onClick={() => handleEdit(answer.answer_id, answer.answer_text)}
                                                                                    className=" py-2 px-4 rounded-3xl text-white border-[1px] border-[#333333] hover:border-black bg-[#333333] hover:bg-black"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                <button
                                                                                    type="submit"
                                                                                    className=" py-2 px-4 rounded-3xl text-white border-[1px] border-red-900 hover:border-red-700 bg-red-900 hover:bg-red-700"
                                                                                >
                                                                                    Edit
                                                                                </button>
                                                                            </div>
                                                                        </form>
                                                                        :
                                                                        <div className="flex flex-row items-start">
                                                                            {answer.is_accepted && <span className="text-green-500"><CheckCircleSharpIcon /></span>}
                                                                            <p className="mt-1 ml-1">{answer.answer_text}</p>
                                                                        </div>

                                                                    }

                                                                    <div className="flex flex-row items-center gap-4">
                                                                        <div className="flex flex-row items-center gap-2">
                                                                            <button
                                                                                className={` ${isLiked ? "text-blue-500" : "text-gray-600"}`}
                                                                                onClick={() => handleVote(answer.answer_id, "answer", "up")}
                                                                            >
                                                                                {isLiked ? <ThumbUpAltIcon style={{ fontSize: "20px" }} /> : <ThumbUpOffAltIcon style={{ fontSize: "20px" }} />}
                                                                            </button>
                                                                            <p className="w-4 text-center text-sm text-gray-500">{answerVotes.length}</p>
                                                                            <button
                                                                                className={`${isDisliked ? "text-red-700" : "text-gray-600"}`}
                                                                                onClick={() => handleVote(answer.answer_id, "answer", "down")}
                                                                            >
                                                                                {isDisliked ? <ThumbDownAltIcon style={{ fontSize: "20px" }} /> : <ThumbDownOffAltIcon style={{ fontSize: "20px" }} />}
                                                                            </button>
                                                                        </div>
                                                                        <button
                                                                            className="text-gray-600 hover:text-black"
                                                                            onClick={() => setReplyingTo(replyingTo === answer.answer_id ? null : answer.answer_id)}
                                                                        >
                                                                            <ChatBubbleOutlineRoundedIcon style={{ fontSize: "20px" }} /> Reply
                                                                        </button>
                                                                    </div>
                                                                    {replyingTo === answer.answer_id && (
                                                                        <form
                                                                            onClick={handleClick}
                                                                            onSubmit={(e) => handleAnswerSubmit(e, answer.question_id, answer.answer_id)}
                                                                            className="w-full max-h-36 overflow-y-auto py-3 text-xs cursor-pointer border-[1px] border-gray-600 rounded-3xl">
                                                                            <textarea
                                                                                ref={textareaRef}
                                                                                className="w-full px-4 outline-none"
                                                                                onInput={handleInput}
                                                                                rows={1}
                                                                                placeholder="Write a reply..."
                                                                                value={answers[answer.answer_id] || ""}
                                                                                onChange={(e) => setAnswers((prev) => ({ ...prev, [answer.answer_id]: filter.clean(e.target.value) }))}
                                                                            />
                                                                            <div className=" w-full flex justify-end items-center text-[0.7rem] gap-2 px-2 ">
                                                                                <button
                                                                                    onClick={() => setReplyingTo(replyingTo === answer.answer_id ? null : answer.answer_id)}
                                                                                    className=" py-2 px-4 rounded-3xl text-white border-[1px] border-[#333333] hover:border-black bg-[#333333] hover:bg-black"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                <button
                                                                                    type="submit"
                                                                                    className="py-2 px-4 rounded-3xl text-white border-[1px] border-red-900 hover:border-red-700 bg-red-900 hover:bg-red-700"
                                                                                    disabled={loadingReply}
                                                                                >
                                                                                    {loadingReply ? (
                                                                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                                                                    ) : (
                                                                                        "Reply"
                                                                                    )}
                                                                                </button>
                                                                            </div>
                                                                        </form>

                                                                    )}

                                                                    {/* Nested Replies */}
                                                                    <div className="ml-6 border-l border-b border-gray-300 pl-4 mt-2 rounded-bl-3xl">

                                                                        {all_QA.answers
                                                                            .filter((reply) => reply.parent_answer_id === answer.answer_id)
                                                                            .map((reply) => (
                                                                                <Reply
                                                                                    key={reply.answer_id}
                                                                                    reply={reply}
                                                                                    all_QA={all_QA}
                                                                                    checkUser={checkUser}
                                                                                    handleVote={handleVote}
                                                                                    handleAnswerSubmit={handleAnswerSubmit}
                                                                                    answers={answers}
                                                                                    setAnswers={setAnswers}
                                                                                    replyingTo={replyingTo}
                                                                                    setReplyingTo={setReplyingTo}
                                                                                    updateReply={fetchAllQA}
                                                                                    editReply={editReply}
                                                                                    setEditReply={setEditReply}
                                                                                    handleEditAnswer={handleEditAnswer}
                                                                                    loadingReply={loadingReply}
                                                                                />
                                                                            ))}
                                                                    </div>
                                                                </section>
                                                            );
                                                        })
                                                ) : (
                                                    <p className="text-gray-500">No answers yet</p>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </section>
                                :
                                <section>
                                    {loading ? (
                                        <div className="w-full flex justify-center items-center">
                                            <div className="animate-spin h-16 w-16 border-4 border-red-500 border-t-transparent rounded-full"></div>
                                        </div>
                                    ) :
                                        <section>
                                            {visibleQuestions &&
                                                visibleQuestions
                                                    .filter((question) =>
                                                        (specifyQuestion === "all" || question.email === specifyQuestion || question.topic_type === specifyQuestion) &&
                                                        (checkUser?.role === "admin" || question.is_resolved || question.user_id === checkUser?.id) &&
                                                        (!showUnapprovedOnly || !question.is_resolved)
                                                    )
                                                    .length > 0 ? (
                                                visibleQuestions
                                                    .filter((question) =>
                                                        (specifyQuestion === "all" || question.email === specifyQuestion || question.topic_type === specifyQuestion) &&
                                                        (checkUser?.role === "admin" || question.is_resolved || question.user_id === checkUser?.id) &&
                                                        (!showUnapprovedOnly || !question.is_resolved)
                                                    )
                                                    .map((question) => {
                                                        const questionVotes = all_QA.votes.filter(
                                                            (vote) => vote.target_id === question.question_id && vote.target_type === "question"
                                                        );

                                                        return (
                                                            <section key={question.question_id} className="py-1 border-b border-gray-300 mb-1 ">
                                                                <div className="p-2 hover:bg-gray-50 rounded-xl flex flex-col gap-2 cursor-pointer"
                                                                    onClick={() => {
                                                                        window.scrollTo(0, 0)
                                                                        handleCheckQuestion(question.question_id)
                                                                    }
                                                                    }
                                                                >
                                                                    <section className="flex flex-row gap-2 items-center">
                                                                        <div className="w-full flex flex-row items-center ">
                                                                            {question?.user_image ? (
                                                                                <img
                                                                                    src={question.user_image}
                                                                                    className="h-9 w-9 object-cover mr-2 rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                                                                                    alt="Profile Picture"
                                                                                />
                                                                            ) : (
                                                                                <AccountCircleIcon
                                                                                    style={{
                                                                                        width: '2.5rem',
                                                                                        height: '2.5rem',
                                                                                        marginRight: '0.5rem',
                                                                                        color: 'rgb(69 10 10 / var(--tw-text-opacity, 1))',
                                                                                    }}
                                                                                />
                                                                            )}

                                                                            <div className="flex flex-col gap-1 text-xs">
                                                                                {(checkUser?.id === question.user_id || checkUser?.role === "admin") && (
                                                                                    <div className={`gap-1 text-xs ${question.is_resolved ? "text-green-500" : "text-red-500"}`}>
                                                                                        <p>{question.is_resolved ? "(Approved)" : "(Unapprove)"}</p>
                                                                                    </div>

                                                                                )}
                                                                                <div className="flex flex-wrap gap-1 items-center text-xs">
                                                                                    <p className=" text-gray-600">{question.name ? question.name : question.email}</p>
                                                                                    <p>•</p>
                                                                                    <p className=" text-gray-500">{timeAgo(question.created_at)}</p>
                                                                                    <p>•</p>
                                                                                    <p className=" text-gray-600">{question.topic_type}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className={`${checkUser?.id ? "" : "hidden"}relative p-1 rounded-full hover:bg-gray-300`}
                                                                            onClick={(e) => {
                                                                                openPostOption(question.question_id)
                                                                                e.stopPropagation()
                                                                            }
                                                                            }
                                                                        >
                                                                            <MoreHorizIcon className="cursor-pointer" />
                                                                            {openPostId === question.question_id &&
                                                                                <div className="w-36 absolute top-10 z-30 flex flex-col right-0 rounded-lg overflow-hidden text-sm bg-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                                                                                    {(checkUser?.role === "admin") && (
                                                                                        <div
                                                                                            onClick={(e) => {
                                                                                                handleAllowQuestion(question.question_id, !question.is_resolved);
                                                                                                e.stopPropagation();
                                                                                            }}
                                                                                            className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                                                                        >
                                                                                            {question.is_resolved ? <CloseIcon /> : <CheckIcon />}
                                                                                            <p>{question.is_resolved ? "Disapprove" : "Approve"}</p>
                                                                                        </div>

                                                                                    )}
                                                                                    {(checkUser?.id === question.user_id || checkUser?.role === "admin") && (
                                                                                        <div
                                                                                            onClick={(e) => {
                                                                                                openPostOption()
                                                                                                handleEditQuestion(question.question_id)
                                                                                                setOpenEditQuestion(true)
                                                                                                e.stopPropagation()
                                                                                            }
                                                                                            }
                                                                                            className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                                                                        >
                                                                                            <EditOutlinedIcon />
                                                                                            <p>Edit</p>
                                                                                        </div>
                                                                                    )}
                                                                                    {(checkUser?.id === question.user_id || checkUser?.role === "admin") && (
                                                                                        <div
                                                                                            key={updateDeleteKey}
                                                                                            onClick={(e) => {
                                                                                                handleDeleteQuestion(question.question_id)
                                                                                                e.stopPropagation()
                                                                                            }
                                                                                            }
                                                                                            className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                                                                        >
                                                                                            <DeleteOutlineIcon />
                                                                                            <p>Delete</p>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    </section>
                                                                    <h3 className=" font-semibold line-clamp-3">{question.topic}</h3>
                                                                    {question.image ? (
                                                                        <div
                                                                            className="w-full relative rounded-2xl bg-cover bg-center flex justify-center overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                                                                            style={{ backgroundImage: `url(${question.image})` }}
                                                                        >
                                                                            <div className="absolute inset-0 bg-black/20 rounded-xl backdrop-blur-lg"></div>
                                                                            <img
                                                                                className="w-full  aspect-[20/13] rounded-lg object-contain backdrop-blur-sm"
                                                                                src={question.image}
                                                                                alt="Uploaded"
                                                                            />
                                                                        </div>
                                                                    ) :
                                                                        <p className="h-fit text-sm text-[#333333] line-clamp-6">
                                                                            {stripHtml(question.question_text ?? "No description available")}
                                                                        </p>
                                                                    }
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
                                                                                <section className="my-2 flex flex-row items-center justify-between gap-2 ">
                                                                                    <div className=" flex flex-row items-center gap-2 text-sm">
                                                                                        <button
                                                                                            className={`flex flex-row items-center justify-center w-20 px-2 py-1 rounded-full border bg-gray-100 hover:bg-gray-200  ${isUpvoted ? "text-red-500" : "text-black"}`}
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation()
                                                                                                handleVote(
                                                                                                    question.question_id,
                                                                                                    "question",
                                                                                                    isUpvoted ? "down" : "up"
                                                                                                )
                                                                                            }
                                                                                            }
                                                                                        >
                                                                                            {isUpvoted ? <FavoriteIcon style={{ fontSize: "18px" }} />
                                                                                                : <FavoriteBorderIcon style={{ fontSize: "18px" }} />}

                                                                                            <span className="ml-2 ">
                                                                                                {(() => {
                                                                                                    const heartCount = questionVotes.filter((vote) => vote.vote_type === "up").length
                                                                                                    return heartCount > 0 ? heartCount : 0
                                                                                                })()}
                                                                                            </span>
                                                                                        </button>

                                                                                        <button
                                                                                            type="button"
                                                                                            className="flex flex-row items-center justify-center w-20 px-2 py-1 rounded-full border bg-gray-100 hover:bg-gray-200"
                                                                                        >
                                                                                            <ChatBubbleOutlineRoundedIcon style={{ fontSize: "18px" }} />
                                                                                            <span className="ml-2 ">
                                                                                                {(() => {
                                                                                                    const commentCount = all_QA.answers.filter(
                                                                                                        (answer) => answer.question_id === question.question_id
                                                                                                    ).length;
                                                                                                    return commentCount > 0 ? commentCount : 0;
                                                                                                })()}
                                                                                            </span>
                                                                                        </button>
                                                                                    </div>
                                                                                </section>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                </div>
                                                            </section>
                                                        );
                                                    })
                                            ) : (
                                                <p>No Questions Available</p>
                                            )}
                                            <div ref={observerRef} className="flex justify-center items-center py-4">
                                                {loadingPage && <div className="animate-spin h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full"></div>}
                                            </div>
                                        </section>
                                    }
                                </section>
                            }
                        </section>
                    </section>
                </MaxWidthWrapper>
                <section className="md:block  lg:w-[26rem] hidden ">

                </section>
            </div>
            <Footer />
        </div>
    );
}
