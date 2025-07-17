/**
 * Mathematical Problem Classification Test Suite
 * Tests the classification service with various problem types
 */

const { classifyProblem } = require('./services/classificationService');
const logger = require('./utils/logger');

/**
 * Test problems covering different subjects and difficulty levels
 */
const testProblems = [
  // Algebra - Middle School
  {
    text: "Solve for x: 2x + 5 = 15",
    expected: {
      primarySubject: 'algebra',
      gradeLevel: 'middleSchool',
      difficulty: 3
    }
  },
  
  // Algebra - High School
  {
    text: "Factor the quadratic equation: x² - 5x + 6 = 0",
    expected: {
      primarySubject: 'algebra',
      gradeLevel: 'highSchool',
      difficulty: 5
    }
  },
  
  // Geometry - Middle School
  {
    text: "Find the area of a rectangle with length 8 cm and width 5 cm",
    expected: {
      primarySubject: 'geometry',
      gradeLevel: 'middleSchool',
      difficulty: 2
    }
  },
  
  // Geometry - High School
  {
    text: "Prove that the sum of angles in a triangle equals 180°",
    expected: {
      primarySubject: 'geometry',
      gradeLevel: 'highSchool',
      difficulty: 6
    }
  },
  
  // Calculus - High School/College
  {
    text: "Find the derivative of f(x) = x³ + 2x² - 5x + 1",
    expected: {
      primarySubject: 'calculus',
      gradeLevel: 'highSchool',
      difficulty: 7
    }
  },
  
  // Trigonometry - High School
  {
    text: "Find the value of sin(30°) and cos(60°)",
    expected: {
      primarySubject: 'trigonometry',
      gradeLevel: 'highSchool',
      difficulty: 4
    }
  },
  
  // Statistics - High School
  {
    text: "Calculate the mean, median, and mode of the dataset: 5, 7, 3, 8, 5, 9, 2, 5",
    expected: {
      primarySubject: 'statistics',
      gradeLevel: 'highSchool',
      difficulty: 3
    }
  },
  
  // Arithmetic - Middle School
  {
    text: "Convert 3/4 to a decimal and then to a percentage",
    expected: {
      primarySubject: 'arithmetic',
      gradeLevel: 'middleSchool',
      difficulty: 2
    }
  },
  
  // Complex Calculus - College
  {
    text: "Evaluate the integral: ∫(x² + 3x + 2)dx from 0 to 4",
    expected: {
      primarySubject: 'calculus',
      gradeLevel: 'highSchool',
      difficulty: 8
    }
  },
  
  // Advanced Algebra - High School
  {
    text: "Solve the system of equations: 2x + 3y = 12 and x - y = 1",
    expected: {
      primarySubject: 'algebra',
      gradeLevel: 'highSchool',
      difficulty: 5
    }
  }
];

/**
 * Run classification tests
 */
async function runClassificationTests() {
  console.log('🧪 Starting Mathematical Problem Classification Tests\n');
  
  let passedTests = 0;
  let totalTests = testProblems.length;
  
  for (let i = 0; i < testProblems.length; i++) {
    const testProblem = testProblems[i];
    
    try {
      console.log(`Test ${i + 1}: "${testProblem.text}"`);
      
      // Perform classification
      const result = classifyProblem(testProblem.text);
      
      // Check results
      const subjectMatch = result.primarySubject === testProblem.expected.primarySubject;
      const gradeLevelMatch = result.gradeLevel.level === testProblem.expected.gradeLevel;
      const difficultyClose = Math.abs(result.difficulty - testProblem.expected.difficulty) <= 2;
      
      console.log(`   Classified as: ${result.primarySubject} | ${result.gradeLevel.level} | Difficulty: ${result.difficulty}`);
      console.log(`   Expected: ${testProblem.expected.primarySubject} | ${testProblem.expected.gradeLevel} | Difficulty: ${testProblem.expected.difficulty}`);
      
      if (subjectMatch && gradeLevelMatch && difficultyClose) {
        console.log('   ✅ PASSED\n');
        passedTests++;
      } else {
        console.log('   ❌ FAILED');
        console.log(`      Subject: ${subjectMatch ? '✓' : '✗'}`);
        console.log(`      Grade Level: ${gradeLevelMatch ? '✓' : '✗'}`);
        console.log(`      Difficulty: ${difficultyClose ? '✓' : '✗'}\n`);
      }
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}\n`);
    }
  }
  
  // Print summary
  console.log('📊 Test Results Summary:');
  console.log(`   Passed: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests * 100)}%)`);
  console.log(`   Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests >= totalTests * 0.8) {
    console.log('🎉 Classification system is working well (≥80% accuracy)');
  } else if (passedTests >= totalTests * 0.6) {
    console.log('⚠️  Classification system needs improvement (60-80% accuracy)');
  } else {
    console.log('🔴 Classification system needs significant work (<60% accuracy)');
  }
}

/**
 * Test individual classification functions
 */
function testClassificationFunctions() {
  console.log('\n🔧 Testing Individual Classification Functions\n');
  
  // Test subject pattern matching
  const testTexts = [
    "solve for x",
    "triangle area",
    "derivative",
    "sin(30°)",
    "mean and median",
    "2 + 2"
  ];
  
  testTexts.forEach(text => {
    const result = classifyProblem(text);
    console.log(`"${text}" → ${result.primarySubject} (confidence: ${result.confidence}%)`);
  });
}

/**
 * Performance test
 */
function testPerformance() {
  console.log('\n⚡ Performance Test\n');
  
  const testText = "Solve the quadratic equation x² - 4x + 3 = 0 using the quadratic formula";
  const iterations = 1000;
  
  const startTime = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    classifyProblem(testText);
  }
  
  const endTime = Date.now();
  const avgTime = (endTime - startTime) / iterations;
  
  console.log(`Classified ${iterations} problems in ${endTime - startTime}ms`);
  console.log(`Average time per classification: ${avgTime.toFixed(2)}ms`);
  
  if (avgTime < 10) {
    console.log('✅ Performance is excellent (<10ms per classification)');
  } else if (avgTime < 50) {
    console.log('✅ Performance is good (<50ms per classification)');
  } else {
    console.log('⚠️  Performance may need optimization (≥50ms per classification)');
  }
}

// Run all tests if this file is executed directly
if (require.main === module) {
  runClassificationTests()
    .then(() => {
      testClassificationFunctions();
      testPerformance();
      process.exit(0);
    })
    .catch(error => {
      console.error('Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runClassificationTests,
  testClassificationFunctions,
  testPerformance,
  testProblems
};
