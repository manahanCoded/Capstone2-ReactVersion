import express, { Router } from "express";

import { 
  create_job, 
  display_job, 
  upload_appointment, 
  display_appointments, 
  displayUser_appointments, 
  specific_job, 
  updateJob,
  deleteJob,
  getBookmarks,
  saveBookmarks,
  deleteBookmarks
} from "./Controllers/Job_Controller.mjs";
import { uploadDir, appointmentFile, handleFileUploadError } from "../Resume_Img/Multer-config.mjs";


const router = Router();

const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

router.post("/create", create_job);

router.get("/display", display_job);

router.post("/upload-appointment", appointmentFile, handleFileUploadError, upload_appointment);

router.get("/display-appointment", display_appointments);

router.get("/display-user-appointment/:user", displayUser_appointments);

router.get("/specific-job/:id", specific_job);

router.put("/upDatejob/:jobEditID", updateJob);

router.delete("/delete/:id", deleteJob);

router.get("/bookmarks", isAuthenticated, getBookmarks)

router.post("/bookmarks", isAuthenticated, saveBookmarks)

router.delete("/bookmarks/:jobId", isAuthenticated, deleteBookmarks)

// Use centralized uploadDir for serving files
router.use("/Resume_Img/uploads", express.static(uploadDir));

export default router;
