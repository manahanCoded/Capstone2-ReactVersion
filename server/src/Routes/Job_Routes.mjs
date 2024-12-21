import express, { Router } from "express";
import { create_job, display_job, upload_appointment, display_appointments, displayUser_appointments, specific_job, upDatejob } from "./Controllers/Job_Controller.mjs";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Dynamically get the current file directory (ES module workaround for __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the uploads directory, relative to the current file
const uploadDir = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store uploaded files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });
const appointmentFile = upload.single("file");

// Router setup
const router = Router();

// Define Routes
router.post("/create", create_job);
router.get("/display", display_job);
router.post("/upload-appointment", appointmentFile, upload_appointment);
router.get("/display-appointment", display_appointments)
router.get("/display-user-appointment/:user", displayUser_appointments)
router.get("/specific-job/:id", specific_job)
router.put("/upDatejob/:jobEditID", upDatejob)

router.use("/uploads", express.static(path.join(__dirname, 'uploads')));

export default router;
