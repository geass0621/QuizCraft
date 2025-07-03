import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import { strictLimiter } from './middleware/rateLimiter.js';
import questionnaireRoutes from './routes/questionnaires.js';

// Load environment variables
dotenv.config();

// Set the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Initialize the Express application
const app  = express();

// Middleware for security and CORS
app.use(helmet());
app.use(cors());

// Logger middleware
app.use(logger);

// Rate limiting middleware to prevent abuse
app.use(strictLimiter);

// Body parser middleware to handle JSON requests
app.use(express.json());

// Routes
app.use('/api', questionnaireRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({status: 'OK', message: 'QuizCraft API is running'});
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});