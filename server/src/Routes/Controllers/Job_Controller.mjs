
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
    moreinfo,
    date,
  } = req.body;


  if (
    !publisher ||
    !name ||
    !email ||
    !title ||
    !state ||
    !experience ||
    !city ||
    !street ||
    !description ||
    !moreinfo ||
    !date
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided." });
  }


  if (phone && (!/^\d{10,15}$/.test(phone) || phone.length > 15)) {
    return res.status(400).json({ message: "Invalid phone number format." });
  }


  if (applicants && isNaN(Number(applicants))) {
    return res.status(400).json({ message: "Applicants must be a valid number." });
  }

  try {

    let fileBuffer = null;
    let fileName = null;
    let fileMimeType = null;

    if (req.file) {
      fileBuffer = req.file.buffer;
      fileName = req.file.originalname;
      fileMimeType = req.file.mimetype;
    }


    await db.query(
      `INSERT INTO jobs 
       (publisher, name, phone, email, title, applicants, remote, jobtype, salary, state, city, street, description, moreinfo, date, experience, file_name, file_data, file_mime_type) 
       VALUES 
       ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
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
        moreinfo,
        date,
        experience,
        fileName,
        fileBuffer,
        fileMimeType,
      ]
    );

    return res.status(201).json({ message: "Job created successfully." });
  } catch (error) {
    console.error("Error creating job:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the job." });
  }
};



const display_job = async (req, res) => {
  try {
    const response = await db.query("SELECT * from jobs ORDER BY id ");

    const jobsWithImages = response.rows.map((job) => {
      if (job.file_data) {
        job.file_data = `data:${job.file_mime_type};base64,${job.file_data.toString("base64")}`;
      }
      return job;
    });

    res.json(jobsWithImages);
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

    if (!jobId || !name || !email || !date || !application) {
      return res.status(400).send("Missing required fields.");
    }

    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate)) {
      return res.status(400).send("Invalid date.");
    }

    const result = await db.query("SELECT * FROM jobs WHERE id = $1", [jobId]);
    if (result.rows.length === 0) {
      return res.status(404).send("Job not found.");
    }

    const currentApplicants = result.rows[0].title;
    await db.query(
      `INSERT INTO applicants 
      (jobid, job_title, fullname, email, date, application, resume, file_mime_type) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [jobId, currentApplicants, name, email, date, application, req.file.buffer, req.file.mimetype]
    );

    // Update applicants count for the job
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

    const formattedAppointments = await Promise.all(
      result.rows.map(async (applicant) => {
        const appointmentDate = new Date(applicant.date);

        if (isNaN(appointmentDate)) {
          return {
            ...applicant,
            date: 'No date available',
            resumeUrl: null,
          };
        }

        let resumeUrl = null;
        if (applicant.resume) {
            const resumeData = applicant.resume;
            const mimeType = applicant.file_mime_type;

            const resumeBase64 = resumeData.toString('base64');

            if (applicant.file_mime_type?.startsWith("image/")) {
              resumeUrl = `data:${mimeType};base64,${resumeBase64}`;
            } else {
              resumeUrl = `data:application/octet-stream;base64,${resumeBase64}`;
            }
          }

        return {
          ...applicant,
          resumeUrl: resumeUrl || null,
        };
      })
    );

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const downloadApplication = async (req, res) => {
  try {
    const applicantId = req.params.id;

    // Fetch the file data and MIME type from the database
    const result = await db.query('SELECT resume, file_mime_type FROM applicants WHERE id = $1', [applicantId]);

    if (result.rows.length === 0) {
      return res.status(404).send('File not found');
    }

    const resumeData = result.rows[0].resume; // Binary data
    const mimeType = result.rows[0].file_mime_type || 'application/octet-stream'; // Default MIME type if none is found

    // Set headers for downloading the file
    res.setHeader('Content-Type', mimeType); // Set the correct file type
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="resume-${applicantId}.${mimeType.split('/')[1]}"`
    ); // Set the file name with extension

    // Send the binary file data
    res.send(resumeData);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).send('Internal server error');
  }
}


const displayUser_appointments = async (req, res) => {
  try {
    const { user } = req.params;

    const result = await db.query(
      "SELECT * FROM applicants WHERE email = $1 ORDER BY id DESC",
      [user]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No applicants found" });
    }

    const formattedApplicants = result.rows.map((applicant) => {
      let resumeUrl = null;

      if (applicant.resume) {
        const resumeBase64 = applicant.resume.toString("base64");

        if (applicant.file_mime_type?.startsWith("image/")) {
          resumeUrl = `data:${applicant.file_mime_type};base64,${resumeBase64}`;
        } else {
          resumeUrl = `data:application/octet-stream;base64,${resumeBase64}`;
        }
      }

      return {
        ...applicant,
        resumeUrl,
      };
    });

    res.status(200).json(formattedApplicants);
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

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
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
      moreinfo,
    } = req.body;

    let query = `
      UPDATE jobs SET 
        name = $1, phone = $2, email = $3, title = $4, jobtype = $5, remote = $6,
        experience = $7, salary = $8, state = $9, city = $10, street = $11,
        description = $12, moreinfo = $13`;
    
    let values = [
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
      moreinfo
    ];


    if (req.file) {
      query += `, file_name = $14, file_data = $15, file_mime_type = $16`;
      values.push(req.file.originalname, req.file.buffer, req.file.mimetype);
    }

    query += ` WHERE id = $${values.length + 1}`; 
    values.push(id);

    await db.query(query, values);

    res.status(200).json({ message: "Job updated successfully" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM jobs WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    await db.query("DELETE FROM jobs WHERE id = $1", [id]);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Failed to delete job" });
  }
};




const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      "SELECT job_id FROM job_bookmarks WHERE user_id = $1",
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Failed to fetch bookmarks." });
  }
}

const saveBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { job_id } = req.body;

    await db.query(
      "INSERT INTO job_bookmarks (user_id, job_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, job_id]
    );
    res.status(201).json({ message: "Bookmark added successfully." });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).json({ message: "Failed to add bookmark." });
  }
}

const deleteBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    await db.query(
      "DELETE FROM job_bookmarks WHERE user_id = $1 AND job_id = $2",
      [userId, jobId]
    );
    res.status(200).json({ message: "Bookmark removed successfully." });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({ message: "Failed to remove bookmark." });
  }
}



export { saveBookmarks, deleteBookmarks, getBookmarks, create_job, display_job, upload_appointment, display_appointments, displayUser_appointments, specific_job, updateJob, deleteJob, downloadApplication };
