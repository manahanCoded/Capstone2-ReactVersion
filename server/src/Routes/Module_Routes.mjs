import { Router } from "express";
import { addUnit, allModule, editModule, getModuleIds, addQuestion, allQuestion , deleteModule, user_score, getUser_score, allModule_Storage, units, createModule, updateModule, removeModule, getAllModule_UserInfo, updateQuestions, deleteQuestion} from "./Controllers/Module_Controller.mjs";
import multer from "multer";


const router = Router() 

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/allModule-storage/:id?', allModule_Storage)

router.get('/module-units/:id', units)

router.get('/allModule', allModule)

router.post('/createModule', upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'achievement_image', maxCount: 1 },
  ]), createModule)

router.put('/updateModule/:id',upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'achievement_image', maxCount: 1 }]),  updateModule)

router.delete('/removeModule/:id', removeModule)

router.post('/addModule', addUnit)

router.post('/getPostId', getModuleIds);

router.post('/editModule', editModule)

router.get('/allQuestions', allQuestion)

router.post('/addQuestions', addQuestion)

router.post("/updateQuestions", updateQuestions);

router.delete('/deleteModules/:id', deleteModule)

router.delete("/deleteQuestion/:id", deleteQuestion);

router.post("/update-module-score", user_score)

router.get("/get-user-score/:id", getUser_score)

router.get("/get-all-user-info", getAllModule_UserInfo);

export default router