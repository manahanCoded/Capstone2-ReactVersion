import { Router } from "express";
import { allAnnouncement, addAnnouncement, deleteAnnouncement, editAnnouncement } from "./Controllers/Announcement_Controller.mjs";

const router = Router() 


router.get('/allAnnouncements', allAnnouncement)

router.post('/addAnnouncements', addAnnouncement)

router.delete('/deleteAnnouncement', deleteAnnouncement) 

router.post('/editAnnouncement', editAnnouncement)

export default router