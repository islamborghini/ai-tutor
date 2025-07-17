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
const { processImage, validateImage, createThumbnail } = require('./utils/imageProcessor');
const { globalErrorHandler, AppError, asyncHandler, notFound } = require('./middleware/errorHandler');

// Import database models
const { Problem, User } = require('./models');

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
 * Ensure Upload Directories Exist
 * Creates necessary directories for file storage and processing
 */
const fs = require('fs');
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logger.info('📁 Created uploads directory');
}

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
 * File Upload API Endpoint with Image Preprocessing
 * POST /api/upload
 * Accepts image files, validates them, and applies preprocessing for better OCR
 * @param {File} problem - Image file containing the problem to solve
 * @returns {Object} Response with original and processed file details
 */
app.post('/api/upload', upload.single('problem'), asyncHandler(async (req, res, next) => {
  // Validate that a file was actually uploaded
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }
  
  logger.info(`📁 File uploaded: ${req.file.originalname} (${req.file.size} bytes)`);
  
  try {
    // Step 1: Validate the uploaded image
    const validation = await validateImage(req.file.path);
    if (!validation.isValid) {
      return next(new AppError(`Invalid image: ${validation.issues.join(', ')}`, 400));
    }
    
    logger.info(`✅ Image validation passed: ${validation.metadata.width}x${validation.metadata.height}`);
    
    // Step 2: Process the image for better OCR
    const processingResult = await processImage(req.file.path, req.file.filename);
    
    // Step 3: Create thumbnail for preview
    const thumbnailResult = await createThumbnail(req.file.path, req.file.filename);
    
    // Step 4: Prepare response data
    const responseData = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      mimetype: req.file.mimetype,
      original: processingResult.original,
      processed: processingResult.processed,
      thumbnail: thumbnailResult.success ? thumbnailResult : null,
      preprocessing: {
        success: processingResult.success,
        enhanced: processingResult.success,
        optimizedForOCR: processingResult.success,
        fallbackUsed: processingResult.fallbackToOriginal || false
      }
    };
    
    // Log processing results
    if (processingResult.success) {
      logger.info(`🎨 Image preprocessing completed successfully`);
      logger.info(`📊 Enhancement: Resized=${processingResult.enhancement.resized}, OCR-optimized=true`);
    } else {
      logger.warn(`⚠️  Image preprocessing failed, using original: ${processingResult.error}`);
    }
    
    // Return structured response with all file versions
    res.json({ 
      status: 'success',
      message: processingResult.success 
        ? 'File uploaded and processed successfully' 
        : 'File uploaded (processing failed, using original)',
      data: responseData
    });
    
  } catch (error) {
    logger.error(`❌ Upload processing error: ${error.message}`);
    
    // Fallback response with just original file
    res.json({ 
      status: 'success',
      message: 'File uploaded (processing unavailable)',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        path: req.file.path,
        mimetype: req.file.mimetype,
        preprocessing: {
          success: false,
          error: error.message,
          fallbackUsed: true
        }
      }
    });
  }
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
 * Problem Management API Endpoints
 * POST /api/problems - Create a new problem document
 * GET /api/problems - Get all problems with filtering
 * GET /api/problems/:id - Get specific problem by ID
 * PUT /api/problems/:id - Update problem
 * DELETE /api/problems/:id - Soft delete problem
 */

// Create new problem
app.post('/api/problems', asyncHandler(async (req, res, next) => {
  const problemData = req.body;
  
  // Validate required fields
  if (!problemData.input || !problemData.input.originalImage || !problemData.input.classification) {
    return next(new AppError('Missing required problem data', 400));
  }
  
  try {
    // Create new problem document
    const problem = new Problem(problemData);
    await problem.save();
    
    logger.info(`New problem created: ${problem._id}`);
    
    res.status(201).json({
      status: 'success',
      message: 'Problem created successfully',
      data: { problem }
    });
  } catch (error) {
    logger.error('Problem creation failed:', error);
    return next(new AppError('Failed to create problem', 500));
  }
}));

// Get all problems with filtering
app.get('/api/problems', asyncHandler(async (req, res, next) => {
  const { 
    problemType, 
    gradeLevel, 
    difficulty, 
    status = 'solved',
    limit = 20,
    page = 1 
  } = req.query;
  
  // Build filter criteria
  const filter = {
    'metadata.isDeleted': false
  };
  
  if (problemType) filter['input.classification.problemType'] = problemType;
  if (gradeLevel) filter['input.classification.gradeLevel'] = gradeLevel;
  if (difficulty) filter['input.classification.difficulty'] = difficulty;
  if (status) filter['metadata.status'] = status;
  
  try {
    const skip = (page - 1) * limit;
    const problems = await Problem.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('metadata.submittedBy', 'profile.username')
      .select('-solution.aiProcessing -relationships.userProgress');
    
    const total = await Problem.countDocuments(filter);
    
    res.json({
      status: 'success',
      data: {
        problems,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: problems.length,
          totalProblems: total
        }
      }
    });
  } catch (error) {
    logger.error('Failed to fetch problems:', error);
    return next(new AppError('Failed to fetch problems', 500));
  }
}));

// Get specific problem by ID
app.get('/api/problems/:id', asyncHandler(async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate('metadata.submittedBy', 'profile.username profile.avatar')
      .populate('relationships.similarProblems', 'input.classification metadata.analytics');
    
    if (!problem || problem.metadata.isDeleted) {
      return next(new AppError('Problem not found', 404));
    }
    
    // Increment view count
    await problem.incrementViewCount();
    
    res.json({
      status: 'success',
      data: { problem }
    });
  } catch (error) {
    logger.error('Failed to fetch problem:', error);
    return next(new AppError('Failed to fetch problem', 500));
  }
}));

// Update problem
app.put('/api/problems/:id', asyncHandler(async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem || problem.metadata.isDeleted) {
      return next(new AppError('Problem not found', 404));
    }
    
    // Update problem with new data
    Object.assign(problem, req.body);
    await problem.save();
    
    logger.info(`Problem updated: ${problem._id}`);
    
    res.json({
      status: 'success',
      message: 'Problem updated successfully',
      data: { problem }
    });
  } catch (error) {
    logger.error('Failed to update problem:', error);
    return next(new AppError('Failed to update problem', 500));
  }
}));

// Soft delete problem
app.delete('/api/problems/:id', asyncHandler(async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem || problem.metadata.isDeleted) {
      return next(new AppError('Problem not found', 404));
    }
    
    // Soft delete
    problem.metadata.isDeleted = true;
    problem.metadata.deletedAt = new Date();
    await problem.save();
    
    logger.info(`Problem deleted: ${problem._id}`);
    
    res.json({
      status: 'success',
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete problem:', error);
    return next(new AppError('Failed to delete problem', 500));
  }
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
  logger.info(`   - POST /api/problems - Create problem`);
  logger.info(`   - GET /api/problems - List problems`);
  logger.info(`   - GET /api/problems/:id - Get problem`);
  logger.info(`   - PUT /api/problems/:id - Update problem`);
  logger.info(`   - DELETE /api/problems/:id - Delete problem`);
});
