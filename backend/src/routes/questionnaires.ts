import { Router } from "express";
import { createQuestionnaire } from "../controllers/questionnaireController.js";

const router = Router();

router.post('/questionnaires', createQuestionnaire);

export default router;