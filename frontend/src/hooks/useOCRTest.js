/**
 * Simple OCR Test Hook - Basic Tesseract.js implementation
 * Handles image text extraction with minimal configuration for debugging
 */

import { useState, useCallback } from 'react';
import { createWorker } from 'tesseract.js';

const useOCRTest = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const processImage = useCallback(async (imageFile) => {
    console.log('🧪 Testing OCR with timeout protection...');
    console.log('Image details:', {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size,
      lastModified: imageFile.lastModified
    });
    
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    let worker = null;
    let timeoutId = null;

    try {
      // Add timeout protection (30 seconds max)
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('OCR processing timed out after 30 seconds'));
        }, 30000);
      });

      console.log('Step 1: Creating worker with timeout protection...');
      setProgress(25);
      
      // Create worker with proper error handling
      const workerPromise = createWorker('eng', 1, {
        logger: m => {
          console.log('Tesseract logger:', m);
          if (m.status === 'recognizing text') {
            const newProgress = 50 + Math.round(m.progress * 40);
            setProgress(newProgress);
          }
        }
      });

      worker = await Promise.race([workerPromise, timeoutPromise]);
      console.log('✅ Worker created successfully');
      setProgress(50);

      console.log('Step 2: Starting recognition with timeout...');
      const recognitionPromise = worker.recognize(imageFile);
      
      const { data } = await Promise.race([recognitionPromise, timeoutPromise]);
      console.log('✅ Recognition complete:', data);
      setProgress(100);

      // Clear timeout since we succeeded
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      const result = {
        extractedText: data.text?.trim() || 'No text detected',
        confidence: Math.round(data.confidence || 0),
        words: (data.words || []).map(word => ({
          text: word.text,
          confidence: Math.round(word.confidence || 0),
          bbox: word.bbox
        })),
        lines: (data.lines || []).map(line => ({
          text: line.text?.trim() || '',
          confidence: Math.round(line.confidence || 0),
          bbox: line.bbox
        })),
        metadata: {
          ocrEngine: 'tesseract-test',
          processedAt: new Date().toISOString(),
          wordsCount: (data.words || []).length,
          linesCount: (data.lines || []).length
        }
      };

      console.log('✅ OCR Success! Final result:', result);
      setResult(result);
      return result;

    } catch (error) {
      // Clear timeout on error
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      console.error('❌ OCR Failed:', error);
      
      setError({
        message: `OCR failed: ${error.message}`,
        details: error.toString(),
        code: 'OCR_ERROR'
      });
      
      // Don't throw to prevent retry loops
      return null;
      
    } finally {
      setIsProcessing(false);
      
      // Clear timeout if still active
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      if (worker) {
        try {
          console.log('🧹 Cleaning up worker...');
          await worker.terminate();
          console.log('✅ Worker terminated');
        } catch (e) {
          console.warn('⚠️ Worker cleanup failed:', e);
        }
      }
    }
  }, []);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  return {
    isProcessing,
    progress,
    error,
    result,
    processImage,
    reset,
    validateResult: () => ({ isValid: true, issues: [], recommendations: [] })
  };
};

export default useOCRTest;
