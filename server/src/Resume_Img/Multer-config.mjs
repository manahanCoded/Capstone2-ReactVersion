import multer from "multer"; // Import Multer, a middleware for handling `multipart/form-data`, which is primarily used for file uploads.
import fs from "fs"; // Import the file system module to interact with the file system (e.g., create directories).
import path from "path"; // Import the path module to work with file and directory paths.
import { fileURLToPath } from "url"; 

// Get the current file name and directory (__dirname equivalent for ES modules)
const __filename = fileURLToPath(import.meta.url); // Dynamically resolve the file name of the current module.
const __dirname = path.dirname(__filename); // Get the directory name of the current module.

// Define the directory where uploaded files will be stored
const uploadDir = path.join(__dirname, "./uploads"); // Resolve the `uploads` directory relative to the current file's directory.

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory (and any necessary parent directories) if it doesn't exist.
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
const appointmentFile = upload.single("file"); // Expect a single file upload with the field name `file`.

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
