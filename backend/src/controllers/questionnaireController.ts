import { Request, Response } from 'express';
import { prisma } from '../utils/database.js';
import { CreateQuestionnaireRequest, Questionnaire, CreateQuestionInput, CreateQuestionOptionInput } from '../types/index.js';
import { SuccessResponse, ErrorResponse } from '../types/responses.js';

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