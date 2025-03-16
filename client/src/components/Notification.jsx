import useSocket from "../hooks/useSocket";
import { useEffect, useState } from "react";

export default function Notification() {
  const [user, setUser] = useState(null);
  const { questions, setQuestions } = useSocket(user?.id); // Use WebSocket hook

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      }
    }
    fetchUser();
  }, []);

  const handleMarkAsSeen = async (question_id) => {
    try {
      const response = await fetch("http://localhost:5000/api/mark-seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_id, user_id: user?.id }),
      });

      if (response.ok) {
        console.log(`✔️ Marked question ${question_id} as seen`);
        setQuestions((prev) => prev.filter((q) => q.question_id !== question_id)); // Remove from UI
      }
    } catch (error) {
      console.error("❌ Error marking question as seen:", error);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md shadow-lg bg-white">
      <h2 className="text-lg font-bold">📢 Live Questions</h2>
      {questions.length === 0 ? (
        <p>No new questions yet...</p>
      ) : (
        <ul>
          {questions.map((q) => (
            <li key={q.question_id} className="border-b py-2">
              <strong>Topic:</strong> {q.topic} <br />
              <strong>Question:</strong>{" "}
              <span dangerouslySetInnerHTML={{ __html: q.question_text }} />
              <br />
              <button
                onClick={() => handleMarkAsSeen(q.question_id)}
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Mark as Seen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
