import { ExpiredError, NotFoundError, ValidationError } from '../errors/customErrors.js';
import { SubmitResponseRequest } from '../types/index.js';
import { prisma } from '../utils/database.js';
import { Prisma } from '@prisma/client';

/**
 * ResponseService handles the business logic for questionnaire responses.
 * It includes methods for submitting responses, calculating scores,
 */

// Define the type for the questionnaire with answers
type QuestionnaireWithAnswers = Prisma.QuestionnaireGetPayload<{
  include: {
    questions: {
      include: {
        options: true;
      };
    };
  };
}>;

export class ResponseService {

  /**
   * Retrieves a questionnaire with its answers based on the shareable token.
   * @param shareableToken - The unique token for the questionnaire.
   * @returns The questionnaire with its questions and options.
   */
  private async getQuestionnaireWithAnswers(shareableToken: string): Promise<QuestionnaireWithAnswers> {
    // Fetch the questionnaire with answers for internal use
    try {
      // Validate shareable token
      if (!shareableToken) {
        throw new ValidationError("Shareable token is required");
      }

      // Fetch the questionnaire from the database
      const questionnaire = await prisma.questionnaire.findUnique({
        where: { shareableToken },
        include: {
          questions: {
            include: {
              options: true
            }
          }
        }
      });

      // If not found, throw an error
      if (!questionnaire) {
        throw new NotFoundError("Questionnaire not found");
      }

      // Check if the questionnaire has expired
      if (new Date() > questionnaire.expiresAt) {
        throw new ExpiredError("Questionnaire has expired");
      }

      return questionnaire;

    } catch (error) {
      // Re-throw custom errors as-is
      if (error instanceof NotFoundError || error instanceof ExpiredError || error instanceof ValidationError) {
        throw error;
      }

      // For other errors, throw a generic error
      throw new Error(`Failed to retrieve questionnaire: ${error instanceof Error ? error.message : 'Database operation failed'}`);
    }
  };

  /**
   * Calculates the total score based on the answers provided.
   * @param answers - The answers submitted by the user.
   * @param questionnaire - The questionnaire containing questions and options.
   * @returns The total score calculated from the answers.
   */
  private calculateTotalScore(answers: any[], questionnaire: QuestionnaireWithAnswers): number {
    let totalScore = 0;

    // Iterate through each answer
    for (const answer of answers) {
      const question = questionnaire.questions.find(q => q.id === answer.questionId);
      if (question) {
        // For MULTIPLE_CHOICE questions, check if the answer is correct
        if (question.type === 'MULTIPLE_CHOICE') {
          const option = question.options.find(o => o.text === answer.answerText);
          if (option && option.isCorrect) {
            totalScore += question.pointsCorrect || 0; // Add points if correct
          }
        } else if (question.type === 'OPEN_TEXT') {
          // For OPEN_TEXT questions, you can implement custom scoring logic here
          // For now, we assume all OPEN_TEXT answers are scored as 0 points
        }
      }
    }

    return totalScore;
  }

  async submitResponse(requestBody: SubmitResponseRequest): Promise<any> {
    try {

      // Fetch the questionnaire with answers
      const questionnaire = await this.getQuestionnaireWithAnswers(requestBody.questionnaireToken);

      const result = await prisma.$transaction(async (tx) => {
        // Create a new response in the database
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
        await tx.responseAnswer.createMany({
          data: answersData
        });

        // Calculate total score if questionnaire is scored
        if (questionnaire.scored) {
          const totalScore = this.calculateTotalScore(requestBody.answers, questionnaire);
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

      return result;

    } catch (error) {
      // Re-throw custom errors as-is
      if (error instanceof NotFoundError || error instanceof ExpiredError || error instanceof ValidationError) {
        throw error;
      }

      // Only wrap unexpected errors
      throw new Error(`Failed to submit response: ${error instanceof Error ? error.message : 'Database operation failed'}`);
    }
  }

}