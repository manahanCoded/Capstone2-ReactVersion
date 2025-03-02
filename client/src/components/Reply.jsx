import { useRef, useState } from "react";
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import "react-quill-new/dist/quill.snow.css";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


const Reply = ({ reply, all_QA, checkUser, handleVote, handleAnswerSubmit, answers, setAnswers, replyingTo, setReplyingTo, updateReply, handleEditAnswer,  setEditReply, editReply}) => {
    const [showReplies, setShowReplies] = useState(true);
    const [acceptedAnswers, setAcceptedAnswers] = useState({});
    const [showEdit, setShowEdit] = useState(false)

    const handleEdit = (editID, editText) => {
        setEditReply({
            anser_id: editID,
            answer_text: editText
        })
    }

    const handleAccept = async (acceptID, isAccepted) => {
        try {
            const res = await fetch(`${API_URL}/api/question-answer/accept/${acceptID}`, {
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
                updateReply()
            } else {
                alert(`Error deleting question: ${data.error || "Unknown error"}`);
            }

        } catch (error) {
            console.error("Error deleting question:", error);
            alert("An error occurred while deleting the answer. Please try again.");
        }
    };

    const [openPostId, setOpenPostId] = useState(null);
    const openPostOption = (postId) => {
        if (!checkUser?.id) {
            alert("Log in first");
            navigate("/user/login");
            return;
        }
        setOpenPostId(openPostId === postId ? null : postId)
    }


    const textareaRef = useRef(null);
    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const replyVotes = all_QA.votes.filter(
        (vote) => vote.target_id === reply.answer_id && vote.target_type === "answer"
    );
    const userReplyVote = replyVotes.find((vote) => vote.user_id === checkUser?.id);

    const isLiked = userReplyVote?.vote_type === "up";
    const isDisliked = userReplyVote?.vote_type === "down";

    return (
        <section key={reply.answer_id} className="flex flex-col gap-2 text-xs p-2">

            <div className="flex flex-row justify-between items-center">
                <div className="w-full flex flex-row items-center">
                    {reply?.image ? (
                        <img
                            src={reply?.image}
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
                    <p className="text-gray-600">{reply.name ? reply.name : reply.email}</p>
                </div>
                <div className={`${checkUser.id ? "" : "hidden"}relative p-1 rounded-full hover:bg-gray-300`}>
                    <MoreHorizIcon className="cursor-pointer"
                        onClick={() => openPostOption(reply.answer_id)} />
                    {openPostId === reply.answer_id &&
                        <div className="w-32 absolute top-10 z-30 flex flex-col right-0 rounded-lg overflow-hidden text-xs bg-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                            {(checkUser?.id === reply.user_id || checkUser?.role === "admin") && (
                                <div
                                    onClick={() => handleEdit( reply.answer_id ,reply.answer_text)}
                                    className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                >
                                    <EditOutlinedIcon style={{ fontSize: "20px" }} />
                                    <p>Edit</p> 
                                </div>
                            )}
                            {(checkUser?.id === reply.user_id || checkUser?.role === "admin") && (
                                <div
                                    onClick={() => handleDeleteAnswer(reply.answer_id)}
                                    className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                >
                                    <DeleteOutlineIcon style={{ fontSize: "20px" }} />
                                    <p>Delete</p>
                                </div>
                            )}
                            {checkUser?.role === "admin" && (
                                <div
                                    onClick={() => handleAccept(reply.answer_id, acceptedAnswers[reply.answer_id])}
                                    className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                >
                                    <DeleteOutlineIcon style={{ fontSize: "20px" }} />
                                    {acceptedAnswers[reply.answer_id] ?? reply.is_accepted ? "Unaccept" : "Accept"}
                                </div>
                            )}
                        </div>
                    }
                </div>
            </div>
            {editReply && editReply.anser_id == reply.answer_id ?
                <form onSubmit={(e) => handleEditAnswer(e, reply.answer_id)} className="w-full max-h-36 overflow-y-auto py-3 text-xs  border-[1px] border-gray-600 rounded-3xl">
                    <textarea
                        ref={textareaRef}
                        className="w-full px-4 outline-none"
                        onInput={handleInput}
                        rows={1}
                        placeholder="Write a reply..."
                        value={editReply.answer_text}
                        onChange={(e) => setEditReply((prev) => ({...prev, answer_text: e.target.value}))}
                    />
                    <div className=" w-full flex justify-end items-center px-2 ">
                        <button
                            type="submit"
                            className=" py-2 px-4 rounded-3xl text-white border-[1px] border-red-900 hover:border-red-700 bg-red-900 hover:bg-red-700"
                        >
                            Reply
                        </button>
                    </div>
                </form>
                :
                <div className="flex flex-row items-start">
                    {reply.is_accepted && <span className="text-green-500"><CheckCircleSharpIcon /></span>}
                    <p className="mt-1 ml-1">{reply.answer_text}</p>
                </div>

            }

            <div className="flex flex-row items-center gap-4">
                <div className="flex flex-row items-center gap-2">
                    <button
                        className={` ${isLiked ? "text-blue-500" : "text-gray-600"}`}
                        onClick={() => handleVote(reply.answer_id, "answer", "up")}
                    >
                        {isLiked ? <ThumbUpAltIcon style={{ fontSize: "20px" }} /> : <ThumbUpOffAltIcon style={{ fontSize: "20px" }} />}
                    </button>
                    <p className="w-4 text-center text-sm text-gray-500">{replyVotes.length}</p>
                    <button
                        className={`${isDisliked ? "text-red-700" : "text-gray-600"}`}
                        onClick={() => handleVote(reply.answer_id, "answer", "down")}
                    >
                        {isDisliked ? <ThumbDownAltIcon style={{ fontSize: "20px" }} /> : <ThumbDownOffAltIcon style={{ fontSize: "20px" }} />}
                    </button>
                </div>
                <button
                    className="text-gray-600 hover:text-black"
                    onClick={() => setReplyingTo(replyingTo === reply.answer_id ? null : reply.answer_id)}
                >
                    <ChatBubbleOutlineRoundedIcon style={{ fontSize: "20px" }} /> Reply
                </button>
            </div>


            {replyingTo === reply.answer_id && (
                <form onSubmit={(e) => handleAnswerSubmit(e, reply.question_id, reply.answer_id)} className="w-full max-h-36 overflow-y-auto py-3 text-xs  border-[1px] border-gray-600 rounded-3xl">
                    <textarea
                        ref={textareaRef}
                        className="w-full px-4 outline-none"
                        onInput={handleInput}
                        rows={1}
                        placeholder="Write a reply..."
                        value={answers[reply.answer_id] || ""}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [reply.answer_id]: e.target.value }))}
                    />
                    <div className=" w-full flex justify-end items-center px-2 ">
                        <button
                            type="submit"
                            className=" py-2 px-4 rounded-3xl text-white border-[1px] border-red-900 hover:border-red-700 bg-red-900 hover:bg-red-700"
                        >
                            Reply
                        </button>
                    </div>
                </form>
            )}

            <button
                className="text-gray-600 mt-2 flex items-center gap-1"
                onClick={() => setShowReplies(!showReplies)}
            >
                {showReplies ? "Show Replies" : "Hide Replies"}
                <span className={`transform transition-transform ${showReplies ? "rotate-0" : "rotate-180"}`}>
                    ▼
                </span>
            </button>


            <div
                className={`ml-6 border-l border-b border-gray-300 rounded-bl-3xl pl-4 mt-2 transition-all duration-300 ease-in-out ${showReplies ? "opacity-0 max-h-0 overflow-hidden" : "opacity-100 "
                    }`}
            >
                {all_QA.answers
                    .filter((nestedReply) => nestedReply.parent_answer_id === reply.answer_id)
                    .map((nestedReply) => (
                        <Reply
                            key={nestedReply.answer_id}
                            reply={nestedReply}
                            all_QA={all_QA}
                            checkUser={checkUser}
                            handleVote={handleVote}
                            handleAnswerSubmit={handleAnswerSubmit}
                            answers={answers}
                            setAnswers={setAnswers}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            updateReply={updateReply}
                            editReply={editReply}
                            setEditReply={setEditReply}
                            handleEditAnswer={handleEditAnswer}
                        />
                    ))}
            </div>
        </section>
    );
};

export default Reply