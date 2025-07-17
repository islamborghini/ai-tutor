import { useState, useCallback } from 'react';
import { createWorker } from 'tesseract.js';

/**
 * Custom Hook for OCR Processing using Tesseract.js
 * Provides client-side text extraction from images for mathematical problems
 * Features: Progress tracking, error handling, confidence scoring
 * @returns {Object} OCR functions and state
 */
const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [worker, setWorker] = useState(null);

  /**
   * Initializes the Tesseract worker with optimal settings for mathematical text
   * Uses English language with additional mathematical symbol recognition
   */
  const initializeWorker = useCallback(async () => {
    if (worker) return worker;

    try {
      console.log('🔧 Initializing Tesseract OCR worker...');
      const newWorker = await createWorker('eng');

      // Configure Tesseract for better mathematical text recognition
      await newWorker.setParameters({
        tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-*/=()[]{}^.,<>≤≥±∞∑∏√∂∫θπφλμσΩαβγδεζηικλμνξοπρστυφχψω',
        tessedit_pageseg_mode: '6', // Uniform block of text
        preserve_interword_spaces: '1'
      });

      setWorker(newWorker);
      console.log('✅ Tesseract worker initialized successfully');
      return newWorker;
    } catch (error) {
      console.error('❌ Failed to initialize Tesseract worker:', error);
      throw new Error(`OCR initialization failed: ${error.message}`);
    }
  }, [worker]);

  /**
   * Processes an image file to extract text using OCR
   * Optimized for mathematical equations and problem text
   * @param {File|string} imageSource - Image file or URL to process
   * @returns {Object} OCR result with extracted text and confidence
   */
  const extractText = useCallback(async (imageSource) => {
    if (!imageSource) {
      throw new Error('No image provided for OCR processing');
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Initialize worker if not already done
      const ocrWorker = await initializeWorker();

      console.log('📖 Starting OCR text extraction...');
      
      // Simulate progress updates since logger function can't be serialized across worker boundary
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 5;
          return next >= 95 ? 95 : next; // Cap at 95% until completion
        });
      }, 100);

      // Perform OCR recognition without logger to avoid DataCloneError
      const result = await ocrWorker.recognize(imageSource);
      
      // Clear progress interval and set to 100%
      clearInterval(progressInterval);
      setProgress(100);

      // Extract and clean the recognized text
      const extractedText = result.data.text.trim();
      const confidence = result.data.confidence;

      console.log('✅ OCR extraction completed');
      console.log(`📊 Confidence: ${confidence.toFixed(1)}%`);
      console.log(`📝 Extracted text: "${extractedText.substring(0, 100)}..."`);

      return {
        success: true,
        text: extractedText,
        confidence: confidence,
        rawData: result.data,
        metadata: {
          wordCount: result.data.words?.length || 0,
          lines: result.data.lines?.length || 0,
          processingTime: Date.now()
        }
      };

    } catch (error) {
      console.error('❌ OCR processing failed:', error);
      return {
        success: false,
        error: error.message,
        text: '',
        confidence: 0
      };
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [initializeWorker]);

  /**
   * Processes multiple images in sequence
   * Useful for multi-part problems or batch processing
   * @param {Array} imageFiles - Array of image files to process
   * @returns {Array} Array of OCR results
   */
  const extractTextFromMultiple = useCallback(async (imageFiles) => {
    if (!Array.isArray(imageFiles) || imageFiles.length === 0) {
      throw new Error('No images provided for batch OCR processing');
    }

    const results = [];
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      console.log(`Processing image ${i + 1}/${imageFiles.length}: ${file.name}`);
      
      try {
        const result = await extractText(file);
        results.push({
          ...result,
          filename: file.name,
          index: i
        });
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          filename: file.name,
          index: i,
          text: '',
          confidence: 0
        });
      }
    }

    return results;
  }, [extractText]);

  /**
   * Validates OCR result quality and suggests improvements
   * Helps users understand if better image quality is needed
   * @param {Object} ocrResult - Result from extractText function
   * @returns {Object} Validation result with suggestions
   */
  const validateOCRQuality = useCallback((ocrResult) => {
    if (!ocrResult.success) {
      return {
        isGoodQuality: false,
        issues: ['OCR processing failed'],
        suggestions: ['Try uploading a clearer image', 'Ensure good lighting and contrast']
      };
    }

    const issues = [];
    const suggestions = [];
    
    // Check confidence level
    if (ocrResult.confidence < 50) {
      issues.push('Low confidence in text recognition');
      suggestions.push('Image quality may be poor - try a clearer photo');
    }
    
    // Check if any text was extracted
    if (!ocrResult.text || ocrResult.text.length < 3) {
      issues.push('Very little or no text detected');
      suggestions.push('Ensure the image contains visible text or equations');
    }
    
    // Check for mathematical symbols
    const hasMathSymbols = /[+\-*/=()^√∫∑]/.test(ocrResult.text);
    if (!hasMathSymbols && ocrResult.text.length > 10) {
      suggestions.push('No mathematical symbols detected - verify this is a math problem');
    }

    return {
      isGoodQuality: issues.length === 0 && ocrResult.confidence > 70,
      confidence: ocrResult.confidence,
      issues,
      suggestions,
      textLength: ocrResult.text.length,
      hasMathContent: hasMathSymbols
    };
  }, []);

  /**
   * Terminates the OCR worker to free up resources
   * Should be called when component unmounts or OCR is no longer needed
   */
  const terminateWorker = useCallback(async () => {
    if (worker) {
      try {
        await worker.terminate();
        setWorker(null);
        console.log('🔧 Tesseract worker terminated');
      } catch (error) {
        console.error('⚠️ Error terminating worker:', error);
      }
    }
  }, [worker]);

  return {
    // State
    isProcessing,
    progress,
    
    // Functions
    extractText,
    extractTextFromMultiple,
    validateOCRQuality,
    terminateWorker,
    
    // Status
    isWorkerReady: worker !== null
  };
};

export default useOCR;
