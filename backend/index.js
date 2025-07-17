const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');

// Import utilities
const logger = require('./utils/logger');
const { globalErrorHandler, AppError, asyncHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ai-tutor')
  .then(() => logger.info('✅ Connected to MongoDB'))
  .catch(err => logger.warn('⚠️  MongoDB not available, running without database'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware
app.use(express.json());

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// File upload route
app.post('/api/upload', upload.single('image'), asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }
  
  logger.info(`File uploaded: ${req.file.originalname} (${req.file.size} bytes)`);
  
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

// Problem solving route
app.post('/api/solve', asyncHandler(async (req, res, next) => {
  res.json({ 
    status: 'success',
    message: 'Problem solving endpoint' 
  });
}));

// Video generation route
app.post('/api/generate-video', asyncHandler(async (req, res, next) => {
  res.json({ 
    status: 'success',
    message: 'Video generation endpoint' 
  });
}));

// Handle undefined routes
app.all('*', notFound);

// Global error handler
app.use(globalErrorHandler);

app.listen(port, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});
