import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import { strictLimiter } from './middleware/rateLimiter.js';
// Load environment variables
dotenv.config();
// Set the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;
// Initialize the Express application
const app = express();
// Middleware for security and CORS
app.use(helmet());
app.use(cors());
app.use(express.json());
// Logger middleware
app.use(logger);
// Rate limiting middleware to prevent abuse
app.use(strictLimiter);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'QuizCraft API is running' });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
