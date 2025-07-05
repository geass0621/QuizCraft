import { Request, Response } from "express";
import { prisma } from "../utils/database.js";
import { SubmitResponseRequest } from "../types/index.js";
import { SuccessResponse, ErrorResponse } from "../types/responses.js";


export const submitResponse = async (req: Request, res: Response) => {
  try {
    // Parse request body
    const requestBody: SubmitResponseRequest = req.body;

    // Data operations
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { shareableToken: requestBody.questionnaireToken },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    // Check if questionnaire exists and is not expired
    if (!questionnaire) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "Questionnaire not found",
        error: {
          code: "QUESTIONNAIRE_NOT_FOUND",
          details: "The questionnaire with the provided token does not exist."
        }
      };
      res.status(404).json(errorResponse);
      return;
    }

    if (new Date() > questionnaire.expiresAt) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "Questionnaire has expired",
        error: {
          code: "QUESTIONNAIRE_EXPIRED",
          details: "This questionnaire is no longer available as it has expired."
        }
      };
      res.status(410).json(errorResponse);
      return;
    }

    // Start transaction
    const questionnaireResponse = await prisma.$transaction(async (tx) => {
      // Create Response record
      const newResponse = await tx.response.create({
        data: {
          questionnaireId: questionnaire.id,
          submittedAt: new Date(),
          totalScore: null, // Will be calculated later
          submitterEmail: requestBody.submitterEmail || null,
          submitterName: requestBody.submitterName || null,
        }
      });
      // Create ResponseAnswer records
      const answersData = requestBody.answers.map(answer => ({
        responseId: newResponse.id,
        questionId: answer.questionId,
        answerText: answer.answerText
      }));
      const newAnswers = await tx.responseAnswer.createMany({
        data: answersData
      });

      // Calculate total score if questionnaire is scored
      if (questionnaire.scored) {
        let totalScore = 0;
        for (const answer of requestBody.answers) {
          const question = questionnaire.questions.find(q => q.id === answer.questionId);
          if (question && question.type === "MULTIPLE_CHOICE") {
            const option = question.options.find(o => o.text === answer.answerText);
            if (option && option.isCorrect) {
              totalScore += question.pointsCorrect || 0; // Add points for correct answer
            }
          }
        }
        // Update Response with total score
        const updatedResponse = await tx.response.update({
          where: { id: newResponse.id },
          data: { totalScore }
        });

        // Return the updated response
        return updatedResponse;
      }

      // Return the new response (for non-scored questionnaires)
      return newResponse;
    });

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