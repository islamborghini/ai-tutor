/**
 * AI Tutor Backend Server
 * Express.js server providing APIs for file upload, problem solving, and video generation
 * Features: MongoDB integration, file upload handling, comprehensive error handling
 */

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');

// Import custom utilities and middleware
const logger = require('./utils/logger');
const { globalErrorHandler, AppError, asyncHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const port = 3001; // Backend runs on port 3001, frontend proxies from 3000

/**
 * MongoDB Database Connection
 * Attempts to connect to local MongoDB instance
 * Gracefully handles connection failures and continues without database
 */
mongoose.connect('mongodb://localhost:27017/ai-tutor')
  .then(() => logger.info('✅ Connected to MongoDB'))
  .catch(err => logger.warn('⚠️  MongoDB not available, running without database'));

/**
 * Multer Configuration for File Uploads
 * Configures storage destination and filename generation for uploaded files
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store files in uploads directory
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp and original extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

/**
 * Multer Upload Configuration
 * Sets file size limits and file type filtering for security
 */
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit for uploaded images
  },
  fileFilter: function (req, file, cb) {
    // Security: Accept only image files to prevent malicious uploads
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

/**
 * Express Middleware Configuration
 * Sets up JSON parsing, HTTP request logging, and static file serving
 */
app.use(express.json()); // Parse JSON request bodies

// HTTP request logging - different formats for development vs production
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Colored, concise logs for development
} else {
  app.use(morgan('combined')); // Apache-style logs for production
}

/**
 * Routes Definition
 */

// Root endpoint - basic health check
app.get('/', (req, res) => {
  res.send('🤖 AI Tutor Backend Server - Ready to help with your learning!');
});

/**
 * File Upload API Endpoint
 * POST /api/upload
 * Accepts image files and stores them in the uploads directory
 * @param {File} problem - Image file containing the problem to solve
 * @returns {Object} Response with filename and upload confirmation
 */
app.post('/api/upload', upload.single('problem'), asyncHandler(async (req, res, next) => {
  // Validate that a file was actually uploaded
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }
  
  // Log successful upload for monitoring
  logger.info(`File uploaded: ${req.file.originalname} (${req.file.size} bytes)`);
  
  // Return structured response with file details
  res.json({ 
    status: 'success',
    message: 'File uploaded successfully',
    data: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      path: req.file.path
    }
  });
}));

/**
 * Problem Solving API Endpoint
 * POST /api/solve
 * Processes uploaded problem images with AI to provide solutions
 * @param {Object} body.problem - Problem description or image reference
 * @returns {Object} Response with AI-generated solution
 */
app.post('/api/solve', asyncHandler(async (req, res, next) => {
  const { problem } = req.body;
  
  // Validate request body
  if (!problem) {
    return next(new AppError('Problem description is required', 400));
  }
  
  // Log the solve request
  logger.info(`Problem solving requested: ${problem.substring(0, 100)}...`);
  
  // TODO: Integrate with actual AI service (OpenAI, Google AI, etc.)
  // For now, return a mock solution
  const mockSolution = "This is a placeholder solution. AI integration coming soon!";
  
  res.json({ 
    status: 'success',
    message: 'Problem analyzed successfully',
    data: {
      problem: problem,
      solution: mockSolution,
      confidence: 0.85,
      processingTime: Math.random() * 2000 + 500 // Mock processing time
    }
  });
}));

/**
 * Video Generation API Endpoint
 * POST /api/generate-video
 * Creates educational videos based on problem solutions
 * @param {Object} body.content - Content to include in the generated video
 * @returns {Object} Response with video generation status and path
 */
app.post('/api/generate-video', asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  
  // Validate request body
  if (!content) {
    return next(new AppError('Content is required for video generation', 400));
  }
  
  // Log the video generation request
  logger.info(`Video generation requested for content: ${content.substring(0, 100)}...`);
  
  // TODO: Integrate with video generation service
  // For now, return a mock response
  const mockVideoPath = `/videos/educational_${Date.now()}.mp4`;
  
  res.json({ 
    status: 'success',
    message: 'Video generation completed',
    data: {
      videoPath: mockVideoPath,
      duration: Math.floor(Math.random() * 300) + 60, // Mock duration in seconds
      size: Math.floor(Math.random() * 50) + 10, // Mock size in MB
      quality: "1080p"
    }
  });
}));

/**
 * Error Handling Middleware
 * Catches undefined routes and applies global error handling
 */

// Handle undefined routes - must come after all defined routes
app.all('*', notFound);

// Global error handler - must be last middleware
app.use(globalErrorHandler);

/**
 * Server Startup
 * Starts the Express server and logs startup information
 */
app.listen(port, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
  logger.info(`📁 File uploads stored in: ./uploads/`);
  logger.info(`🌐 API endpoints available:`);
  logger.info(`   - POST /api/upload - File upload`);
  logger.info(`   - POST /api/solve - Problem solving`);
  logger.info(`   - POST /api/generate-video - Video generation`);
});
