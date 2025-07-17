import { useState } from 'react';

/**
 * Custom Hook for AI Tutor API Operations
 * Provides functions for file upload, problem solving, and video generation
 * @returns {Object} API functions and loading state
 */
const useAITutorAPI = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles file upload to the backend server
   * Sends selected image file via FormData to /api/upload endpoint
   * @param {File} file - The file to upload
   * @returns {Object} Response data or error
   */
  const uploadFile = async (file) => {
    if (!file) {
      throw new Error('No file provided');
    }

    setIsLoading(true);

    // Prepare FormData for file upload
    const formData = new FormData();
    formData.append('problem', file); // 'problem' matches backend multer field name

    try {
      // Send POST request to upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // Handle response based on status
      if (response.ok) {
        const result = await response.json();
        
        // Enhanced response includes preprocessing information
        const processingInfo = result.data.preprocessing || {};
        const successMessage = processingInfo.enhanced 
          ? `Success! File uploaded and enhanced for better OCR processing: ${result.data.filename}`
          : `Success! File uploaded: ${result.data.filename}`;
          
        return {
          success: true,
          message: successMessage,
          data: {
            ...result.data,
            // Prefer processed version for OCR, fallback to original
            ocrPath: result.data.processed?.path || result.data.path,
            thumbnailPath: result.data.thumbnail?.path || null,
            enhanced: processingInfo.enhanced || false,
            optimizedForOCR: processingInfo.optimizedForOCR || false
          }
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: `Error: ${error.message}`
        };
      }
    } catch (error) {
      // Handle network or other errors
      return {
        success: false,
        message: `Error: ${error.message}`
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles problem solving request to AI backend
   * Sends a problem to /api/solve endpoint for AI processing
   * @param {string} problem - Problem description
   * @returns {Object} Response data or error
   */
  const solveProblem = async (problem = 'Sample math problem') => {
    setIsLoading(true);

    try {
      // Send problem data to AI solving endpoint
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problem }),
      });

      // Process AI response
      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message: `Solution: ${result.data.solution}`,
          data: result.data
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: `Error: ${error.message}`
        };
      }
    } catch (error) {
      // Handle request errors
      return {
        success: false,
        message: `Error: ${error.message}`
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles video generation request to AI backend
   * Sends content to /api/generate-video endpoint for educational video creation
   * @param {string} content - Content for video generation
   * @returns {Object} Response data or error
   */
  const generateVideo = async (content = 'Sample educational content') => {
    setIsLoading(true);

    try {
      // Send content to video generation endpoint
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      // Process video generation response
      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message: `Video generated: ${result.data.videoPath}`,
          data: result.data
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: `Error: ${error.message}`
        };
      }
    } catch (error) {
      // Handle request errors
      return {
        success: false,
        message: `Error: ${error.message}`
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Creates a problem in the database and retrieves solution steps
   * Integrates file upload with database storage and solution retrieval
   * @param {Object} options - Options object containing files and/or problem text
   * @param {File[]} options.files - Array of uploaded problem image files (optional)
   * @param {string} options.problemText - Problem text (from OCR or manual input)
   * @param {Object} options.classification - Problem classification data
   * @returns {Object} Complete problem with solution steps
   */
  const createAndSolveProblem = async ({ files = [], problemText = '', classification = {} }) => {
    setIsLoading(true);

    try {
      // Validate input - need either files or problem text
      if ((!files || files.length === 0) && !problemText.trim()) {
        throw new Error('No files or problem text provided');
      }

      let uploadResult = null;

      // Step 1: Upload the file if provided
      if (files && files.length > 0) {
        const file = files[0]; // Use first file for now
        uploadResult = await uploadFile(file);
        if (!uploadResult.success) {
          return uploadResult;
        }
      }

      // Step 2: Prepare problem data
      const problemData = {
        input: {
          // Include image data if file was uploaded
          ...(uploadResult && {
            originalImage: {
              url: uploadResult.data.path,
              filename: uploadResult.data.filename,
              size: uploadResult.data.size
            }
          }),
          // Include text input (from OCR or manual entry)
          textInput: {
            rawText: problemText,
            processedText: problemText.trim(),
            confidence: uploadResult ? 80 : 100, // Higher confidence for manual input
            extractionMethod: uploadResult ? 'tesseract-js' : 'manual',
            extractedAt: new Date().toISOString(),
            metadata: {
              wordCount: problemText.trim().split(/\s+/).length,
              hasMatheticalContent: /[+\-=<>()[\]{}^√∫∑π]/.test(problemText),
              qualityScore: problemText.trim().length > 10 ? 'good' : 'poor'
            }
          },
          classification: {
            problemType: classification.problemType || 'algebra',
            gradeLevel: classification.gradeLevel || 'high-school',
            difficulty: classification.difficulty || 'medium'
          }
        }
      };

      // Step 3: Create problem in database
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(problemData),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message: uploadResult 
            ? 'Problem created with image and text!' 
            : 'Problem created from text input!',
          data: result.data.problem
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: `Database error: ${error.message}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error.message}`
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Retrieves problems from the database with filtering options
   * @param {Object} filters - Filtering options (problemType, gradeLevel, etc.)
   * @returns {Object} Array of problems with pagination
   */
  const getProblems = async (filters = {}) => {
    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/problems?${queryParams}`);

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message: `Found ${result.data.problems.length} problems`,
          data: result.data
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: `Error: ${error.message}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error.message}`
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gets a specific problem by ID with full solution steps
   * @param {string} problemId - The problem ID to retrieve
   * @returns {Object} Complete problem with solution steps
   */
  const getProblemById = async (problemId) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/problems/${problemId}`);

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message: 'Problem retrieved successfully',
          data: result.data.problem
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: `Error: ${error.message}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error.message}`
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    uploadFile,
    solveProblem,
    generateVideo,
    createAndSolveProblem,
    getProblems,
    getProblemById
  };
};

export default useAITutorAPI;
