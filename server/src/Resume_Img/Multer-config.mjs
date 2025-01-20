import multer from "multer";
import fs from "fs"; 
import path from "path";
import { fileURLToPath } from "url"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 


const uploadDir = path.join(__dirname, "./uploads"); // Resolve the `uploads` directory relative to the current file's directory.

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory
}

// Configure Multer's storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Specify the destination directory for uploaded files.
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`; // Generate a unique filename by appending a timestamp to the original file name.
    cb(null, uniqueName); // Set the filename for the uploaded file.
  },
});

// File filter to restrict allowed file types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".gif"]; // Define a list of allowed file extensions.
  const fileExtension = path.extname(file.originalname).toLowerCase(); // Get the file extension in lowercase.

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true); // If the file extension is allowed, proceed with the upload.
  } else {
    cb(new Error("Only PDF, DOC, DOCX, PNG, JPG, JPEG, or GIF files are allowed.")); // Reject files with unsupported extensions and return an error message.
  }
};

// Create an upload instance with the defined storage and file filter
const upload = multer({
  storage, // Use the configured `storage` object.
  fileFilter, // Apply the file type filter.
  limits: { fileSize: 5 * 1024 * 1024 }, // Set a maximum file size limit of 5MB.
});

// Middleware for handling single file uploads
const appointmentFile = upload.single("file");

// Middleware to handle file upload errors
const handleFileUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // If the error is a specific Multer error (e.g., file too large), handle it here.
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  }
  next(); // If no errors, proceed to the next middleware or route handler.
};

// Export the necessary modules for use in other files
export { uploadDir, appointmentFile, handleFileUploadError }; // Export `uploadDir` (for static serving), `appointmentFile` (for handling file uploads), and `handleFileUploadError` (for handling errors).
