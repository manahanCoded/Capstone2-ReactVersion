import { Router } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import ExpressBrute from "express-brute";
import { 
  login, google_login, google_login_callback, register, 
  logout, userInfo, updateUser, accountsDashboard, 
  updateRoles, retrieve, 
  changePassword,
  verify,
  emailSet
} from "./Controllers/User_Controller.mjs";
import { Validate_Login, Validate_Register } from "../Middleware/Validaitors/User_Validator.mjs";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});


const loginRegisterLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Try again later.",
});


const retrieveLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many password reset requests. Try again later.",
});


const store = new ExpressBrute.MemoryStore(); 
const bruteforce = new ExpressBrute(store, { freeRetries: 5, minWait: 10 * 1000 });

router.post("/login", bruteforce.prevent, Validate_Login, login);
router.get("/auth/google", google_login);
router.get("/auth/google/callback", google_login_callback);
router.post("/email-set", emailSet);
router.post("/retrieve", retrieve);
router.post("/verify", verify);
router.post("/change-password", changePassword);
router.post("/register",Validate_Register, register);
router.put("/update", upload.single("image"), updateUser);
router.post("/logout", logout);
router.get("/profile", userInfo);
router.get("/allUsers", accountsDashboard);
router.put("/updateRole", updateRoles); 

export default router;
