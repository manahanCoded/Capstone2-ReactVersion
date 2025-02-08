import { Router } from "express";
import { qa_all, question, answer, vote, delete_item, isAccepted} from "./Controllers/QA_Controller.mjs";
import multer from "multer";

const router =  Router()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const isAuthenticated = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

router.get("/all", qa_all )
router.post("/question", upload.single("image"), question )
router.post("/answer", answer )
router.post("/vote", vote )
router.delete("/delete/:questionId", delete_item)
router.patch("/accept/:id",isAuthenticated, isAccepted)



export default router