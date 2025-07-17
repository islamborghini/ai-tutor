const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * User Schema - Basic user management for AI Tutor platform
 * Supports both registered users and anonymous sessions
 */
const userSchema = new Schema({
  
  // ========================================
  // BASIC USER INFORMATION
  // ========================================
  profile: {
    username: {
      type: String,
      unique: true,
      sparse: true, // Allows null values for anonymous users
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows null values for anonymous users
      lowercase: true,
      validate: {
        validator: function(v) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid email address'
      }
    },
    firstName: {
      type: String,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    avatar: String, // URL to profile picture
    
    // Educational information
    gradeLevel: {
      type: String,
      enum: ['middle-school', 'high-school', 'college', 'adult-learner', 'other']
    },
    subjects: [String], // Math subjects of interest
    learningGoals: [String]
  },

  // ========================================
  // AUTHENTICATION
  // ========================================
  auth: {
    passwordHash: String, // bcrypt hashed password
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    
    // Session management
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    
    // Account status
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    banReason: String,
    bannedUntil: Date
  },

  // ========================================
  // USER PREFERENCES
  // ========================================
  preferences: {
    // UI preferences
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    language: {
      type: String,
      default: 'en'
    },
    
    // Learning preferences
    difficultyPreference: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'adaptive'],
      default: 'adaptive'
    },
    explanationStyle: {
      type: String,
      enum: ['detailed', 'concise', 'visual'],
      default: 'detailed'
    },
    
    // Notification preferences
    notifications: {
      email: { type: Boolean, default: true },
      newFeatures: { type: Boolean, default: true },
      weeklyProgress: { type: Boolean, default: true }
    }
  },

  // ========================================
  // LEARNING ANALYTICS
  // ========================================
  analytics: {
    // Problem solving statistics
    problemsSubmitted: { type: Number, default: 0 },
    problemsSolved: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // minutes
    
    // Performance metrics
    averageAccuracy: { type: Number, min: 0, max: 100, default: 0 },
    streakCount: { type: Number, default: 0 }, // Current streak
    longestStreak: { type: Number, default: 0 },
    
    // Subject-specific performance
    subjectPerformance: [{
      subject: String,
      problemsSolved: { type: Number, default: 0 },
      averageAccuracy: { type: Number, min: 0, max: 100 },
      timeSpent: { type: Number, default: 0 } // minutes
    }],
    
    // Learning milestones
    achievements: [{
      type: String,
      earnedAt: { type: Date, default: Date.now },
      level: String
    }],
    
    // Activity tracking
    lastActive: { type: Date, default: Date.now },
    activeDays: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 }
  },

  // ========================================
  // ACCOUNT TYPE & PERMISSIONS
  // ========================================
  account: {
    type: {
      type: String,
      enum: ['anonymous', 'student', 'teacher', 'admin'],
      default: 'anonymous'
    },
    
    // Subscription/tier information
    tier: {
      type: String,
      enum: ['free', 'premium', 'unlimited'],
      default: 'free'
    },
    
    // Usage limits
    limits: {
      dailyProblems: { type: Number, default: 10 },
      monthlyProblems: { type: Number, default: 100 },
      videoGeneration: { type: Boolean, default: true }
    },
    
    // Current usage tracking
    usage: {
      problemsToday: { type: Number, default: 0 },
      problemsThisMonth: { type: Number, default: 0 },
      lastResetDate: { type: Date, default: Date.now }
    }
  },

  // ========================================
  // METADATA
  // ========================================
  metadata: {
    // Registration source
    registrationSource: {
      type: String,
      enum: ['web', 'mobile', 'api', 'import'],
      default: 'web'
    },
    
    // Privacy settings
    privacy: {
      profileVisible: { type: Boolean, default: false },
      showProgress: { type: Boolean, default: false },
      allowAnalytics: { type: Boolean, default: true }
    },
    
    // Technical information
    ipAddress: String,
    userAgent: String,
    timezone: String,
    
    // Soft delete
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletionReason: String
  }

}, {
  timestamps: true, // createdAt, updatedAt
  
  toJSON: {
    transform: function(doc, ret) {
      delete ret.auth.passwordHash;
      delete ret.auth.emailVerificationToken;
      delete ret.auth.passwordResetToken;
      delete ret.__v;
      return ret;
    }
  }
});

// ========================================
// INDEXES
// ========================================
userSchema.index({ 'profile.email': 1 });
userSchema.index({ 'profile.username': 1 });
userSchema.index({ 'account.type': 1 });
userSchema.index({ 'metadata.isDeleted': 1 });
userSchema.index({ 'auth.isActive': 1 });

// Compound index for active, non-deleted users
userSchema.index({
  'metadata.isDeleted': 1,
  'auth.isActive': 1,
  'account.type': 1
});

// ========================================
// METHODS
// ========================================

/**
 * Check if user can submit more problems today
 */
userSchema.methods.canSubmitProblem = function() {
  const today = new Date();
  const lastReset = new Date(this.account.usage.lastResetDate);
  
  // Reset daily counter if it's a new day
  if (today.toDateString() !== lastReset.toDateString()) {
    this.account.usage.problemsToday = 0;
    this.account.usage.lastResetDate = today;
  }
  
  return this.account.usage.problemsToday < this.account.limits.dailyProblems;
};

/**
 * Increment problem submission count
 */
userSchema.methods.incrementProblemCount = function() {
  this.account.usage.problemsToday += 1;
  this.account.usage.problemsThisMonth += 1;
  this.analytics.problemsSubmitted += 1;
  return this.save();
};

/**
 * Update learning analytics
 */
userSchema.methods.updateAnalytics = function(problemData) {
  this.analytics.totalTimeSpent += problemData.timeSpent || 0;
  this.analytics.lastActive = new Date();
  
  if (problemData.solved) {
    this.analytics.problemsSolved += 1;
    this.analytics.streakCount += 1;
    
    if (this.analytics.streakCount > this.analytics.longestStreak) {
      this.analytics.longestStreak = this.analytics.streakCount;
    }
  } else {
    this.analytics.streakCount = 0;
  }
  
  return this.save();
};

// ========================================
// STATICS
// ========================================

/**
 * Find active users
 */
userSchema.statics.findActiveUsers = function() {
  return this.find({
    'metadata.isDeleted': false,
    'auth.isActive': true,
    'auth.isBanned': false
  });
};

/**
 * Get user analytics summary
 */
userSchema.statics.getAnalyticsSummary = function() {
  return this.aggregate([
    { $match: { 'metadata.isDeleted': false } },
    {
      $group: {
        _id: '$account.type',
        count: { $sum: 1 },
        avgProblemsSubmitted: { $avg: '$analytics.problemsSubmitted' },
        avgTimeSpent: { $avg: '$analytics.totalTimeSpent' }
      }
    }
  ]);
};

module.exports = mongoose.model('User', userSchema);
