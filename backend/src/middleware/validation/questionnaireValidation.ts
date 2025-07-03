import { body } from "express-validator";

export const validateCreateQuestionnaire = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .notEmpty()
    .withMessage('Title is required'),

  body('creatorEmail')
  .isEmail()
  .withMessage('Creator email must be a valid email address')
  .notEmpty()
  .withMessage('Creator email is required'),  
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  body('questions')
    .isArray()
    .withMessage('Questions must be an array')
    .notEmpty()
    .withMessage('At least one question is required'),

  body('questions.*.title')
    .isString()
    .withMessage('Each question must have a title')
    .notEmpty()
    .withMessage('Question title cannot be empty'),

  body('scored')
  .isBoolean()
  .withMessage('Scored must be a boolean'),
   
  body('questions.*.pointsCorrect')
  .optional()
  .isInt({ min: 0 })
  .withMessage('Points must be non-negative integer'),

  body('questions.*.order')
  .isInt({ min: 0 })
  .withMessage('Question order must be a non-negative integer'),

  body('questions.*.type')
  .isIn(['MULTIPLE_CHOICE', 'OPEN_TEXT'])
  .withMessage('Question type must be MULTIPLE_CHOICE or OPEN_TEXT'),

  body('questions.*.options')
  .optional()
  .isArray({ min: 2 })
  .withMessage('Multiple choice questions need at least 2 options')

];