import { Router } from "express";
import { qa_all, question, answer, vote, delete_question, delete_answer, isAccepted, update_answer, update_question} from "./Controllers/QA_Controller.mjs";
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
router.delete("/delete-question/:questionId", delete_question)
router.delete("/delete-answer/:answerId", delete_answer)
router.patch("/accept/:id",isAuthenticated, isAccepted)
router.patch("/update-question/:id",isAuthenticated, upload.single("image"), update_question)
router.patch("/update-answer/:id",isAuthenticated, update_answer)



export default router