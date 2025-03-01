import { useState } from "react";
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import "react-quill-new/dist/quill.snow.css";

 
 

const Reply = ({ reply, all_QA, checkUser, handleVote, handleAnswerSubmit, answers, setAnswers, replyingTo, setReplyingTo }) => {
  const [showReplies, setShowReplies] = useState(true); 

  const replyVotes = all_QA.votes.filter(
    (vote) => vote.target_id === reply.answer_id && vote.target_type === "answer"
  );
  const userReplyVote = replyVotes.find((vote) => vote.user_id === checkUser?.id);

  const isLiked = userReplyVote?.vote_type === "up";
  const isDisliked = userReplyVote?.vote_type === "down";

  return (
    <div key={reply.answer_id} className="p-2 bg-gray-100 rounded-md">
 
      <div className="flex flex-row items-start">
        <p className="text-gray-700">{reply.answer_text}</p>
      </div>

      <div className="flex flex-row gap-1 mt-2">
        <button
          className={`mr-2 ${isLiked ? "text-blue-500" : "text-gray-500"}`}
          onClick={() => handleVote(reply.answer_id, "answer", "up")}
        >
          {isLiked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
        </button>
        <button
          className={`mr-2 ${isDisliked ? "text-red-700" : "text-gray-500"}`}
          onClick={() => handleVote(reply.answer_id, "answer", "down")}
        >
          {isDisliked ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
        </button>
        <p className="text-sm text-gray-500">{replyVotes.length}</p>
      </div>

      <button
        className="text-blue-500 mt-2"
        onClick={() => setReplyingTo(replyingTo === reply.answer_id ? null : reply.answer_id)}
      >
        {replyingTo === reply.answer_id ? "Cancel Reply" : "Reply"}
      </button>


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

      <button
        className="text-gray-600 mt-2 flex items-center gap-1"
        onClick={() => setShowReplies(!showReplies)}
      >
        {showReplies ? "Hide Replies" : "Show Replies"}
        <span className={`transform transition-transform ${showReplies ? "rotate-180" : "rotate-0"}`}>
          ▼
        </span>
      </button>


      <div
        className={`ml-6 border-l pl-4 mt-2 transition-all duration-300 ease-in-out ${
          showReplies ? "opacity-100 " : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        {all_QA.answers
          .filter((nestedReply) => nestedReply.parent_answer_id === reply.answer_id) // Filter nested replies
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
            />
          ))}
      </div>
    </div>
  );
};

export default Reply