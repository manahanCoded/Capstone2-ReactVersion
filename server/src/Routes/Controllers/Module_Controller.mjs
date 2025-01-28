import db from "../../Database/DB_Connect.mjs";


const allModule_Storage = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const result = await db.query("SELECT * FROM module_storage_section WHERE id = $1", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Module not found" });
      }
      return res.json({ success: true, module: result.rows[0] });
    }
    const result = await db.query("SELECT * FROM module_storage_section ORDER BY id");
    return res.json({ success: true, listall: result.rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
};



const allModule = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM module ORDER BY id ");
    return res.json({ success: true, listall: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
};

const units = async (req, res) => {
  const { id } = req.params;

  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ success: false, message: "Invalid ID." });
  }

  try {
    const result = await db.query(
      "SELECT * FROM module WHERE storage_section_id = $1 ORDER BY id",
      [id]
    );

    return res.json({ success: true, listall: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
};

const addUnit = async (req, res) => {
  let { title, description, information , storage_section_id, publisher} = req.body;

  title = title.trim();
  title = title.replace(/\s+/g, ' '); //remove multiple spaces

  if (!title || !description || !information || !storage_section_id || !publisher) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    const checkTitleResult = await db.query(
      "SELECT * FROM module WHERE title = $1", 
      [title]
    );
    
    if (checkTitleResult.rowCount > 0) {
      return res.status(400).json({
        success: false,
        error: "Module with this title already exists"
      });
    }

    const result = await db.query(
      "INSERT INTO module (title, description, information, storage_section_id, publisher) VALUES ($1, $2, $3, $4, $5) RETURNING id", 
      [title, description, information, storage_section_id, publisher]
    );

 
    if (result.rowCount === 1) {
      return res.status(201).json({ success: true, moduleId: result.rows[0].id });
    } else {
      return res.status(500).json({ success: false, error: "Module insertion failed" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal Server error occurred" });
  }
};


const createModule = async (req, res) => {
  let { name, description, tags, created_by } = req.body;

  name = name.trim();
  description = description.trim();
  tags = tags.map((tag) => tag.trim()); 
  created_by = created_by.toString().trim(); 

  if (!name || !description || !tags.length || !created_by) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const query = `
      INSERT INTO module_storage_section (name, description, tags, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [name, description, tags, created_by];
    const { rows } = await db.query(query, values);

    return res.status(201).json({
      message: "Module created successfully.",
      newModule: rows[0],
    });
  } catch (error) {
    if (error.code === "23505") { 
      return res.status(400).json({
        error: `A module with the name "${name}" already exists. Please choose a different name.`,
      });
    }

    return res.status(500).json({ error: "An internal server error occurred." });
  }
};


const updateModule = async (req, res) => {
  const { id } = req.params;
  const { name, description, tags } = req.body;

  if (!id || !name || !description || !tags) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Convert tags to a PostgreSQL array format: {tag1, tag2, tag3}
    const tagsString = Array.isArray(tags) ? `{${tags.join(",")}}` : `{${tags}}`;

    const query = `
      UPDATE module_storage_section
      SET name = $1, description = $2, tags = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [name.trim(), description.trim(), tagsString.trim(), id];

    const { rows } = await db.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Module not found." });
    }

    return res.status(200).json({
      message: "Module updated successfully.",
      updatedModule: rows[0],
    });
  } catch (error) {

    if (error.code === "23505") {
      return res.status(400).json({
        error: `A module with the name "${name}" already exists. Please choose a different name.`,
      });
    }

    return res.status(500).json({ error: "An internal server error occurred." });
  }
};

 


const removeModule = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Module ID is required." });
  }

  try {
    const query = `DELETE FROM module_storage_section WHERE id = $1 RETURNING *;`;
    const { rows } = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Module not found." });
    }

    return res.status(200).json({ message: "Module deleted successfully." });
  } catch (error) {
    console.error("Error deleting module:", error);
    return res.status(500).json({ error: "An internal server error occurred." });
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
  const { ids, title, description, information } = req.body;

  if (!ids || !title || !description || !information) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    const checkTitleResult = await db.query(
      "SELECT * FROM module WHERE title = $1 AND id != $2", 
      [title, ids]
    );

    if (checkTitleResult.rowCount > 0) {
      return res.status(400).json({
        success: false,
        error: "Module with this title already exists"
      });
    }
    const result = await db.query(
      "UPDATE module SET title = $1, description = $2, information = $3 WHERE id = $4",
      [title, description, information, ids]
    );

    if (result.rowCount === 1) {
      return res.json({ success: true, message: "Module updated successfully" });
    } else {
      return res.status(404).json({ success: false, message: "Module not found or no changes made" });
    }
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ success: false, error: "Database error occurred" });
  }
};



const addQuestion = async (req, res) => {
  let { module_title, questions } = req.body;

  module_title = module_title.trim();
  module_title = module_title.replace(/\s+/g, ' '); // Remove multiple spaces

  try {
    if (!module_title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid module title or questions data" });
    }

    const moduleResult = await db.query(
      `SELECT id FROM module WHERE title = $1`, 
      [module_title]
    );

    if (moduleResult.rows.length === 0) {
      return res.status(404).json({ message: "Module not found" });
    }

    const moduleId = moduleResult.rows[0].id; 


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
        [moduleId, question_text, option_a, option_b, option_c, option_d, trimmedCorrectOption]
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
  const title = req.query.title;
 
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
      INNER JOIN questions q ON m.id = q.module_title  
      WHERE m.title = $1;
    `, [title]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving questions:', error);
    res.status(500).json({ message: 'Error retrieving questions', error });
  }
};



const user_score = async (req, res) => {
  const { user_id, module_id, completed, score, passed, attempt_number, time_spent, feedback, perfect_score } = req.body;

  if (!user_id || !module_id || score === undefined || passed === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {

    const existingQuiz = await db.query(
      'SELECT * FROM module_scores WHERE user_id = $1 AND module_id = $2',
      [user_id, module_id]
    );

    const existingAttemptNumber = existingQuiz.rows.length > 0 ? existingQuiz.rows[0].attempt_number : 0;
    const existingTimeSpent = existingQuiz.rows.length > 0 ? existingQuiz.rows[0].time_spent : 0;

    const userTries = Number(attempt_number) + Number(existingAttemptNumber);
    const totalTimeSpent = (Number(existingTimeSpent) || 0) + (Number(time_spent) || 0);

    if (isNaN(userTries) || isNaN(totalTimeSpent)) {
      return res.status(400).json({ error: 'Invalid attempt_number or time_spent' });
    }
    const completion_date = new Date().toISOString();

    if (existingQuiz.rows.length > 0) {
      // Update existing record
      await db.query(
        `UPDATE module_scores 
        SET score = $1, passed = $2, attempt_number = $3, time_spent = $4, feedback = $5, completed = $6, perfect_score = $7, completion_date = $8
        WHERE user_id = $9 AND module_id = $10`,
        [score, passed, userTries, totalTimeSpent, feedback, completed, perfect_score, completion_date, user_id, module_id]
      );
    } else {
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


const getAllModule_UserInfo = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.email,
        u.id AS user_id,
        m.title AS unit,
        ms.score,
        ms.attempt_number,
        ms.time_spent,
        ms.completed,
        ms.completion_date,
        ms.perfect_score,
        ms.feedback
      FROM 
        users u
      LEFT JOIN 
        module_scores ms ON u.id = ms.user_id  
      LEFT JOIN 
        module m ON ms.module_id = m.id
      WHERE 
        ms.user_id IS NOT NULL 
    `;
    
    const result = await db.query(query);

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No quiz data found for any user' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching all user info:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export {allModule_Storage, units, updateModule, removeModule, allModule, createModule, addUnit, getModuleIds, editModule, addQuestion, allQuestion ,deleteModule, user_score, getUser_score, getAllModule_UserInfo};
