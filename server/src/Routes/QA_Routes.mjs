import { Router } from "express";
import { qa_all, question, answer, vote, delete_item} from "./Controllers/QA_Controller.mjs";

const router =  Router()

router.get("/all", qa_all )
router.post("/question", question )
router.post("/answer", answer )
router.post("/vote", vote )
router.delete("/delete/:questionId", delete_item)

export default router