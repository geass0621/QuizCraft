import { Router } from "express";
import { createQuestionnaire } from "../controllers/questionnaireController.js";
import { handleValidationErrors } from "../middleware/validationErrorHandler.js";
import { validateCreateQuestionnaire } from "../middleware/validation/questionnaireValidation.js";


const router = Router();

router.post('/questionnaires', validateCreateQuestionnaire, handleValidationErrors, createQuestionnaire);

export default router;