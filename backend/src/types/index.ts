export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  OPEN_TEXT = 'OPEN_TEXT'
};

export interface QuestionOption {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
};

export interface Question {
  id: string;
  questionnaireId: string;
  type: QuestionType;
  title: string;
  pointsCorrect?: number; // Optional for OPEN_TEXT questions
  order: number;
  options?: QuestionOption[]; // For MULTIPLE_CHOICE questions
};

export interface Questionnaire {
  id: string;
  title: string;
  description?: string; // Optional description
  creatorEmail: string;
  scored: boolean;
  shareableToken: string;
  createdAt: Date;
  expiresAt: Date;
  questions?: Question[]; 
}

export interface ResponseAnswer {
  id: string;
  responseId: string;
  questionId: string;
  answerText: string;
  isCorrect?: boolean; // Optional for OPEN_TEXT questions
}

export interface Response {
  id: string;
  questionnaireId: string;
  submittedAt: Date;
  totalScore?: number; // Optional, calculated later
  answers?: ResponseAnswer[]; // Answers to the questions
}
export interface PublicQuestionnaire {
  id: string;
  title: string;
  description?: string;
  scored: boolean;
  questions: PublicQuestion[];
}

export interface PublicQuestion {
  id: string;
  type: QuestionType;
  title: string;
  order: number;
  options?: PublicQuestionOption[];
}

export interface PublicQuestionOption {
  id: string;
  text: string;
  // No isCorrect for security
}

// API input types
export interface CreateQuestionOptionInput {
  text: string;
  isCorrect: boolean;
}

export interface CreateQuestionInput {
  type: QuestionType;
  title: string;
  pointsCorrect?: number; // Optional, only for MULTIPLE_CHOICE
  order: number;
  options?: CreateQuestionOptionInput[]; // For MULTIPLE_CHOICE questions
}

export interface CreateQuestionnaireRequest {
  title: string;
  description?: string;
  creatorEmail: string;
  scored: boolean;
  questions: CreateQuestionInput[];
}

// API response types
export interface SubmitResponseRequest {
  questionnaireToken: string;
  answers: {
    questionId: string;
    answerText: string;
  }[];
}