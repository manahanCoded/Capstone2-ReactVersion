import db from "../../Database/DB_Connect.mjs";

const allModule = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM module");
    return res.json({ success: true, listall: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
};


const addModule = async (req, res) => {
  try {
    const result = await db.query(
      "INSERT INTO module (title, description, information) VALUES ($1, $2, $3)",
      [req.body.title, req.body.description, req.body.information]
    );
    if (result.rowCount === 1) {
      return res.json({ success: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Database error" });
  }
};


const getModuleIds = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM module WHERE id = $1", [req.body.ids]); 
    if (result.rows.length > 0) {
      return res.json({ success: true, listId: result.rows });
    } else {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Database error" });
  }
};



const editModule = async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE module SET title = $1, description = $2, information = $3 WHERE id = $4",
      [req.body.title, req.body.description, req.body.information, req.body.ids]
    );

    if (result.rowCount === 1) {
      return res.json({ success: true });
    } else {
      return res.status(404).json({ success: false, message: "Article not found or no changes made" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Database error" });
  }
};


const addQuestion = async (req, res) => {
  const { module_title, questions } = req.body;

  try {
    if (!module_title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid module title or questions data" });
    }
    for (const question of questions) {
      const { question_text, option_a, option_b, option_c, option_d, correct_option } = question;


      if (!question_text || !option_a || !option_b || !option_c || !option_d || !correct_option) {
        throw new Error("Incomplete question details");
      }

      const trimmedCorrectOption = correct_option.trim().toUpperCase();
 
      const validOptions = ['A', 'B', 'C', 'D'];
      if (!validOptions.includes(trimmedCorrectOption)) {
        throw new Error("Invalid correct option");
      }

      await db.query(
        `
          INSERT INTO questions (module_title, question_text, option_a, option_b, option_c, option_d, correct_option)
          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
        `,
        [module_title, question_text, option_a, option_b, option_c, option_d, trimmedCorrectOption]
      );
    }

    res.status(201).json({ message: "Questions created successfully" });
  } catch (error) {
    console.error("Error adding question:", error.message);
    res.status(500).json({ message: "Error adding question", error: error.message });
  }
};



const deleteModule = async (req, res) => {
  const { id } = req.params;

  try {

    const result = await db.query("DELETE FROM module WHERE id = $1", [id]);
    if (result.rowCount > 0) {

      res.status(200).json({ message: "Module deleted successfully" });
    } else {
      res.status(404).json({ message: "Module not found" });
    }
  } catch (error) {
    console.error("Error deleting module:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const allQuestion = async (req, res) => {
  const title = req.query.title; // Extract the title from the query string

  try {
    const result = await db.query(`
      SELECT 
        m.title AS module_title, 
        q.id AS question_id, 
        q.question_text, 
        q.option_a, 
        q.option_b, 
        q.option_c, 
        q.option_d, 
        q.correct_option, 
        q.created_at, 
        q.updated_at
      FROM module m
      INNER JOIN questions q ON m.title = q.module_title
      WHERE m.title = $1;
    `, [title]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving questions:', error);
    res.status(500).json({ message: 'Error retrieving questions', error });
  }
};


const user_score = async (req, res) => {
  const { user_id, module_id, completed, score, passed, attempt_number, timeSpent, feedback, perfect_score } = req.body;

  if (!user_id || !module_id || score === undefined || passed === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get current date and time for completion_date
    const completion_date = completed ? new Date() : null;

    const existingQuiz = await db.query(
      'SELECT * FROM module_scores WHERE user_id = $1 AND module_id = $2',
      [user_id, module_id]
    );

    const existingAttemptNumber = existingQuiz.rows.length > 0 ? existingQuiz.rows[0].attempt_number : 0;
    const existingTimeSpent = existingQuiz.rows.length > 0 ? existingQuiz.rows[0].time_spent : 0;

    const userTries = Number(attempt_number) + Number(existingAttemptNumber);
    const totalTimeSpent = (Number(existingTimeSpent) || 0) + (Number(timeSpent) || 0); // Ensure timeSpent is properly converted to number

    if (isNaN(userTries) || isNaN(totalTimeSpent)) {
      return res.status(400).json({ error: 'Invalid attempt_number or time_spent' });
    }

    if (existingQuiz.rows.length > 0) {
      // Update existing record
      await db.query(
        `UPDATE module_scores 
        SET score = $1, passed = $2, attempt_number = $3, time_spent = $4, feedback = $5, completed = $6, prefect_score = $7, completion_date = $8
        WHERE user_id = $9 AND module_id = $10`,
        [score, passed, userTries, totalTimeSpent, feedback, completed, perfect_score, completion_date, user_id, module_id]
      );
    } else {
      // Insert new record with completion_date
      await db.query(
        `INSERT INTO module_scores (user_id, module_id, score, passed, attempt_number, time_spent, feedback, completed, perfect_score, completion_date) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [user_id, module_id, score, passed, attempt_number, totalTimeSpent, feedback, completed, perfect_score, completion_date]
      );      
    }
    res.status(200).json({ message: 'Quiz progress saved successfully!' });
  } catch (error) {
    console.error('Error saving quiz progress:', error);
    res.status(500).json({ error: 'Failed to save quiz progress' });
  }
};




const getUser_score = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id parameter' });
  }

  try {
      const response = await db.query("SELECT * FROM module_scores WHERE user_id = $1", [id]);

      if (response.rows.length === 0) {
          return res.status(404).json({ message: 'No scores found for this user' });
      }

      res.status(200).json(response.rows);
  } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

export { allModule, addModule, getModuleIds, editModule, addQuestion, allQuestion ,deleteModule, user_score, getUser_score};
