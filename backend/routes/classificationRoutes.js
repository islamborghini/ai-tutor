/**
 * Classification Routes
 * API endpoints for mathematical problem classification and analysis
 */

const express = require('express');
const router = express.Router();
const { classifyProblem, updateClassificationWithFeedback } = require('../services/classificationService');
const Problem = require('../models/Problem');
const logger = require('../utils/logger');

/**
 * @route POST /api/classification/analyze
 * @desc Classify a mathematical problem
 * @access Public
 * @body {string} problemText - The text content to classify
 * @body {object} metadata - Optional metadata for classification
 */
router.post('/analyze', async (req, res) => {
  try {
    const { problemText, metadata = {} } = req.body;

    if (!problemText) {
      return res.status(400).json({
        success: false,
        error: 'Problem text is required for classification'
      });
    }

    logger.info('Classification requested', {
      textLength: problemText.length,
      hasMetadata: Object.keys(metadata).length > 0
    });

    // Perform classification
    const classification = classifyProblem(problemText, metadata);

    res.json({
      success: true,
      data: {
        classification,
        originalText: problemText.substring(0, 200) + (problemText.length > 200 ? '...' : ''),
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Classification failed', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Classification processing failed',
      details: error.message
    });
  }
});

/**
 * @route POST /api/classification/batch
 * @desc Classify multiple problems at once
 * @access Public
 * @body {array} problems - Array of problem texts to classify
 */
router.post('/batch', async (req, res) => {
  try {
    const { problems } = req.body;

    if (!Array.isArray(problems) || problems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Problems array is required'
      });
    }

    if (problems.length > 50) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 50 problems allowed per batch'
      });
    }

    logger.info('Batch classification requested', {
      count: problems.length
    });

    // Process all problems
    const results = problems.map((problemText, index) => {
      try {
        const classification = classifyProblem(problemText);
        return {
          index,
          success: true,
          classification,
          originalText: problemText.substring(0, 100) + (problemText.length > 100 ? '...' : '')
        };
      } catch (error) {
        return {
          index,
          success: false,
          error: error.message,
          originalText: problemText.substring(0, 100) + (problemText.length > 100 ? '...' : '')
        };
      }
    });

    const successCount = results.filter(r => r.success).length;

    res.json({
      success: true,
      data: {
        results,
        summary: {
          total: problems.length,
          successful: successCount,
          failed: problems.length - successCount
        },
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Batch classification failed', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Batch classification processing failed',
      details: error.message
    });
  }
});

/**
 * @route PUT /api/classification/:problemId/feedback
 * @desc Update classification based on user feedback
 * @access Public
 * @params {string} problemId - Problem ID to update
 * @body {object} feedback - Feedback data
 */
router.put('/:problemId/feedback', async (req, res) => {
  try {
    const { problemId } = req.params;
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({
        success: false,
        error: 'Feedback data is required'
      });
    }

    logger.info('Classification feedback received', {
      problemId,
      feedbackType: Object.keys(feedback)
    });

    // Find the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found'
      });
    }

    // Update classification with feedback
    const updatedClassification = updateClassificationWithFeedback(problemId, feedback);

    // Update the problem in database
    if (feedback.primarySubject) {
      problem.classification.primarySubject = feedback.primarySubject;
    }
    if (feedback.difficulty) {
      problem.classification.difficulty = feedback.difficulty;
    }
    if (feedback.gradeLevel) {
      problem.classification.gradeLevel.level = feedback.gradeLevel;
    }

    // Track feedback history
    if (!problem.classification.feedback) {
      problem.classification.feedback = { userCorrections: [] };
    }

    Object.entries(feedback).forEach(([field, newValue]) => {
      problem.classification.feedback.userCorrections.push({
        field,
        oldValue: problem.classification[field],
        newValue,
        correctedAt: new Date()
      });
    });

    problem.classification.feedback.lastUpdated = new Date();
    await problem.save();

    res.json({
      success: true,
      data: {
        problemId,
        updatedClassification,
        appliedFeedback: feedback,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Classification feedback update failed', {
      error: error.message,
      problemId: req.params.problemId
    });

    res.status(500).json({
      success: false,
      error: 'Failed to update classification with feedback',
      details: error.message
    });
  }
});

/**
 * @route GET /api/classification/stats
 * @desc Get classification statistics and insights
 * @access Public
 */
router.get('/stats', async (req, res) => {
  try {
    logger.info('Classification statistics requested');

    // Aggregate classification data from database
    const stats = await Problem.aggregate([
      {
        $match: {
          'classification.primarySubject': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          totalProblems: { $sum: 1 },
          subjectDistribution: {
            $push: '$classification.primarySubject'
          },
          averageDifficulty: {
            $avg: '$classification.difficulty'
          },
          gradeLevelDistribution: {
            $push: '$classification.gradeLevel.level'
          },
          averageConfidence: {
            $avg: '$classification.confidence'
          }
        }
      }
    ]);

    // Process aggregated data
    let processedStats = {
      totalProblems: 0,
      subjectDistribution: {},
      gradeLevelDistribution: {},
      averageDifficulty: 0,
      averageConfidence: 0
    };

    if (stats.length > 0) {
      const data = stats[0];
      
      // Count subject distribution
      data.subjectDistribution.forEach(subject => {
        processedStats.subjectDistribution[subject] = 
          (processedStats.subjectDistribution[subject] || 0) + 1;
      });

      // Count grade level distribution
      data.gradeLevelDistribution.forEach(level => {
        processedStats.gradeLevelDistribution[level] = 
          (processedStats.gradeLevelDistribution[level] || 0) + 1;
      });

      processedStats.totalProblems = data.totalProblems;
      processedStats.averageDifficulty = Math.round(data.averageDifficulty * 100) / 100;
      processedStats.averageConfidence = Math.round(data.averageConfidence * 100) / 100;
    }

    res.json({
      success: true,
      data: {
        stats: processedStats,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Classification stats retrieval failed', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve classification statistics',
      details: error.message
    });
  }
});

/**
 * @route GET /api/classification/subjects
 * @desc Get available subject categories and their descriptions
 * @access Public
 */
router.get('/subjects', (req, res) => {
  try {
    const subjects = {
      algebra: {
        name: 'Algebra',
        description: 'Equations, variables, functions, and algebraic expressions',
        typicalGrades: [6, 7, 8, 9, 10, 11, 12],
        examples: ['Solve for x: 2x + 5 = 15', 'Factor: x² - 9', 'Graph: y = 2x + 3']
      },
      geometry: {
        name: 'Geometry',
        description: 'Shapes, angles, area, volume, and spatial relationships',
        typicalGrades: [7, 8, 9, 10, 11],
        examples: ['Find the area of a triangle', 'Calculate circumference', 'Prove triangle congruence']
      },
      calculus: {
        name: 'Calculus',
        description: 'Derivatives, integrals, limits, and advanced analysis',
        typicalGrades: [11, 12, 13, 14],
        examples: ['Find derivative of f(x) = x²', 'Evaluate ∫x dx', 'Calculate lim(x→0) sin(x)/x']
      },
      trigonometry: {
        name: 'Trigonometry',
        description: 'Sine, cosine, tangent, and angular relationships',
        typicalGrades: [9, 10, 11, 12],
        examples: ['Find sin(30°)', 'Solve triangle using law of cosines', 'Graph y = sin(x)']
      },
      statistics: {
        name: 'Statistics',
        description: 'Data analysis, probability, and statistical inference',
        typicalGrades: [8, 9, 10, 11, 12],
        examples: ['Calculate mean and median', 'Find probability', 'Interpret correlation']
      },
      arithmetic: {
        name: 'Arithmetic',
        description: 'Basic operations, fractions, decimals, and percentages',
        typicalGrades: [1, 2, 3, 4, 5, 6, 7, 8],
        examples: ['125 + 67', 'Convert 3/4 to decimal', 'Find 20% of 150']
      }
    };

    res.json({
      success: true,
      data: {
        subjects,
        totalSubjects: Object.keys(subjects).length,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Subject information retrieval failed', {
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve subject information',
      details: error.message
    });
  }
});

module.exports = router;
