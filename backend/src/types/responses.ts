// Base response structure
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
}

// Success response helper
export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

// Error response helper
export interface ErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: any;
  };
}