import { Request, Response } from 'express';
import { prisma } from '../utils/database.js';
import { CreateQuestionnaireRequest, CreateQuestionInput, CreateQuestionOptionInput, PublicQuestionnaire } from '../types/index.js';
import { SuccessResponse, ErrorResponse } from '../types/responses.js';
import { removeCorrectAnswers } from '../utils/transformers.js';

export const createQuestionnaire = async (req: Request, res: Response): Promise<void> => {
  try{
    // Parse request body
    const requestBody: CreateQuestionnaireRequest = req.body;

    // Data operations
    const questionnaire = await prisma.questionnaire.create({
      data: {
        title: requestBody.title,
        description: requestBody.description,
        creatorEmail: requestBody.creatorEmail,
        scored: requestBody.scored,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to 24 hours from now
        questions: {
          create: requestBody.questions.map((question: CreateQuestionInput) => ({
            type: question.type,
            title: question.title,
            pointsCorrect: question.pointsCorrect,
            order: question.order,
            options: question.options ? {
              create: question.options.map((option: CreateQuestionOptionInput) => ({
                text: option.text,
                isCorrect: option.isCorrect
              }))
            } : undefined // Handle optional options
          }))
        }
      },
      include: {
        questions: {
          include: {
            options: true // Include options in the response
          }
        }
      }
    })

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

  }catch (error) {
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
  try{
    // Extract shareable token from request parameters
    const shareableToken = req.params.shareableToken;

    // Validate shareable token
    if (!shareableToken) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: 'Shareable token is required',
        error: {
          code: 'MISSING_TOKEN',
          details: 'The shareable token must be provided in the request parameters.'
        }
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Fetch questionnaire from the database
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { shareableToken },
      include: {
        questions: {
          include: {
            options: true // Include options in the response
          }
        }
      }
    });

    // Check if questionnaire exists
    if (!questionnaire) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: 'Questionnaire not found',
        error: {
          code: 'QUESTIONNAIRE_NOT_FOUND',
          details: 'No questionnaire found with the provided shareable token.'
        }
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Check if the questionnaire is expired
    if (new Date() > questionnaire.expiresAt) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: 'Questionnaire has expired',
        error: {
          code: 'QUESTIONNAIRE_EXPIRED',
          details: 'This questionnaire is no longer available as it has expired.'
        }
      };
      res.status(410).json(errorResponse);
      return;
    }

    // Transform the data to remove isCorrect from options
    const publicQuestionnaire: PublicQuestionnaire = removeCorrectAnswers(questionnaire);

    // Return success response with transformed data
    const successResponse: SuccessResponse<PublicQuestionnaire> = {
      success: true,
      message: 'Questionnaire retrieved successfully',
      data: publicQuestionnaire
    };
    res.status(200).json(successResponse);
    


  }catch (error) {
    // Handle errors
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