/**
 * ClassificationDisplay Component
 * Shows the classification results for a mathematical problem
 * Displays subject, difficulty, grade level, and confidence
 */

import React from 'react';

const ClassificationDisplay = ({ 
  classification, 
  showDetails = false, 
  onFeedback = null,
  className = '' 
}) => {
  if (!classification) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <p className="text-gray-500 text-sm">No classification available</p>
      </div>
    );
  }

  // Get subject color based on type
  const getSubjectColor = (subject) => {
    const colors = {
      algebra: 'bg-blue-100 text-blue-800 border-blue-200',
      geometry: 'bg-green-100 text-green-800 border-green-200',
      calculus: 'bg-purple-100 text-purple-800 border-purple-200',
      trigonometry: 'bg-orange-100 text-orange-800 border-orange-200',
      statistics: 'bg-pink-100 text-pink-800 border-pink-200',
      arithmetic: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get difficulty color based on level
  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 3) return 'bg-green-100 text-green-800';
    if (difficulty <= 6) return 'bg-yellow-100 text-yellow-800';
    if (difficulty <= 8) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  // Get grade level color
  const getGradeLevelColor = (level) => {
    const colors = {
      middleSchool: 'bg-cyan-100 text-cyan-800',
      highSchool: 'bg-indigo-100 text-indigo-800',
      college: 'bg-purple-100 text-purple-800',
      unknown: 'bg-gray-100 text-gray-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  // Format difficulty text
  const getDifficultyText = (difficulty) => {
    const labels = {
      1: 'Very Easy', 2: 'Easy', 3: 'Easy-Medium', 4: 'Medium', 5: 'Medium',
      6: 'Medium-Hard', 7: 'Hard', 8: 'Hard', 9: 'Very Hard', 10: 'Expert'
    };
    return labels[difficulty] || `Level ${difficulty}`;
  };

  // Format grade level text
  const getGradeLevelText = (gradeLevel) => {
    if (!gradeLevel) return 'Unknown';
    
    const labels = {
      middleSchool: 'Middle School',
      highSchool: 'High School',
      college: 'College Level',
      unknown: 'Unknown'
    };
    
    const levelText = labels[gradeLevel.level] || gradeLevel.level;
    
    if (gradeLevel.range && gradeLevel.range.length === 2) {
      return `${levelText} (Grades ${gradeLevel.range[0]}-${gradeLevel.range[1]})`;
    }
    
    return levelText;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Problem Classification</h3>
        <div className="flex items-center">
          <span className="text-xs text-gray-500">Confidence:</span>
          <span className={`ml-1 text-xs font-medium ${
            classification.confidence >= 80 ? 'text-green-600' :
            classification.confidence >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {classification.confidence}%
          </span>
        </div>
      </div>

      {/* Main classification tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Subject */}
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSubjectColor(classification.primarySubject)}`}>
          {classification.primarySubject.charAt(0).toUpperCase() + classification.primarySubject.slice(1)}
        </div>

        {/* Difficulty */}
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(classification.difficulty)}`}>
          {getDifficultyText(classification.difficulty)} ({classification.difficulty}/10)
        </div>

        {/* Grade Level */}
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeLevelColor(classification.gradeLevel?.level)}`}>
          {getGradeLevelText(classification.gradeLevel)}
        </div>
      </div>

      {/* Detailed information */}
      {showDetails && (
        <div className="space-y-3 pt-3 border-t border-gray-100">
          {/* Subject scores */}
          {classification.subjectScores && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Subject Analysis:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(classification.subjectScores)
                  .filter(([_, score]) => score > 0)
                  .sort(([,a], [,b]) => b - a)
                  .map(([subject, score]) => (
                    <div key={subject} className="flex justify-between items-center text-xs">
                      <span className="text-gray-600 capitalize">{subject}:</span>
                      <span className="font-medium">{score}%</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Complexity factors */}
          {classification.complexity && classification.complexity.factors && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Complexity Factors:</h4>
              <div className="flex flex-wrap gap-1">
                {classification.complexity.factors.map((factor, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Grade level reasoning */}
          {classification.gradeLevel?.reasoning && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Grade Level Reasoning:</h4>
              <p className="text-xs text-gray-600">{classification.gradeLevel.reasoning}</p>
            </div>
          )}

          {/* Metrics */}
          {classification.complexity && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-800">
                  {classification.complexity.variableCount || 0}
                </div>
                <div className="text-xs text-gray-500">Variables</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">
                  {classification.complexity.operationCount || 0}
                </div>
                <div className="text-xs text-gray-500">Operations</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">
                  {classification.complexity.wordCount || 0}
                </div>
                <div className="text-xs text-gray-500">Words</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feedback buttons */}
      {onFeedback && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600 mb-2">Is this classification correct?</p>
          <div className="flex gap-2">
            <button
              onClick={() => onFeedback('correct', classification)}
              className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors"
            >
              ✓ Correct
            </button>
            <button
              onClick={() => onFeedback('incorrect', classification)}
              className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors"
            >
              ✗ Incorrect
            </button>
          </div>
        </div>
      )}

      {/* Classification timestamp */}
      {classification.classifiedAt && (
        <div className="mt-3 pt-2 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            Classified: {new Date(classification.classifiedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassificationDisplay;
