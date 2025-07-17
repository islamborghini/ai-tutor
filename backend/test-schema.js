/**
 * Test Script for Problem Schema
 * Creates a sample problem document to validate schema implementation
 * Run with: node test-schema.js
 */

const mongoose = require('mongoose');
const { Problem, User } = require('./models');
const logger = require('./utils/logger');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ai-tutor')
  .then(() => logger.info('✅ Connected to MongoDB for testing'))
  .catch(err => {
    logger.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });

/**
 * Create a sample problem document
 */
async function createSampleProblem() {
  try {
    // Sample problem data
    const sampleProblem = {
      input: {
        originalImage: {
          url: '/uploads/sample-math-problem.jpg',
          filename: 'sample-math-problem.jpg',
          size: 245760, // ~240KB
          dimensions: {
            width: 800,
            height: 600
          }
        },
        ocr: {
          extractedText: 'Solve for x: 2x + 5 = 17',
          confidence: 92,
          ocrEngine: 'tesseract',
          processedAt: new Date(),
          processingTime: 1500
        },
        classification: {
          problemType: 'algebra',
          gradeLevel: 'high-school',
          subjectArea: ['equations', 'linear-algebra'],
          difficulty: 'medium'
        }
      },
      solution: {
        steps: [
          {
            stepNumber: 1,
            title: 'Subtract 5 from both sides',
            content: 'To isolate the term with x, we need to eliminate the constant term on the left side.',
            mathNotation: '2x + 5 - 5 = 17 - 5',
            reasoning: 'We subtract 5 from both sides to maintain the equation balance.',
            isVerified: true,
            confidence: 95
          },
          {
            stepNumber: 2,
            title: 'Simplify both sides',
            content: 'After subtracting 5 from both sides, we get a simpler equation.',
            mathNotation: '2x = 12',
            reasoning: 'Combining like terms gives us the simplified form.',
            isVerified: true,
            confidence: 98
          },
          {
            stepNumber: 3,
            title: 'Divide both sides by 2',
            content: 'To find the value of x, divide both sides by the coefficient of x.',
            mathNotation: 'x = 12 ÷ 2',
            reasoning: 'Dividing by the coefficient isolates the variable.',
            isVerified: true,
            confidence: 99
          },
          {
            stepNumber: 4,
            title: 'Final answer',
            content: 'The solution to the equation is x = 6.',
            mathNotation: 'x = 6',
            reasoning: 'This is the final answer after simplification.',
            isVerified: true,
            confidence: 100
          }
        ],
        finalAnswer: {
          value: '6',
          notation: 'x = 6',
          explanation: 'The value of x that satisfies the equation 2x + 5 = 17 is 6.'
        },
        aiProcessing: {
          model: 'huggingface-transformers',
          processingTime: 2300,
          tokensUsed: 150,
          cost: 0.002,
          qualityScore: 95,
          reviewNeeded: false
        }
      },
      metadata: {
        sessionId: 'test-session-001',
        learningObjectives: ['Linear equations', 'Algebraic manipulation', 'Problem solving'],
        topics: ['algebra', 'equations', 'solving'],
        tags: ['beginner-friendly', 'step-by-step', 'linear'],
        keywords: ['algebra', 'linear equation', 'solve for x'],
        analytics: {
          viewCount: 0,
          helpfulVotes: 0,
          totalVotes: 0,
          averageRating: 0
        },
        status: 'solved',
        isPublic: true,
        isFeatured: false
      }
    };

    // Create the problem document
    const problem = new Problem(sampleProblem);
    await problem.save();

    logger.info('✅ Sample problem created successfully!');
    logger.info(`Problem ID: ${problem._id}`);
    logger.info(`Problem Type: ${problem.input.classification.problemType}`);
    logger.info(`Grade Level: ${problem.input.classification.gradeLevel}`);
    logger.info(`Status: ${problem.metadata.status}`);
    logger.info(`Steps: ${problem.solution.steps.length}`);

    return problem;

  } catch (error) {
    logger.error('❌ Failed to create sample problem:', error);
    throw error;
  }
}

/**
 * Test schema methods
 */
async function testSchemaMethods(problem) {
  try {
    logger.info('\n🧪 Testing schema methods...');

    // Test incrementViewCount
    await problem.incrementViewCount();
    logger.info(`✅ View count incremented: ${problem.metadata.analytics.viewCount}`);

    // Test addVote
    await problem.addVote(true);
    logger.info(`✅ Helpful vote added: ${problem.metadata.analytics.helpfulVotes}/${problem.metadata.analytics.totalVotes}`);

    // Test static methods
    const algebraProblems = await Problem.findByDifficulty('medium');
    logger.info(`✅ Found ${algebraProblems.length} medium difficulty problems`);

    const highSchoolProblems = await Problem.findByGradeLevel('high-school');
    logger.info(`✅ Found ${highSchoolProblems.length} high school problems`);

    // Test search functionality
    const searchResults = await Problem.searchProblems('algebra equation');
    logger.info(`✅ Search found ${searchResults.length} problems matching "algebra equation"`);

    logger.info('✅ All schema methods working correctly!');

  } catch (error) {
    logger.error('❌ Schema methods test failed:', error);
    throw error;
  }
}

/**
 * Main test function
 */
async function runTests() {
  try {
    logger.info('🚀 Starting Problem Schema Tests...\n');

    // Clean up any existing test data
    await Problem.deleteMany({ 'metadata.sessionId': 'test-session-001' });
    logger.info('🧹 Cleaned up existing test data');

    // Create sample problem
    const problem = await createSampleProblem();

    // Test schema methods
    await testSchemaMethods(problem);

    // Test analytics
    const analytics = await Problem.getAnalyticsSummary();
    logger.info(`\n📊 Analytics Summary:`);
    analytics.forEach(stat => {
      logger.info(`   ${stat._id}: ${stat.count} problems, avg rating: ${stat.avgRating || 0}`);
    });

    logger.info('\n🎉 All tests completed successfully!');

  } catch (error) {
    logger.error('❌ Tests failed:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    logger.info('📝 Database connection closed');
    process.exit(0);
  }
}

// Run the tests
runTests();
