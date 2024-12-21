import db from "../../Database/DB_Connect.mjs";

const allAnnouncement = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM announcements ORDER BY id DESC");
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ success: false, message: "Error fetching announcements" });
    }
};

const addAnnouncement = async (req, res) => {
    const { title, publisher,description, date } = req.body;
  
    if (!title || !description || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, and date",
      });
    }
  
    try {
      const result = await db.query(
        "INSERT INTO announcements (title, publisher, description, date) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, publisher,description, date]
      );
      return res.status(201).json({
        success: true,
        message: "Announcement successfully added",
        data: result.rows[0],
      });
    } catch (err) {
      console.error("Database Query Error:", err.message);
      if (err.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "Duplicate entry detected. Please use unique values.",
        });
      }
  
      return res.status(500).json({
        success: false,
        message: "An error occurred while adding the announcement",
        error: err.message, 
      });
    }
  };
  

export { allAnnouncement, addAnnouncement };