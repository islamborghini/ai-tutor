/**
 * Custom hook for OCR processing with Tesseract.js
 * Handles image text extraction with progress tracking and error handling
 * Used by FileUpload component for client-side OCR processing
 */

import { useState, useCallback } from 'react';
import { createWorker } from 'tesseract.js';

/**
 * OCR processing hook with progress tracking
 * @returns {Object} OCR state and processing function
 */
const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  /**
   * Process image with Tesseract.js OCR
   * @param {File|string} imageSource - Image file or URL to process
   * @param {Object} options - OCR processing options
   * @returns {Promise<Object>} OCR result with extracted text and metadata
   */
  const processImage = useCallback(async (imageSource, options = {}) => {
    console.log('🔍 Starting OCR processing...', { 
      imageType: imageSource.type, 
      imageSize: imageSource.size 
    });
    
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    let worker = null;

    try {
      console.log('� Creating Tesseract worker...');
      setProgress(10);
      
      // Create Tesseract worker with basic configuration
      worker = await createWorker('eng');

      console.log('🚀 Starting text recognition...');
      setProgress(50);

      const startTime = Date.now();

      // Perform OCR recognition directly on the image file
      const { data } = await worker.recognize(imageSource);
      console.log('✅ OCR recognition completed:', data);

      const processingTime = Date.now() - startTime;

      // Process and validate OCR results
      const ocrResult = {
        extractedText: data.text.trim(),
        confidence: Math.round(data.confidence),
        words: data.words.map(word => ({
          text: word.text,
          confidence: Math.round(word.confidence),
          bbox: word.bbox
        })),
        lines: data.lines.map(line => ({
          text: line.text.trim(),
          confidence: Math.round(line.confidence),
          bbox: line.bbox
        })),
        metadata: {
          ocrEngine: 'tesseract',
          processingTime,
          processedAt: new Date().toISOString(),
          imageSize: imageSource.size || null,
          wordsCount: data.words.length,
          linesCount: data.lines.length
        }
      };

      setResult(ocrResult);
      setProgress(100);

      return ocrResult;

    } catch (err) {
      console.error('❌ OCR processing failed:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        imageType: imageSource?.type,
        imageSize: imageSource?.size,
        imageName: imageSource?.name
      });
      
      // Provide more specific error messages
      let errorMessage = 'Failed to extract text from image';
      let errorCode = 'OCR_PROCESSING_ERROR';
      
      if (err.message.includes('network') || err.message.includes('fetch')) {
        errorMessage = 'Network error while downloading OCR models';
        errorCode = 'NETWORK_ERROR';
      } else if (err.message.includes('worker')) {
        errorMessage = 'OCR worker initialization failed';
        errorCode = 'WORKER_ERROR';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'OCR processing timed out';
        errorCode = 'TIMEOUT_ERROR';
      } else if (err.message.includes('memory')) {
        errorMessage = 'Not enough memory for OCR processing';
        errorCode = 'MEMORY_ERROR';
      }
      
      setError({
        message: errorMessage,
        details: err.message,
        code: errorCode,
        originalError: err
      });
      throw err;

    } finally {
      setIsProcessing(false);
      
      // Cleanup worker
      if (worker) {
        try {
          await worker.terminate();
        } catch (terminateError) {
          console.warn('Failed to terminate OCR worker:', terminateError);
        }
      }
    }
  }, []);

  /**
   * Reset OCR state
   */
  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  /**
   * Validate OCR result quality
   * @param {Object} ocrResult - OCR result to validate
   * @returns {Object} Validation result with recommendations
   */
  const validateResult = useCallback((ocrResult) => {
    if (!ocrResult) return { isValid: false, issues: ['No OCR result'] };

    const issues = [];
    const recommendations = [];

    // Check confidence levels
    if (ocrResult.confidence < 60) {
      issues.push('Low overall confidence');
      recommendations.push('Consider retaking the photo with better lighting');
    }

    // Check if text was found
    if (!ocrResult.extractedText || ocrResult.extractedText.length < 3) {
      issues.push('No meaningful text detected');
      recommendations.push('Ensure the image contains clear, readable text');
    }

    // Check for mathematical symbols
    const mathSymbols = /[+\-=<>()[\]{}^√∫∑π]/;
    const hasMathSymbols = mathSymbols.test(ocrResult.extractedText);

    if (!hasMathSymbols && ocrResult.wordsCount > 5) {
      recommendations.push('Consider manual verification for mathematical expressions');
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations,
      hasMathContent: hasMathSymbols,
      qualityScore: ocrResult.confidence
    };
  }, []);

  return {
    // State
    isProcessing,
    progress,
    error,
    result,

    // Actions
    processImage,
    reset,
    validateResult
  };
};

export default useOCR;
