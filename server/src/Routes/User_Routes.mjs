import { Router } from "express";
import { login, google_login, google_login_callback, register, logout, userInfo, updateUser, accountsDashboard, updateRoles, retrieve} from "./Controllers/User_Controller.mjs";
import { Validate_Login, Validate_Register } from "../Middleware/Validaitors/User_Validator.mjs";
import multer from "multer";

const router = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/login", Validate_Login, login)
router.get('/auth/google', google_login)
router.get('/auth/google/callback', google_login_callback)
router.post('/retrieve', Validate_Register, retrieve)
router.post("/register", Validate_Register, register)
router.put("/update", upload.single("image"),updateUser)
router.post("/logout", logout)
router.get("/profile", userInfo)
router.get("/allUsers", accountsDashboard)
router.put("/updateRole", updateRoles)
export default router