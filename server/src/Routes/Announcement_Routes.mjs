import { Router } from "express";
import { allAnnouncement, addAnnouncement } from "./Controllers/Announcement_Controller.mjs";

const router = Router() 

router.get('/allAnnouncements', allAnnouncement)

router.post('/addAnnouncements', addAnnouncement)

// router.post('/getPostId', getModuleId)

// router.post('/editModule', editModule)

export default router