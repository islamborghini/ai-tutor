const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Problem Schema - Complete mathematical problem lifecycle tracking
 * Captures input, processing, solution steps, and generated content
 * Designed for AI Tutor platform with middle/high school focus
 */
const problemSchema = new Schema({
  
  // ========================================
  // INPUT SECTION - Original problem data
  // ========================================
  input: {
    // Original uploaded image
    originalImage: {
      url: { 
        type: String, 
        required: true,
        validate: {
          validator: function(v) {
            return /^https?:\/\/.+/.test(v) || /^\/uploads\/.+/.test(v);
          },
          message: 'URL must be a valid HTTP URL or local path'
        }
      }, // Cloudinary URL or local path
      publicId: String, // Cloudinary public ID for management
      filename: { 
        type: String, 
        required: true 
      }, // Original filename
      size: { 
        type: Number, 
        required: true,
        min: [0, 'File size cannot be negative']
      }, // File size in bytes
      dimensions: {
        width: { type: Number, min: 0 },
        height: { type: Number, min: 0 }
      }
    },
    
    // OCR Processing Results
    ocr: {
      extractedText: String, // Raw OCR output from Tesseract.js
      confidence: { 
        type: Number, 
        min: 0, 
        max: 100 
      }, // OCR confidence score (0-100)
      ocrEngine: {
        type: String,
        enum: ['tesseract'],
        default: 'tesseract'
      },
      processedAt: Date,
      processingTime: { type: Number, min: 0 } // milliseconds
    },
    
    // Manual corrections and validation
    userCorrections: {
      correctedText: String, // User-corrected text if OCR was wrong
      isCorrected: { type: Boolean, default: false },
      correctedAt: Date,
      correctedBy: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    
    // Problem classification
    classification: {
      problemType: {
        type: String,
        enum: ['algebra', 'geometry', 'calculus', 'statistics', 'trigonometry', 'arithmetic', 'word-problem', 'other'],
        required: true
      },
      gradeLevel: {
        type: String,
        enum: ['middle-school', 'high-school', 'college', 'advanced'],
        required: true
      },
      subjectArea: [String], // ['equations', 'functions', 'graphing', etc.]
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'expert'],
        required: true
      }
    }
  },

  // ========================================
  // SOLUTION SECTION - AI-generated solution
  // ========================================
  solution: {
    // Step-by-step solution breakdown
    steps: [{
      stepNumber: { 
        type: Number, 
        required: true,
        min: [1, 'Step number must be at least 1']
      },
      title: { 
        type: String,
        maxlength: [200, 'Step title cannot exceed 200 characters']
      }, // "Factor the quadratic equation"
      content: { 
        type: String, 
        required: true,
        maxlength: [2000, 'Step content cannot exceed 2000 characters']
      }, // Human-readable explanation
      mathNotation: String, // LaTeX/KaTeX formatted expressions
      reasoning: { 
        type: String,
        maxlength: [1000, 'Reasoning cannot exceed 1000 characters']
      }, // Why this step is necessary
      
      // Visual elements for this step
      visualAids: [{
        type: { 
          type: String, 
          enum: ['diagram', 'graph', 'table', 'image'] 
        },
        url: String, // Cloudinary URL if applicable
        description: String,
        canvasData: Schema.Types.Mixed // For whiteboard drawings
      }],
      
      // Validation and verification
      isVerified: { type: Boolean, default: false },
      verifiedBy: String, // AI model or human reviewer
      confidence: { 
        type: Number, 
        min: 0, 
        max: 100 
      } // AI confidence in this step (0-100)
    }],
    
    // Final answer and summary
    finalAnswer: {
      value: { 
        type: String, 
        required: function() {
          return this.solution && this.solution.steps && this.solution.steps.length > 0;
        }
      }, // The actual answer
      notation: String, // LaTeX formatted answer
      units: String, // If applicable (meters, degrees, etc.)
      explanation: { 
        type: String,
        maxlength: [500, 'Answer explanation cannot exceed 500 characters']
      } // Brief explanation of the answer
    },
    
    // AI processing metadata
    aiProcessing: {
      model: {
        type: String,
        enum: ['huggingface-transformers', 'openai-gpt-3.5-turbo', 'custom-model'],
        required: function() {
          return this.solution && this.solution.steps && this.solution.steps.length > 0;
        }
      },
      processingTime: { type: Number, min: 0 }, // milliseconds
      tokensUsed: { type: Number, min: 0 }, // For cost tracking
      cost: { type: Number, min: 0 }, // Actual cost in USD
      generatedAt: { type: Date, default: Date.now },
      
      // Quality metrics
      qualityScore: { 
        type: Number, 
        min: 0, 
        max: 100 
      }, // Internal quality assessment (0-100)
      reviewNeeded: { type: Boolean, default: false }
    }
  },

  // ========================================
  // GENERATED CONTENT - Additional resources
  // ========================================
  generatedContent: {
    // Video explanation
    video: {
      url: String, // Cloudinary video URL
      publicId: String,
      duration: { type: Number, min: 0 }, // seconds
      size: { type: Number, min: 0 }, // bytes
      quality: {
        type: String,
        enum: ['SD', 'HD', '4K'],
        default: 'HD'
      },
      thumbnail: String, // Thumbnail image URL
      generatedAt: Date,
      
      // Canvas recording data
      canvasData: [{
        timestamp: { type: Number, min: 0 }, // milliseconds from start
        drawing: Schema.Types.Mixed, // Canvas drawing state
        audioCue: String // Corresponding audio text
      }]
    },
    
    // Audio narration
    audio: {
      url: String, // Audio file URL
      transcript: String, // Full transcript text
      duration: { type: Number, min: 0 }, // seconds
      ttsEngine: {
        type: String,
        enum: ['web-speech-api', 'google-tts'],
        default: 'web-speech-api'
      },
      generatedAt: Date
    },
    
    // Practice problems
    practiceProblems: [{
      problemText: {
        type: String,
        required: true,
        maxlength: [1000, 'Practice problem text cannot exceed 1000 characters']
      },
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
      },
      hints: [String],
      solution: String,
      relatedConcepts: [String]
    }]
  },

  // ========================================
  // METADATA - Tracking and analytics
  // ========================================
  metadata: {
    // User and session info
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    sessionId: String, // For anonymous users
    ipAddress: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v) || /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(v);
        },
        message: 'Invalid IP address format'
      }
    }, // For analytics and rate limiting
    userAgent: String,
    
    // Learning objectives and tagging
    learningObjectives: [String], // What this problem teaches
    topics: [String], // Related mathematical topics
    tags: [String], // User-generated or auto-generated tags
    keywords: [String], // For search functionality
    
    // Analytics and performance
    analytics: {
      viewCount: { type: Number, default: 0, min: 0 },
      shareCount: { type: Number, default: 0, min: 0 },
      helpfulVotes: { type: Number, default: 0, min: 0 },
      totalVotes: { type: Number, default: 0, min: 0 },
      averageRating: { 
        type: Number, 
        min: 0, 
        max: 5,
        default: 0
      },
      completionRate: { 
        type: Number, 
        min: 0, 
        max: 100 
      }, // % of users who finished the solution
      
      // Time-based metrics
      averageTimeSpent: { type: Number, min: 0 }, // seconds
      dropOffPoints: [Number] // Step numbers where users typically stop
    },
    
    // Status and workflow
    status: {
      type: String,
      enum: ['processing', 'solved', 'failed', 'review-needed', 'archived'],
      default: 'processing'
    },
    isPublic: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    
    // Soft delete support
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },

  // ========================================
  // RELATIONSHIPS - Connected content
  // ========================================
  relationships: {
    // Similar problems
    similarProblems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
    
    // Prerequisites and follow-ups
    prerequisites: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
    followUps: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
    
    // Part of a series or lesson
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson' },
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit' },
    
    // User progress tracking
    userProgress: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      startedAt: Date,
      completedAt: Date,
      currentStep: { type: Number, min: 0 },
      isCompleted: { type: Boolean, default: false },
      timeSpent: { type: Number, min: 0 }, // seconds
      hintsUsed: { type: Number, min: 0, default: 0 },
      rating: { type: Number, min: 1, max: 5 }
    }]
  }

}, {
  // Schema options
  timestamps: true, // Automatically adds createdAt and updatedAt
  
  // JSON transform to clean up output
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  
  // Optimize for queries
  optimisticConcurrency: true
});

// ========================================
// INDEXES - For performance optimization
// ========================================
problemSchema.index({ 'input.classification.problemType': 1 });
problemSchema.index({ 'input.classification.gradeLevel': 1 });
problemSchema.index({ 'input.classification.difficulty': 1 });
problemSchema.index({ 'metadata.submittedBy': 1 });
problemSchema.index({ 'metadata.status': 1 });
problemSchema.index({ 'metadata.isDeleted': 1 });
problemSchema.index({ 'metadata.topics': 1 });
problemSchema.index({ 'metadata.keywords': 'text' }); // Text search
problemSchema.index({ createdAt: -1 }); // Recent problems first
problemSchema.index({ 'metadata.analytics.averageRating': -1 }); // Popular problems

// Compound indexes for common queries
problemSchema.index({ 
  'input.classification.problemType': 1, 
  'input.classification.gradeLevel': 1,
  'metadata.status': 1 
});

problemSchema.index({
  'metadata.isDeleted': 1,
  'metadata.status': 1,
  'createdAt': -1
});

// ========================================
// MIDDLEWARE - Pre/post hooks
// ========================================

// Pre-save middleware for validation
problemSchema.pre('save', function(next) {
  // Ensure step numbers are sequential
  if (this.solution && this.solution.steps && this.solution.steps.length > 0) {
    this.solution.steps.sort((a, b) => a.stepNumber - b.stepNumber);
    
    // Validate sequential step numbers
    for (let i = 0; i < this.solution.steps.length; i++) {
      if (this.solution.steps[i].stepNumber !== i + 1) {
        return next(new Error('Step numbers must be sequential starting from 1'));
      }
    }
  }
  
  // Update analytics calculations
  if (this.metadata && this.metadata.analytics) {
    const analytics = this.metadata.analytics;
    if (analytics.totalVotes > 0) {
      // Recalculate average rating
      analytics.averageRating = analytics.helpfulVotes / analytics.totalVotes * 5;
    }
  }
  
  next();
});

// Pre-remove middleware for soft delete
problemSchema.pre('remove', function(next) {
  this.metadata.isDeleted = true;
  this.metadata.deletedAt = new Date();
  next();
});

// ========================================
// METHODS - Instance methods
// ========================================

/**
 * Mark problem as completed and update status
 */
problemSchema.methods.markAsCompleted = function() {
  this.metadata.status = 'solved';
  return this.save();
};

/**
 * Increment view count with analytics tracking
 */
problemSchema.methods.incrementViewCount = function() {
  this.metadata.analytics.viewCount += 1;
  return this.save();
};

/**
 * Add or update user progress tracking
 * @param {ObjectId} userId - User ID
 * @param {Object} progressData - Progress data to update
 */
problemSchema.methods.addUserProgress = function(userId, progressData) {
  const existingProgress = this.relationships.userProgress.find(
    p => p.userId.toString() === userId.toString()
  );
  
  if (existingProgress) {
    Object.assign(existingProgress, progressData);
  } else {
    this.relationships.userProgress.push({ userId, ...progressData });
  }
  
  return this.save();
};

/**
 * Add helpful vote and update analytics
 * @param {Boolean} isHelpful - Whether the vote is helpful
 */
problemSchema.methods.addVote = function(isHelpful) {
  this.metadata.analytics.totalVotes += 1;
  if (isHelpful) {
    this.metadata.analytics.helpfulVotes += 1;
  }
  return this.save();
};

/**
 * Get completion percentage for this problem
 */
problemSchema.methods.getCompletionRate = function() {
  const completed = this.relationships.userProgress.filter(p => p.isCompleted).length;
  const total = this.relationships.userProgress.length;
  return total > 0 ? (completed / total) * 100 : 0;
};

// ========================================
// STATICS - Model-level methods
// ========================================

/**
 * Find problems by difficulty level
 * @param {String} difficulty - Difficulty level
 */
problemSchema.statics.findByDifficulty = function(difficulty) {
  return this.find({ 
    'input.classification.difficulty': difficulty,
    'metadata.isDeleted': false,
    'metadata.status': 'solved'
  });
};

/**
 * Find problems by grade level
 * @param {String} gradeLevel - Grade level
 */
problemSchema.statics.findByGradeLevel = function(gradeLevel) {
  return this.find({ 
    'input.classification.gradeLevel': gradeLevel,
    'metadata.isDeleted': false,
    'metadata.status': 'solved'
  });
};

/**
 * Get popular problems based on ratings and views
 * @param {Number} limit - Number of problems to return
 */
problemSchema.statics.getPopularProblems = function(limit = 10) {
  return this.find({ 
    'metadata.isDeleted': false,
    'metadata.status': 'solved'
  })
  .sort({ 
    'metadata.analytics.averageRating': -1, 
    'metadata.analytics.viewCount': -1 
  })
  .limit(limit);
};

/**
 * Search problems by keywords
 * @param {String} query - Search query
 * @param {Object} filters - Additional filters
 */
problemSchema.statics.searchProblems = function(query, filters = {}) {
  const searchCriteria = {
    $text: { $search: query },
    'metadata.isDeleted': false,
    'metadata.status': 'solved',
    ...filters
  };
  
  return this.find(searchCriteria, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

/**
 * Get analytics summary for problems
 */
problemSchema.statics.getAnalyticsSummary = function() {
  return this.aggregate([
    { $match: { 'metadata.isDeleted': false } },
    {
      $group: {
        _id: '$input.classification.problemType',
        count: { $sum: 1 },
        avgRating: { $avg: '$metadata.analytics.averageRating' },
        totalViews: { $sum: '$metadata.analytics.viewCount' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

module.exports = mongoose.model('Problem', problemSchema);
