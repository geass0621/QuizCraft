import { Request, Response } from "express";
import { prisma } from "../utils/database.js";
import { SubmitResponseRequest } from "../types/index.js";
import { SuccessResponse, ErrorResponse } from "../types/responses.js";
import { ResponseService } from "../services/responseService.js";
import { ExpiredError, NotFoundError, ValidationError } from "../errors/customErrors.js";

// Initialize the ResponseService instance
const responseService = new ResponseService();

export const submitResponse = async (req: Request, res: Response) => {
  try {
    // Parse request body
    const requestBody: SubmitResponseRequest = req.body;

    const questionnaireResponse = await responseService.submitResponse(requestBody);

    // Prepare success response
    const successResponse: SuccessResponse<any> = {
      success: true,
      message: "Response submitted successfully",
      data: {
        id: questionnaireResponse.id,
        questionnaireId: questionnaireResponse.questionnaireId,
        submittedAt: questionnaireResponse.submittedAt,
        totalScore: questionnaireResponse.totalScore,
        submitterName: questionnaireResponse.submitterName,
        submitterEmail: questionnaireResponse.submitterEmail
      }
    };
    res.status(201).json(successResponse);


  } catch (error) {
    // Check if the error is a custom error type
    if (error instanceof NotFoundError) {
      const notFoundResponse: ErrorResponse = {
        success: false,
        message: "Questionnaire not found",
        error: {
          code: "QUESTIONNAIRE_NOT_FOUND",
          details: error.message
        }
      };
      res.status(404).json(notFoundResponse);
      return;
    };

    if (error instanceof ExpiredError) {
      const expiredResponse: ErrorResponse = {
        success: false,
        message: "Questionnaire has expired",
        error: {
          code: "QUESTIONNAIRE_EXPIRED",
          details: error.message
        }
      };
      res.status(410).json(expiredResponse);
      return;
    }

    if (error instanceof ValidationError) {
      const validationResponse: ErrorResponse = {
        success: false,
        message: "Validation error",
        error: {
          code: "VALIDATION_ERROR",
          details: error.message
        }
      };
      res.status(400).json(validationResponse);
      return;
    }


    // Handle errors
    const errorResponse: ErrorResponse = {
      success: false,
      message: "Failed to submit response",
      error: {
        code: "RESPONSE_SUBMISSION_ERROR",
        details: error instanceof Error ? error.message : "Database operation failed"
      }
    };
    res.status(500).json(errorResponse);
  }
}