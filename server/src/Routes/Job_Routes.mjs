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
  deleteBookmarks,
  downloadApplication
} from "./Controllers/Job_Controller.mjs";

import multer from "multer";


const router = Router();

const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};


const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); 
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const appointmentFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg", "image/png", 
    "application/pdf",  
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error("Invalid file type. Please upload an image, PDF, DOC, DOCX, PNG, or JPG file."), false);
  }
};

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },  
  fileFilter: imageFileFilter,
});

const appointmentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },  
  fileFilter: appointmentFileFilter,
});


router.post("/create", imageUpload.single("file"), create_job);

router.get("/display", display_job);

router.post("/upload-appointment", appointmentUpload.single("file"), upload_appointment);

router.get("/download/:id", isAuthenticated, downloadApplication);

router.get("/display-appointment", display_appointments);

router.get("/display-user-appointment/:user", displayUser_appointments);

router.get("/specific-job/:id", specific_job);

router.put("/upDatejob/:id", imageUpload.single("file"), updateJob);

router.delete("/delete/:id", deleteJob);

router.get("/bookmarks", isAuthenticated, getBookmarks)

router.post("/bookmarks", isAuthenticated, saveBookmarks)

router.delete("/bookmarks/:jobId", isAuthenticated, deleteBookmarks)




export default router;
