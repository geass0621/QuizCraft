import { PublicQuestionnaire } from "../types/index.js";


export const removeCorrectAnswers = (questionnaire: any): PublicQuestionnaire => {
  return {
    ...questionnaire,
    description: questionnaire.description ?? "",
    questions: (questionnaire.questions ?? []).map((question: any) => ({
      ...question,
      options: (question.options ?? []).map((option: any) => ({
        id: option.id,
        text: option.text
        // isCorrect omitted
      }))
    }))
  };
};