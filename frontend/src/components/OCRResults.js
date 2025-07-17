/**
 * OCRResults Component
 * Displays OCR extraction results with manual correction capabilities
 * Shows confidence scores, processing metadata, validation feedback, and mathematical analysis
 */

import React, { useState, useEffect } from 'react';

/**
 * OCRResults component for displaying and editing OCR results
 * @param {Object} props - Component props
 * @param {Object} props.result - OCR result object
 * @param {Function} props.onTextChange - Callback when text is manually edited
 * @param {Function} props.onAccept - Callback when user accepts the OCR result
 * @param {Function} props.onRetry - Callback to retry OCR processing
 * @param {boolean} props.isEditable - Whether the text should be editable
 */
const OCRResults = ({ 
  result, 
  onTextChange, 
  onAccept, 
  onRetry, 
  isEditable = true 
}) => {
  const [editedText, setEditedText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [validation, setValidation] = useState(null);

  // Update edited text when result changes
  useEffect(() => {
    if (result?.extractedText) {
      setEditedText(result.extractedText);
    }
  }, [result]);

  // Validate result when it changes
  useEffect(() => {
    if (result) {
      validateOCRResult(result);
    }
  }, [result]);

  /**
   * Validate OCR result quality and provide feedback
   */
  const validateOCRResult = (ocrResult) => {
    const issues = [];
    const recommendations = [];

    // Check confidence levels
    if (ocrResult.confidence < 60) {
      issues.push('Low confidence score');
      recommendations.push('Consider retaking the photo with better lighting');
    }

    // Check for mathematical content using analysis or fallback
    let hasMathContent = false;
    if (ocrResult.mathAnalysis) {
      hasMathContent = ocrResult.mathAnalysis.hasMathContent;
    } else {
      // Fallback to basic detection
      const mathSymbols = /[+\-×÷=<>()[\]{}^√∫∑π]/;
      hasMathContent = mathSymbols.test(ocrResult.extractedText);
    }

    if (!hasMathContent && ocrResult.extractedText.length > 10) {
      recommendations.push('Verify mathematical symbols were captured correctly');
    }

    // Check text length
    if (ocrResult.extractedText.length < 5) {
      issues.push('Very short text detected');
      recommendations.push('Ensure the image contains readable text');
    }

    setValidation({
      isValid: issues.length === 0,
      issues,
      recommendations,
      hasMathContent,
      qualityScore: ocrResult.confidence
    });
  };

  /**
   * Handle text editing
   */
  const handleTextChange = (event) => {
    const newText = event.target.value;
    setEditedText(newText);
    
    if (onTextChange) {
      onTextChange(newText);
    }
  };

  /**
   * Toggle editing mode
   */
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  /**
   * Accept the current text
   */
  const handleAccept = () => {
    if (onAccept) {
      onAccept(editedText);
    }
    setIsEditing(false);
  };

  /**
   * Get confidence color based on score
   */
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
   * Get confidence label
   */
  const getConfidenceLabel = (confidence) => {
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  if (!result) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          📝 Extracted Text
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Confidence:</span>
          <span className={`font-medium ${getConfidenceColor(result.confidence)}`}>
            {result.confidence}% ({getConfidenceLabel(result.confidence)})
          </span>
        </div>
      </div>

      {/* Mathematical Analysis Results - DISABLED FOR NOW */}
      {result.mathAnalysis && false && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-purple-800 mb-3 flex items-center">
            🧮 Mathematical Content Analysis
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="bg-white p-3 rounded border text-center">
              <div className="text-lg font-bold text-purple-600">
                {result.mathAnalysis.hasMathContent ? '✅' : '❌'}
              </div>
              <div className="text-xs text-gray-600">Math Content</div>
            </div>
            <div className="bg-white p-3 rounded border text-center">
              <div className="text-lg font-bold text-green-600">
                {result.mathAnalysis.confidence || 0}%
              </div>
              <div className="text-xs text-gray-600">Math Confidence</div>
            </div>
            <div className="bg-white p-3 rounded border text-center">
              <div className="text-lg font-bold text-blue-600 capitalize">
                {result.mathAnalysis.statistics?.complexity || 'None'}
              </div>
              <div className="text-xs text-gray-600">Complexity</div>
            </div>
          </div>

          {result.mathAnalysis.hasMathContent && result.mathAnalysis.statistics?.types && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-purple-700 font-medium">Categories found:</span>
              {result.mathAnalysis.statistics.types.map((type, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                >
                  {type} ({result.mathAnalysis.statistics.categories[type]})
                </span>
              ))}
            </div>
          )}

          {result.mathAnalysis.recommendations && result.mathAnalysis.recommendations.length > 0 && (
            <div className="mt-3 space-y-1">
              <span className="text-xs text-purple-700 font-medium">Mathematical Recommendations:</span>
              {result.mathAnalysis.recommendations.slice(0, 2).map((rec, index) => (
                <div key={index} className="text-xs text-purple-600">
                  • {rec.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Validation Feedback */}
      {validation && (
        <div className="space-y-2">
          {validation.issues.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-yellow-800 mb-1">⚠️ Issues Detected</h4>
              <ul className="text-sm text-yellow-700 list-disc list-inside">
                {validation.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {validation.recommendations.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-blue-800 mb-1">💡 Recommendations</h4>
              <ul className="text-sm text-blue-700 list-disc list-inside">
                {validation.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Text Display/Edit Area */}
      <div className="space-y-3">
        {isEditing ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Edit extracted text:
            </label>
            <textarea
              value={editedText}
              onChange={handleTextChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={Math.max(3, Math.ceil(editedText.length / 80))}
              placeholder="Edit the extracted text..."
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extracted text:
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 min-h-[100px] whitespace-pre-wrap text-gray-900">
              {editedText || 'No text extracted'}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isEditable && (
          <div className="flex flex-wrap gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  ✓ Save Changes
                </button>
                <button
                  onClick={toggleEditing}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleEditing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  ✏️ Edit Text
                </button>
                {onAccept && (
                  <button
                    onClick={() => handleAccept()}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    ✓ Accept & Continue
                  </button>
                )}
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    🔄 Retry OCR
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Metadata */}
      {result.metadata && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">📊 Processing Details</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Engine:</span>
              <span className="ml-1 font-medium">{result.metadata.ocrEngine}</span>
            </div>
            <div>
              <span className="text-gray-500">Time:</span>
              <span className="ml-1 font-medium">{result.metadata.processingTime}ms</span>
            </div>
            <div>
              <span className="text-gray-500">Words:</span>
              <span className="ml-1 font-medium">{result.metadata.wordsCount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OCRResults;
