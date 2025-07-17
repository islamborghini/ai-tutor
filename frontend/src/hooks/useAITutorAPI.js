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
        return {
          success: true,
          message: `Success! File uploaded: ${result.data.filename}`,
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

  return {
    isLoading,
    uploadFile,
    solveProblem,
    generateVideo
  };
};

export default useAITutorAPI;
