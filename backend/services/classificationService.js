/**
 * Mathematical Problem Classification Service
 * Analyzes mathematical problems to determine:
 * - Subject area (algebra, geometry, calculus, etc.)
 * - Difficulty level (1-10 scale)
 * - Grade level (middle school vs high school)
 * - Problem complexity metrics
 */

const logger = require('../utils/logger');

/**
 * Mathematical subject areas and their key indicators
 */
const SUBJECT_PATTERNS = {
  algebra: {
    keywords: [
      'solve for x', 'equation', 'variable', 'linear', 'quadratic', 'polynomial',
      'factor', 'expand', 'simplify', 'expression', 'inequality', 'system of equations',
      'slope', 'y-intercept', 'function', 'domain', 'range', 'graph'
    ],
    symbols: /[xy]|[a-z]\s*=|[a-z]\^|solve\s+for|linear|quadratic/i,
    patterns: [
      /\d*[a-z]\s*[\+\-\*\/\^]\s*\d*/,  // Variables with operations
      /[a-z]\s*=\s*\d+/,                 // Variable assignments
      /\([a-z]\s*[\+\-]\s*\d+\)/,       // Parenthetical expressions
      /[a-z]\^[0-9]/                     // Exponents
    ]
  },
  
  geometry: {
    keywords: [
      'triangle', 'circle', 'rectangle', 'square', 'polygon', 'angle', 'area',
      'perimeter', 'volume', 'surface area', 'radius', 'diameter', 'circumference',
      'parallel', 'perpendicular', 'congruent', 'similar', 'theorem', 'proof',
      'coordinate', 'distance', 'midpoint', 'slope', 'pythagorean'
    ],
    symbols: /°|∠|△|⊥|∥|≅|∼|π/,
    patterns: [
      /\d+\s*°/,                         // Degree measurements
      /area\s*=|perimeter\s*=|volume\s*=/i,
      /\d+\s*(cm|mm|m|ft|in|units)/,     // Measurements with units
      /radius|diameter|circumference/i
    ]
  },
  
  calculus: {
    keywords: [
      'derivative', 'integral', 'limit', 'continuous', 'discontinuous',
      'differentiate', 'integrate', 'chain rule', 'product rule', 'quotient rule',
      'optimization', 'maximum', 'minimum', 'critical point', 'inflection',
      'convergence', 'divergence', 'series', 'sequence'
    ],
    symbols: /∫|∂|∇|d\/dx|lim|∞|∑|∏/,
    patterns: [
      /d\/d[a-z]/,                       // Derivative notation
      /∫.*d[a-z]/,                       // Integral notation
      /lim.*→/,                          // Limit notation
      /[a-z]'/                           // Prime notation for derivatives
    ]
  },
  
  trigonometry: {
    keywords: [
      'sine', 'cosine', 'tangent', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
      'radian', 'degree', 'unit circle', 'periodic', 'amplitude', 'period',
      'phase shift', 'frequency', 'inverse', 'identity'
    ],
    symbols: /sin|cos|tan|cot|sec|csc|θ|φ|α|β/i,
    patterns: [
      /sin\(|cos\(|tan\(/i,              // Trig functions
      /\d+\s*°|\d+\s*rad/,               // Angle measurements
      /π\/\d+|\d*π/                      // Pi expressions
    ]
  },
  
  statistics: {
    keywords: [
      'mean', 'median', 'mode', 'range', 'variance', 'standard deviation',
      'probability', 'distribution', 'normal', 'binomial', 'poisson',
      'correlation', 'regression', 'hypothesis', 'confidence interval',
      'sample', 'population', 'z-score', 't-test'
    ],
    symbols: /μ|σ|χ²|∑|x̄|p\(|P\(/,
    patterns: [
      /\d+%|\d+\.\d+%/,                  // Percentages
      /probability|P\(/i,                 // Probability notation
      /mean|median|mode|std/i
    ]
  },
  
  arithmetic: {
    keywords: [
      'add', 'subtract', 'multiply', 'divide', 'sum', 'difference', 'product',
      'quotient', 'fraction', 'decimal', 'percent', 'ratio', 'proportion',
      'order of operations', 'PEMDAS', 'round', 'estimate'
    ],
    symbols: /\+|\-|\×|÷|\*|\/|%/,
    patterns: [
      /^\d+\s*[\+\-\×÷\*\/]\s*\d+/,     // Basic arithmetic
      /\d+\/\d+/,                        // Fractions
      /\d+\.\d+/,                        // Decimals
      /\d+%/                             // Percentages
    ]
  }
};

/**
 * Grade level indicators based on complexity and content
 */
const GRADE_LEVEL_INDICATORS = {
  middleSchool: {
    range: [6, 8],
    topics: [
      'basic algebra', 'linear equations', 'simple geometry', 'fractions',
      'decimals', 'percentages', 'ratios', 'proportions', 'basic statistics',
      'area', 'perimeter', 'volume of basic shapes', 'coordinate plane'
    ],
    complexity: {
      maxVariables: 2,
      maxDegree: 2,
      maxSteps: 5,
      basicOperations: true
    }
  },
  
  highSchool: {
    range: [9, 12],
    topics: [
      'advanced algebra', 'quadratic equations', 'polynomials', 'trigonometry',
      'advanced geometry', 'pre-calculus', 'calculus', 'statistics',
      'logarithms', 'exponentials', 'complex numbers', 'matrices'
    ],
    complexity: {
      maxVariables: 5,
      maxDegree: 4,
      maxSteps: 10,
      advancedOperations: true
    }
  }
};

/**
 * Classify a mathematical problem based on its text content
 * @param {string} problemText - The text content of the problem
 * @param {Object} metadata - Additional metadata (image analysis, etc.)
 * @returns {Object} Classification results
 */
function classifyProblem(problemText, metadata = {}) {
  try {
    if (!problemText || typeof problemText !== 'string') {
      throw new Error('Problem text is required for classification');
    }

    const text = problemText.toLowerCase().trim();
    
    // Subject area classification
    const subjectScores = {};
    let primarySubject = 'arithmetic'; // Default
    let maxScore = 0;

    // Analyze each subject area
    Object.entries(SUBJECT_PATTERNS).forEach(([subject, patterns]) => {
      let score = 0;
      
      // Keyword matching
      patterns.keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          score += 2;
        }
      });
      
      // Symbol matching
      if (patterns.symbols.test(problemText)) {
        score += 3;
      }
      
      // Pattern matching
      patterns.patterns.forEach(pattern => {
        if (pattern.test(problemText)) {
          score += 1;
        }
      });
      
      subjectScores[subject] = score;
      
      if (score > maxScore) {
        maxScore = score;
        primarySubject = subject;
      }
    });

    // Difficulty assessment (1-10 scale)
    const difficulty = assessDifficulty(problemText, primarySubject);
    
    // Grade level detection
    const gradeLevel = detectGradeLevel(problemText, primarySubject, difficulty);
    
    // Complexity metrics
    const complexity = analyzeComplexity(problemText);
    
    // Confidence score for classification
    const confidence = Math.min(100, (maxScore / 10) * 100);

    const classification = {
      primarySubject,
      subjectScores,
      difficulty,
      gradeLevel,
      complexity,
      confidence: Math.round(confidence),
      metadata: {
        classifiedAt: new Date().toISOString(),
        version: '1.0',
        ...metadata
      }
    };

    logger.info('Problem classified successfully', {
      primarySubject,
      difficulty,
      gradeLevel: gradeLevel.level,
      confidence
    });

    return classification;

  } catch (error) {
    logger.error('Problem classification failed', {
      error: error.message,
      problemText: problemText?.substring(0, 100)
    });
    
    // Return default classification on error
    return {
      primarySubject: 'arithmetic',
      subjectScores: { arithmetic: 1 },
      difficulty: 5,
      gradeLevel: {
        level: 'unknown',
        range: [6, 12],
        confidence: 0
      },
      complexity: {
        score: 5,
        factors: ['unknown']
      },
      confidence: 0,
      error: error.message,
      metadata: {
        classifiedAt: new Date().toISOString(),
        version: '1.0'
      }
    };
  }
}

/**
 * Assess problem difficulty on a 1-10 scale
 * @param {string} text - Problem text
 * @param {string} subject - Primary subject area
 * @returns {number} Difficulty score (1-10)
 */
function assessDifficulty(text, subject) {
  let difficulty = 1;
  
  // Base difficulty by subject
  const subjectBaseDifficulty = {
    arithmetic: 2,
    algebra: 4,
    geometry: 5,
    trigonometry: 6,
    statistics: 6,
    calculus: 8
  };
  
  difficulty = subjectBaseDifficulty[subject] || 3;
  
  // Complexity indicators
  const complexityIndicators = [
    { pattern: /\^[3-9]|\^[0-9]{2}/, points: 2 }, // High powers
    { pattern: /√|∛|∜/, points: 1 }, // Roots
    { pattern: /∫|∂|lim/, points: 3 }, // Calculus
    { pattern: /sin|cos|tan/i, points: 1 }, // Trigonometry
    { pattern: /log|ln/i, points: 2 }, // Logarithms
    { pattern: /matrix|determinant/i, points: 2 }, // Linear algebra
    { pattern: /system.*equation/i, points: 1 }, // Systems
    { pattern: /optimization|maximize|minimize/i, points: 2 } // Optimization
  ];
  
  complexityIndicators.forEach(indicator => {
    if (indicator.pattern.test(text)) {
      difficulty += indicator.points;
    }
  });
  
  // Word count factor (longer problems tend to be more complex)
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 50) difficulty += 1;
  if (wordCount > 100) difficulty += 1;
  
  return Math.min(10, Math.max(1, difficulty));
}

/**
 * Detect grade level based on problem characteristics
 * @param {string} text - Problem text
 * @param {string} subject - Primary subject
 * @param {number} difficulty - Difficulty score
 * @returns {Object} Grade level information
 */
function detectGradeLevel(text, subject, difficulty) {
  // High school subjects
  const highSchoolSubjects = ['calculus', 'trigonometry', 'statistics'];
  
  if (highSchoolSubjects.includes(subject) || difficulty >= 7) {
    return {
      level: 'highSchool',
      range: [9, 12],
      confidence: 85,
      reasoning: `${subject} and difficulty ${difficulty} indicate high school level`
    };
  }
  
  // Advanced middle school indicators
  const advancedMiddleSchool = [
    /quadratic|polynomial/i,
    /system.*equation/i,
    /coordinate.*plane/i,
    /slope.*intercept/i
  ];
  
  const hasAdvanced = advancedMiddleSchool.some(pattern => pattern.test(text));
  
  if (hasAdvanced || difficulty >= 5) {
    return {
      level: 'highSchool',
      range: [9, 12],
      confidence: 70,
      reasoning: 'Advanced concepts suggest high school level'
    };
  }
  
  // Default to middle school
  return {
    level: 'middleSchool',
    range: [6, 8],
    confidence: 75,
    reasoning: 'Basic concepts and moderate difficulty suggest middle school level'
  };
}

/**
 * Analyze problem complexity metrics
 * @param {string} text - Problem text
 * @returns {Object} Complexity analysis
 */
function analyzeComplexity(text) {
  const factors = [];
  let score = 1;
  
  // Count variables
  const variables = (text.match(/[a-z]/g) || []).length;
  if (variables > 5) {
    factors.push('multiple variables');
    score += 2;
  }
  
  // Count mathematical operations
  const operations = (text.match(/[\+\-\*\/\^=<>]/g) || []).length;
  if (operations > 10) {
    factors.push('multiple operations');
    score += 1;
  }
  
  // Check for advanced concepts
  const advancedConcepts = [
    { pattern: /derivative|integral/, name: 'calculus concepts' },
    { pattern: /matrix|determinant/, name: 'linear algebra' },
    { pattern: /probability|statistics/, name: 'statistical analysis' },
    { pattern: /optimization|constraint/, name: 'optimization problems' },
    { pattern: /proof|theorem/, name: 'mathematical proofs' }
  ];
  
  advancedConcepts.forEach(concept => {
    if (concept.pattern.test(text)) {
      factors.push(concept.name);
      score += 2;
    }
  });
  
  // Word problem complexity
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 100) {
    factors.push('lengthy word problem');
    score += 1;
  }
  
  return {
    score: Math.min(10, score),
    factors: factors.length > 0 ? factors : ['basic problem'],
    variableCount: variables,
    operationCount: operations,
    wordCount
  };
}

/**
 * Update classification based on solution feedback
 * @param {string} problemId - Problem ID
 * @param {Object} feedback - User or system feedback
 * @returns {Object} Updated classification
 */
function updateClassificationWithFeedback(problemId, feedback) {
  // This would integrate with the database to update classification
  // based on user feedback or solution accuracy
  logger.info('Classification feedback received', { problemId, feedback });
  
  return {
    updated: true,
    feedback,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  classifyProblem,
  assessDifficulty,
  detectGradeLevel,
  analyzeComplexity,
  updateClassificationWithFeedback,
  SUBJECT_PATTERNS,
  GRADE_LEVEL_INDICATORS
};
