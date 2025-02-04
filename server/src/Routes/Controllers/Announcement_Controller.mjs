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

  const editAnnouncement = async (req, res) => {
    const { id, title, publisher, description, date } = req.body;
  
    if (!id || !title || !description || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: id, title, description, and date",
      });
    }
  
    try {
      const result = await db.query(
        "UPDATE announcements SET title = $1, publisher = $2, description = $3, date = $4 WHERE id = $5 RETURNING *",
        [title, publisher, description, date, id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: "Announcement not found" });
      }
  
      return res.status(200).json({
        success: true,
        message: "Announcement successfully updated",
        data: result.rows[0],
      });
    } catch (err) {
      console.error("Database Query Error:", err.message);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the announcement",
        error: err.message,
      });
    }
};

const deleteAnnouncement = async (req, res) => {
    const { id } = req.body;
  
    if (!id) {
      return res.status(400).json({ success: false, message: "Missing required field: id" });
    }
  
    try {
      const result = await db.query("DELETE FROM announcements WHERE id = $1 RETURNING *", [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: "Announcement not found" });
      }
  
      return res.status(200).json({ success: true, message: "Announcement successfully deleted" });
    } catch (err) {
      console.error("Database Query Error:", err.message);
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the announcement",
        error: err.message,
      });
    }
};

  

export { allAnnouncement, addAnnouncement, editAnnouncement, deleteAnnouncement };