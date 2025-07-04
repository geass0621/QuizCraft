import { Router } from "express";
import { validateSubmitResponse } from "../middleware/validation/responseValidation.js";
import { submitResponse } from "../controllers/responseController.js";
import { handleValidationErrors } from "../middleware/validationErrorHandler.js";


const router = Router();

router.post('/responses', validateSubmitResponse, handleValidationErrors, submitResponse);

export default router;