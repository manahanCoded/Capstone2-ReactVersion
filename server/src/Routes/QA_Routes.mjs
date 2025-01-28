import { Router } from "express";
import { qa_all, question, answer, vote, delete_item, isAccepted} from "./Controllers/QA_Controller.mjs";

const router =  Router()

const isAuthenticated = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

router.get("/all", qa_all )
router.post("/question", question )
router.post("/answer", answer )
router.post("/vote", vote )
router.delete("/delete/:questionId", delete_item)
router.patch("/accept/:id",isAuthenticated, isAccepted)
export default router