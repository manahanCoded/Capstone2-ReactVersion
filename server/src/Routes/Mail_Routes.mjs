import { Router } from "express";
import { allMails, sendMails, replyMails, deleteReply } from "./Controllers/Mail_Controller.mjs";

const router = Router()

router.get("/allMail", allMails )

router.post("/sendMail", sendMails )
router.post("/replyMail", replyMails )
router.delete("/deleteMail/:id", deleteReply)


export default router