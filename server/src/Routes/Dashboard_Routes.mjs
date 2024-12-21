import { Router } from "express";
import { getAiResponse } from "./Controllers/Dashboard_Controller.mjs";

const router = Router() 

router.post('/allDashboards', getAiResponse)



export default router