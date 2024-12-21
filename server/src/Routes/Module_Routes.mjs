import { Router } from "express";
import { addModule, allModule, editModule, getModuleIds, addQuestion, allQuestion , deleteModule, user_score, getUser_score} from "./Controllers/Module_Controller.mjs";

const router = Router() 

router.get('/allModule', allModule)

router.post('/addModule', addModule)

router.post('/getPostId', getModuleIds);

router.post('/editModule', editModule)

router.get('/allQuestions', allQuestion)

router.post('/addQuestions', addQuestion)

router.delete('/deleteModules/:id', deleteModule)

router.post("/update-module-score", user_score)

router.get("/get-user-score/:id", getUser_score)

export default router