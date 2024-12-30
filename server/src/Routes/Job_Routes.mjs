import express, { Router } from "express";
import { fileURLToPath } from "url";
import path from "path";
import { 
  create_job, 
  display_job, 
  upload_appointment, 
  display_appointments, 
  displayUser_appointments, 
  specific_job, 
  upDatejob,
  deleteJob
} from "./Controllers/Job_Controller.mjs";
import { uploadDir, appointmentFile, handleFileUploadError } from "../Resume_Img/Multer-config.mjs";

const __filename = fileURLToPath(import.meta.url);


const router = Router();

router.post("/create", create_job);
router.get("/display", display_job);
router.post("/upload-appointment", appointmentFile, handleFileUploadError, upload_appointment);
router.get("/display-appointment", display_appointments);
router.get("/display-user-appointment/:user", displayUser_appointments);
router.get("/specific-job/:id", specific_job);
router.put("/upDatejob/:jobEditID", upDatejob);
router.delete("/delete/:id", deleteJob);

// Use centralized uploadDir for serving files
router.use("/Resume_Img/uploads", express.static(uploadDir));

export default router;
