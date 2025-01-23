import db from "../../Database/DB_Connect.mjs"

const qa_all = async (req, res) => {
    try {
        const [questions, answers, votes] = await Promise.all([
            db.query("SELECT * FROM qa_questions ORDER BY created_at DESC"),
            db.query("SELECT * FROM qa_answers "),
            db.query("SELECT * FROM qa_votes")
        ]);

        res.status(200).json({
            questions: questions.rows,
            answers: answers.rows,
            votes: votes.rows
        });
    } catch (err) {
        console.error("Error fetching QA data:", err.message);
        res.status(500).json({ error: "Failed to load Question & Answer data" });
    }
};


const question = async (req, res) => {
    const { user_id, question_text, topic, topic_type } = req.body;

    if (!user_id) {
        return res.status(401);
    }

    if (!question_text || !topic || !topic_type || !user_id) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const query = `
        INSERT INTO QA_questions (user_id, question_text, topic, topic_type)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `;
        const values = [user_id, question_text, topic, topic_type];

        const result = await db.query(query, values);

        res.status(201).json({ question: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to insert question into database' });
    }
};

const answer = async (req, res) => {
    const { question_id, user_id, answer_text } = req.body;

    if (!user_id) {
        return res.status(401);
    }

    if (!question_id || !user_id || !answer_text) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const result = await db.query(
            "INSERT INTO QA_answers (question_id, user_id, answer_text, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *",
            [question_id, user_id, answer_text]
        );
        res.status(201).json({
            message: "Answer submitted successfully",
            answer_id: result.rows[0].answer_id, 
            answer: result.rows[0] 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to submit answer" });
    }
}

const vote = async (req, res) => {
    const { target_id, target_type, user_id, vote_type } = req.body;

    if (!user_id) {
        return res.status(401);
    }

    if (!target_id || !target_type || !user_id || !vote_type) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const existingVote = await db.query(
            "SELECT * FROM qa_votes WHERE target_id = $1 AND target_type = $2 AND user_id = $3",
            [target_id, target_type, user_id]
        );

        if (vote_type === "remove") {
            await db.query(
                "DELETE FROM qa_votes WHERE target_id = $1 AND target_type = $2 AND user_id = $3",
                [target_id, target_type, user_id]
            );
            return res.status(200).json({ message: "Vote removed successfully" });
        }

        if (existingVote.rows.length > 0) {
            const updatedVote = await db.query(
                "UPDATE qa_votes SET vote_type = $1 WHERE vote_id = $2 RETURNING *",
                [vote_type, existingVote.rows[0].vote_id]
            );
            return res.status(200).json({ vote: updatedVote.rows[0] });
        }

        const newVote = await db.query(
            "INSERT INTO qa_votes (target_id, target_type, user_id, vote_type) VALUES ($1, $2, $3, $4) RETURNING *",
            [target_id, target_type, user_id, vote_type]
        );
        res.status(201).json({ vote: newVote.rows[0] });
    } catch (error) {
        console.error("Error processing vote:", error);
        res.status(500).json({ error: "An error occurred while processing your vote." });
    }
}



const delete_item = async (req, res) => {
    const { questionId } = req.params;

    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }

    const { id: userId, role } = req.user;

    try {
        const question = await db.query('SELECT * FROM QA_questions WHERE question_id = $1', [questionId]);

        if (question.rows.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        if (question.rows[0].user_id !== userId && role !== 'admin') {
            return res.status(403).json({ error: 'You do not have permission to delete this question' });
        }

        await db.query('DELETE FROM QA_questions WHERE question_id = $1', [questionId]);

        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'An error occurred while deleting the question' });
    }
};



export { qa_all, question, answer, vote, delete_item }