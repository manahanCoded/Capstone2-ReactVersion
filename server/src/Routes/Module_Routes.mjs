import { Router } from "express";
import { addUnit, allModule, editModule, getModuleIds, addQuestion, allQuestion , deleteModule, user_score, getUser_score, allModule_Storage, units, createModule, updateModule, removeModule} from "./Controllers/Module_Controller.mjs";

const router = Router() 

router.get('/allModule-storage/:id?', allModule_Storage)

router.get('/module-units/:id', units)

router.get('/allModule', allModule)

router.post('/createModule', createModule)

router.put('/updateModule/:id', updateModule)

router.delete('/removeModule/:id', removeModule)

router.post('/addModule', addUnit)

router.post('/getPostId', getModuleIds);

router.post('/editModule', editModule)

router.get('/allQuestions', allQuestion)

router.post('/addQuestions', addQuestion)

router.delete('/deleteModules/:id', deleteModule)

router.post("/update-module-score", user_score)

router.get("/get-user-score/:id", getUser_score)

export default router