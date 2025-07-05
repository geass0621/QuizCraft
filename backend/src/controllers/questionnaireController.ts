import { Request, Response } from 'express';
import { CreateQuestionnaireRequest, PublicQuestionnaire } from '../types/index.js';
import { SuccessResponse, ErrorResponse } from '../types/responses.js';
import { QuestionnaireService } from '../services/questionnaireService.js';
import { ExpiredError, NotFoundError, ValidationError } from '../errors/customErrors.js';

// Initialize the QuestionnaireService instance
const questionnaireService = new QuestionnaireService();

export const createQuestionnaire = async (req: Request, res: Response): Promise<void> => {
  try {
    // Parse request body
    const requestBody: CreateQuestionnaireRequest = req.body;

    // Data operations
    const questionnaire = await questionnaireService.createQuestionnaire(requestBody);

    // Return success response
    const successResponse: SuccessResponse<any> = {
      success: true,
      message: 'Questionnaire created successfully',
      data: {
        id: questionnaire.id,
        shareableToken: questionnaire.shareableToken,
        questionCount: questionnaire.questions.length,
        description: questionnaire.description,
        expiresAt: questionnaire.expiresAt,
        shareableUrl: `${process.env.FRONTEND_URL}/quiz/${questionnaire.shareableToken}`,
      }
    };
    res.status(201).json(successResponse);

  } catch (error) {
    // Handle errors
    const errorResponse: ErrorResponse = {
      success: false,
      message: 'Failed to create questionnaire',
      error: {
        code: 'QUESTIONNAIRE_CREATION_ERROR',
        details: error instanceof Error ? error.message : 'Database operation failed'
      }
    };
    res.status(500).json(errorResponse);
  }
};


export const getQuestionnaire = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract shareable token from request parameters
    const shareableToken = req.params.shareableToken;

    // Fetch questionnaire from the database
    const publicQuestionnaire = await questionnaireService.getQuestionnaire(shareableToken);

    // Return success response with transformed data
    const successResponse: SuccessResponse<PublicQuestionnaire> = {
      success: true,
      message: 'Questionnaire retrieved successfully',
      data: publicQuestionnaire
    };
    res.status(200).json(successResponse);

  } catch (error) {
    // Handle errors
    if (error instanceof NotFoundError) {
      const notFoundResponse: ErrorResponse = {
        success: false,
        message: 'Questionnaire not found',
        error: {
          code: 'QUESTIONNAIRE_NOT_FOUND',
          details: error.message
        }
      };
      res.status(404).json(notFoundResponse);
      return;
    }

    if (error instanceof ExpiredError) {
      const expiredResponse: ErrorResponse = {
        success: false,
        message: 'Questionnaire has expired',
        error: {
          code: 'QUESTIONNAIRE_EXPIRED',
          details: error.message
        }
      };
      res.status(410).json(expiredResponse);
      return;
    }

    if (error instanceof ValidationError) {
      const validationResponse: ErrorResponse = {
        success: false,
        message: 'Validation error',
        error: {
          code: 'VALIDATION_ERROR',
          details: error.message
        }
      };
      res.status(400).json(validationResponse);
      return;
    }

    const errorResponse: ErrorResponse = {
      success: false,
      message: 'Failed to retrieve questionnaire',
      error: {
        code: 'QUESTIONNAIRE_RETRIEVAL_ERROR',
        details: error instanceof Error ? error.message : 'Database operation failed'
      }
    };
    res.status(500).json(errorResponse);
  }
}