import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types/responses.js";

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, send a 400 response with the error details
    const errorResponse: ErrorResponse = {
      success: false,
      message: "Validation failed",
      error: {
        code: "VALIDATION_ERROR",
        details: errors.array().map(err => ({
          message: err.msg,
        }))
      }
    };
    res.status(400).json(errorResponse);
    return; // Stop further processing if there are validation errors
  }
  // If no validation errors, proceed to the next middleware or route handler
  next();
}