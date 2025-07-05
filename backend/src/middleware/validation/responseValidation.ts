import { body } from "express-validator";

export const validateSubmitResponse = [
  body('questionnaireToken')
    .isString()
    .withMessage('Shareable token must be a string')
    .notEmpty()
    .withMessage('Shareable token is required'),

  body('answers')
    .isArray()
    .withMessage('Answers must be an array')
    .notEmpty()
    .withMessage('At least one answer is required'),

  body('answers.*.questionId')
    .isString()
    .withMessage('Each answer must have a question ID')
    .notEmpty()
    .withMessage('Question ID cannot be empty'),

  body('answers.*.answerText')
    .isString()
    .withMessage('Each answer must be a string')
    .notEmpty()
    .withMessage('Answer cannot be empty'),

  body('submitterName')
    .optional()
    .isString()
    .withMessage('Submitter name must be a string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Submitter name must be between 1 and 100 characters'),

  body('submitterEmail')
    .optional()
    .isEmail()
    .withMessage('Submitter email must be a valid email address')
    .normalizeEmail()
  
];

