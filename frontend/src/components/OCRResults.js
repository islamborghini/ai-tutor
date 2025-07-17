/**
 * OCRResults Component
 * Displays OCR extraction results with manual correction capabilities
 * Shows confidence scores, processing metadata, and validation feedback
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

    // Check for mathematical content
    const mathSymbols = /[+\-×÷=<>()[\]{}^√∫∑π]/;
    const hasMathSymbols = mathSymbols.test(ocrResult.extractedText);

    if (!hasMathSymbols && ocrResult.extractedText.length > 10) {
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
      hasMathContent: hasMathSymbols,
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
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
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

      {/* Validation Feedback */}
      {validation && (
        <div className="space-y-2">
          {validation.issues.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-yellow-800 mb-1">
                ⚠️ Quality Issues
              </h4>
              <ul className="text-sm text-yellow-700 list-disc list-inside">
                {validation.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {validation.recommendations.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                💡 Recommendations
              </h4>
              <ul className="text-sm text-blue-700 list-disc list-inside">
                {validation.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Text Display/Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Extracted Text:
          </label>
          {isEditable && (
            <button
              onClick={toggleEditing}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {isEditing ? '👁️ Preview' : '✏️ Edit'}
            </button>
          )}
        </div>

        {isEditing ? (
          <textarea
            value={editedText}
            onChange={handleTextChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-32 font-mono text-sm bg-white text-gray-900 placeholder-gray-500"
            placeholder="Edit the extracted text here..."
          />
        ) : (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md min-h-32">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900">
              {editedText || 'No text extracted'}
            </pre>
          </div>
        )}
      </div>

      {/* Processing Metadata */}
      <div className="bg-gray-50 rounded-md p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Processing Details
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Engine:</span>
            <span className="ml-1 text-gray-900">
              {result.metadata?.ocrEngine || 'Tesseract'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Time:</span>
            <span className="ml-1 text-gray-900">
              {result.metadata?.processingTime ? 
                `${(result.metadata.processingTime / 1000).toFixed(1)}s` : 
                'N/A'
              }
            </span>
          </div>
          <div>
            <span className="text-gray-500">Words:</span>
            <span className="ml-1 text-gray-900">
              {result.metadata?.wordsCount || result.words?.length || 0}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Lines:</span>
            <span className="ml-1 text-gray-900">
              {result.metadata?.linesCount || result.lines?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          🔄 Retry OCR
        </button>

        <div className="flex space-x-3">
          {isEditing && (
            <button
              onClick={() => {
                setEditedText(result.extractedText);
                setIsEditing(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
          
          <button
            onClick={handleAccept}
            disabled={!editedText.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ Use This Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default OCRResults;
