
import db from "../../Database/DB_Connect.mjs";

const create_job = async (req, res) => {
  const {
    publisher,
    name,
    phone,
    email,
    title,
    applicants,
    remote,
    experience,
    jobtype,
    salary,
    state,
    city,
    street,
    description,
    date,
  } = req.body;


  if (
    !publisher ||
    !name ||
    !email ||
    !title ||
    !state ||
    !experience||
    !city ||
    !street ||
    !description ||
    !date
  ) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  if (phone && (!/^\d{10,15}$/.test(phone) || phone.length > 15)) {
    return res.status(400).json({ message: "Invalid phone number format." });
  }


  if (applicants && isNaN(Number(applicants))) {
    return res.status(400).json({ message: "Salary must be a valid number." });
  }

  try {
    await db.query(
      `INSERT INTO jobs 
       (publisher, name, phone, email, title, applicants, remote, jobtype, salary, state, city, street, description, date, experience) 
       VALUES 
       ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        publisher,
        name,
        phone,
        email,
        title,
        applicants || 0, 
        remote || false, 
        jobtype || false, 
        salary || null,
        state,
        city,
        street,
        description,
        date,
        experience
      ]
    );

    return res.status(201).json({ message: "Job created successfully." });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({ message: "An error occurred while creating the job." });
  }
};



const display_job = async (req, res) => {
  try {
    const response = await db.query("SELECT * from jobs");
    res.json(response.rows); 
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Failed to fetch jobs" }); 
  }
};



const upload_appointment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const { jobId, name, email, date, application } = req.body;
    const fileUrl = `/api/job/uploads/${req.file.filename}`

    if (!jobId || !name || !email || !date || !application) {
      return res.status(400).send("Missing required fields.");
    }

    const result = await db.query("SELECT * FROM jobs WHERE id = $1", [jobId]);

    if (result.rows.length === 0) {
      return res.status(404).send("Job not found.");
    }

    const currentApplicants = result.rows[0].title;

    await db.query(
      "INSERT INTO applicants (jobid, job_title, fullname,email, date, application, resume) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [jobId, currentApplicants, name, email, date, application, fileUrl] 
    );

    await db.query("UPDATE jobs SET applicants = applicants + 1 WHERE id = $1", [jobId]);

    res.status(200).send("File uploaded and applicants count updated.");
  } catch (error) {
    console.error("Error during upload:", error);
    res.status(500).send("An error occurred.");
  }
};

const display_appointments = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM applicants ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const displayUser_appointments = async(req, res) => {
  try {
    const {user} = req.params
    const result = await db.query("SELECT * FROM applicants WHERE email = $1 ORDER BY id DESC", [user]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const specific_job = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await db.query("SELECT * FROM jobs WHERE id = $1", [id]);

    if (job.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job.rows[0]); 
  } catch (error) {
    console.error("Error fetching specific job:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const upDatejob = async( req, res)=>{
  const jobEditID = req.params.jobEditID; 
  const {
    name,
    phone,
    email,
    title,
    jobtype,
    remote,
    experience,
    salary,
    state,
    city,
    street,
    description,
    date
  } = req.body; 


  if (!name || !title || !jobtype || !salary) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const query = `
      UPDATE jobs
      SET
        name = $1,
        phone = $2,
        email = $3,
        title = $4,
        jobtype = $5,
        remote = $6,
        experience = $7,
        salary = $8,
        state = $9,
        city = $10,
        street = $11,
        description = $12,
        update_date = $13
      WHERE id = $14
      RETURNING *;`;

  
    const result = await db.query(query, [
      name,
      phone,
      email,
      title,
      jobtype,
      remote,
      experience,
      salary,
      state,
      city,
      street,
      description,
      date,
      jobEditID, 
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(201).json({ message: "Job updated successfully", job: result.rows[0] });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export { create_job, display_job, upload_appointment, display_appointments, displayUser_appointments, specific_job, upDatejob };
