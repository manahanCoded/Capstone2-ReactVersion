import db from "../../Database/DB_Connect.mjs"

const qa_all = async (req, res) => {
    try {
        const [questions, answers, votes] = await Promise.all([
            db.query("SELECT * FROM qa_questions ORDER BY created_at DESC"),
            db.query("SELECT * FROM qa_answers ORDER BY answer_id"),
            db.query("SELECT * FROM qa_votes")
        ]);

        const formattedQuestions = questions.rows.map((question) => ({
            ...question,
            image: question.image
                ? `data:${question.file_mime_type};base64,${question.image.toString("base64")}`
                : null
        }));

        res.status(200).json({
            questions: formattedQuestions,
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
    const image = req.file ? req.file.buffer : null;
    const file_mime_type = req.file ? req.file.mimetype : null;

    if (!user_id || !question_text || !topic || !topic_type) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const query = `
        INSERT INTO QA_questions (user_id, question_text, topic, topic_type, image, file_mime_type)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
      `;
        const values = [user_id, question_text, topic, topic_type, image, file_mime_type];

        const result = await db.query(query, values);

        res.status(201).json({ question: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to insert question into database" });
    }
};

const answer = async (req, res) => {
    const { question_id, user_id, answer_text, parent_answer_id } = req.body;

    if (!user_id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!question_id || !answer_text) {
        return res.status(400).json({ error: "Question ID and answer text are required" });
    }

    try {
        const result = await db.query(
            `INSERT INTO QA_answers (question_id, user_id, answer_text, created_at, parent_answer_id) 
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) 
             RETURNING *`,
            [question_id, user_id, answer_text, parent_answer_id || null] // Allow null if it's a direct answer
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
};



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


const isAccepted = async (req,res)=>{
    const {id} = req.params
    try{
        const result =  await db.query("SELECT is_accepted FROM qa_answers WHERE answer_id = $1 ", [id])

        if(result.rows[0].is_accepted == false){
            await db.query("UPDATE qa_answers SET is_accepted = true WHERE answer_id = $1 RETURNING *", [id])
            return res.status(200).json({ message: "Successfully accepted", result: result.rows[0].is_accepted });
        }else{
            await db.query("UPDATE qa_answers SET is_accepted = false WHERE answer_id = $1 RETURNING *", [id])
            return res.status(200).json({ message: "Successfully removed accepted", result: result.rows[0].is_accepted });
        }

    }catch(err){
        res.status(500).json({ error: 'An error occurred while accepting the question' });
    }
}





export { qa_all, question, answer, vote, delete_item, isAccepted}