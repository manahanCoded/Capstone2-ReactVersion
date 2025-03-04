import db from "../../Database/DB_Connect.mjs"

const qa_all = async (req, res) => {
    try {
        const [questions, answers, votes] = await Promise.all([
            db.query(`SELECT question_id,
                    q.user_id, 
                    q.question_text, 
                    q.created_at, 
                    q.topic, 
                    q.topic_type, 
                    q.is_resolved, 
                    q.image, 
                    q.file_mime_type,
                    u.id AS user_id,
                    u.email,
                    u.type,
                    u.name,
                    u.lastname,
                    u.role,
                    u.image AS user_image,
                    u.file_mime_type AS user_file_mime_type
                    FROM qa_questions q 
                    INNER JOIN users u
                    ON q.user_id = u.id
                    ORDER BY created_at DESC`),

            db.query(`SELECT 
                    QA_answers.answer_id,
                    QA_answers.question_id,
                    QA_answers.answer_text,
                    QA_answers.created_at,
                    QA_answers.is_accepted,
                    QA_answers.user_id,
                    QA_answers.parent_answer_id,
                    users.id,
                    users.email,
                    users.name,
                    users.lastname,
                    users.role,
                    users.image,
                    users.file_mime_type
                    FROM QA_answers
                    INNER JOIN users ON QA_answers.user_id = users.id
                    ORDER BY created_at
                    `),
            db.query("SELECT * FROM qa_votes")
        ]);

        const formattedQuestions = questions.rows.map((question) => ({
            ...question,
            image: question.image
                ? `data:${question.file_mime_type};base64,${question.image.toString("base64")}`
                : null,
            user_image: question.user_image
                ? `data:${question.user_file_mime_type};base64,${question.user_image.toString("base64")}`
                : null,
        }));

        const formattedAnswers = answers.rows.map((answers) => ({
            ...answers,
            image: answers.image
                ? `data:${answers.file_mime_type};base64,${answers.image.toString("base64")}`
                : null,
        }));

        res.status(200).json({
            questions: formattedQuestions,
            answers: formattedAnswers,
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
        res.status(500).json({ error: "Failed to save qeustion." });
    }
};


const update_question = async (req, res) => {
    const { id } = req.params;
    const { question_text, topic, topic_type, user_id } = req.body;

    if (!user_id || !question_text || !topic || !topic_type) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const checkResult = await db.query("SELECT * FROM QA_questions WHERE question_id = $1", [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: "Question not found" });
        }
        const image = req.file ? req.file.buffer : checkResult.rows[0].image;
        const file_mime_type = req.file ? req.file.mimetype : checkResult.rows[0].file_mime_type;

        const query = `
            UPDATE QA_questions SET 
            question_text = $1, 
            topic = $2,
            topic_type = $3, 
            image = $4,
            file_mime_type = $5,
            isUpdated = $6, 
            updated_by = $7
            WHERE question_id = $8
            RETURNING *;
        `;
        const values = [question_text, topic, topic_type, image, file_mime_type, true, user_id, id];

        const result = await db.query(query, values);

        return res.status(200).json({ 
            success: true, 
            message: "Question updated successfully", 
            updatedQuestion: result.rows[0] 
        });

    } catch (err) {
        console.error("Database Error:", err);

        if (err.code === "23505") {
            return res.status(409).json({ error: "Duplicate entry detected" });
        }

        return res.status(500).json({ error: "Failed to update question. Please try again." });
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
            [question_id, user_id, answer_text, parent_answer_id || null]
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


const update_answer = async (req, res) => {
    const {id} = req.params
    const {answer_text} = req.body
    try {
        if (!id)  return res.status(401).json({ error: "Answer must be specified." });
        if (!answer_text) return res.status(401).json({ error: "No update made." });
        
       const findAnswer = await db.query("SELECT * FROM qa_answers WHERE answer_id = $1", [id])
       if (findAnswer.rowCount === 0) return res.status(401).json({ error: "No such answer found" });

       const updateAnswer = await db.query("UPDATE qa_answers SET answer_text = $1 WHERE answer_id = $2", [answer_text, id])
       if (updateAnswer.rowCount === 0) return res.status(401).json({ error: "Update failed." });
       return res.status(200).json({ success: true, message: "Answer updated successfully" });

    } catch (error) {
        console.error("Error updating answer:", error);
        res.status(500).json({ error: "An error occurred while updating your answer." });
    } 

}



const vote = async (req, res) => {
    const { target_id, target_type, user_id, vote_type } = req.body;

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
};




const delete_question = async (req, res) => {
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


const delete_answer = async (req, res) => {
    const { answerId } = req.params;

    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }

    const { id: userId, role } = req.user;

    try {
        const question = await db.query('SELECT * FROM QA_answers WHERE answer_id = $1', [answerId]);

        if (question.rows.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        if (question.rows[0].user_id !== userId && role !== 'admin') {
            return res.status(403).json({ error: 'You do not have permission to delete this question' });
        }

        await db.query('DELETE FROM QA_answers WHERE answer_id = $1', [answerId]);

        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'An error occurred while deleting the question' });
    }
};


const isAccepted = async (req, res) => {
    const { id } = req.params
    try {
        const result = await db.query("SELECT is_accepted FROM qa_answers WHERE answer_id = $1 ", [id])

        if (result.rows[0].is_accepted == false) {
            await db.query("UPDATE qa_answers SET is_accepted = true WHERE answer_id = $1 RETURNING *", [id])
            return res.status(200).json({ message: "Successfully accepted", result: result.rows[0].is_accepted });
        } else {
            await db.query("UPDATE qa_answers SET is_accepted = false WHERE answer_id = $1 RETURNING *", [id])
            return res.status(200).json({ message: "Successfully removed accepted", result: result.rows[0].is_accepted });
        }

    } catch (err) {
        res.status(500).json({ error: 'An error occurred while accepting the question' });
    }
}





export { qa_all, question, answer, vote, delete_question, delete_answer, isAccepted, update_answer, update_question }