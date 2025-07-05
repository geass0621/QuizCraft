import { prisma } from "../utils/database.js";
import { CreateQuestionnaireRequest, PublicQuestionnaire } from "../types/index.js";
import { removeCorrectAnswers } from "../utils/transformers.js";
import { ExpiredError, NotFoundError, ValidationError } from "../errors/customErrors.js";
import { Prisma } from "@prisma/client";

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

export class QuestionnaireService {


  /**
   * Creates a new questionnaire with the provided data.
   * @param data - The data for the new questionnaire.
   * @returns The created questionnaire object.
   */
  async createQuestionnaire(data: CreateQuestionnaireRequest): Promise<QuestionnaireWithAnswers> {
    try {
      // Data operations
      const questionnaire = await prisma.questionnaire.create({
        data: {
          title: data.title,
          description: data.description,
          creatorEmail: data.creatorEmail,
          scored: data.scored,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to 24 hours from now
          questions: {
            create: data.questions.map((question) => ({
              type: question.type,
              title: question.title,
              pointsCorrect: question.pointsCorrect,
              order: question.order,
              options: question.options ? {
                create: question.options.map((option) => ({
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
      });

      // Return the created questionnaire
      return questionnaire;

    } catch (error) {
      // Handle errors
      throw new Error(`Failed to create questionnaire: ${error instanceof Error ? error.message : 'Database operation failed'}`);
    };
  };

  /**
   * Retrieves a questionnaire by its shareable token.
   * @param shareableToken - The shareable token of the questionnaire.
   * @returns The public questionnaire object without correct answers.
   */
  async getQuestionnaire(shareableToken: string): Promise<PublicQuestionnaire> {
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
              options: true // Include options in the response
            }
          }
        }
      });

      // If not found, throw an error
      if (!questionnaire) {
        throw new NotFoundError("Questionnaire not found");
      }

      // Check if the questionnaire has expired
      if (new Date > questionnaire.expiresAt) {
        throw new ExpiredError("Questionnaire has expired");
      }

      // Remove correct answers for public access
      const publicQuestionnaire: PublicQuestionnaire = removeCorrectAnswers(questionnaire);
      return publicQuestionnaire;

    } catch (error) {
      // Re-throw custom errors as-is
      if (error instanceof NotFoundError ||
        error instanceof ExpiredError ||
        error instanceof ValidationError) {
        throw error;
      }

      // Only wrap database/unexpected errors
      throw new Error(`Failed to retrieve questionnaire: ${error instanceof Error ? error.message : 'Database operation failed'}`);
    }
  }
}