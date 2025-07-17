/**
 * Custom hook for mathematical problem classification
 * Provides functions to classify problems and manage classification data
 */

import { useState, useCallback } from 'react';

/**
 * Hook for classification operations
 * @returns {Object} Classification state and functions
 */
const useClassification = () => {
  const [isClassifying, setIsClassifying] = useState(false);
  const [classification, setClassification] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  /**
   * Classify a single problem text
   * @param {string} problemText - The text to classify
   * @param {Object} metadata - Optional metadata
   * @returns {Promise<Object>} Classification result
   */
  const classifyProblem = useCallback(async (problemText, metadata = {}) => {
    if (!problemText) {
      throw new Error('Problem text is required');
    }

    setIsClassifying(true);
    setError(null);

    try {
      const response = await fetch('/api/classification/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemText,
          metadata
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Classification failed');
      }

      const result = await response.json();
      
      if (result.success) {
        setClassification(result.data.classification);
        return result.data.classification;
      } else {
        throw new Error(result.error || 'Classification failed');
      }

    } catch (err) {
      const errorMessage = err.message || 'Classification request failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsClassifying(false);
    }
  }, []);

  /**
   * Classify multiple problems at once
   * @param {Array<string>} problems - Array of problem texts
   * @returns {Promise<Array>} Array of classification results
   */
  const classifyBatch = useCallback(async (problems) => {
    if (!Array.isArray(problems) || problems.length === 0) {
      throw new Error('Problems array is required');
    }

    if (problems.length > 50) {
      throw new Error('Maximum 50 problems allowed per batch');
    }

    setIsClassifying(true);
    setError(null);

    try {
      const response = await fetch('/api/classification/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problems
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Batch classification failed');
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Batch classification failed');
      }

    } catch (err) {
      const errorMessage = err.message || 'Batch classification request failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsClassifying(false);
    }
  }, []);

  /**
   * Submit feedback for a classification
   * @param {string} problemId - Problem ID
   * @param {Object} feedback - Feedback data
   * @returns {Promise<Object>} Update result
   */
  const submitFeedback = useCallback(async (problemId, feedback) => {
    if (!problemId || !feedback) {
      throw new Error('Problem ID and feedback are required');
    }

    setIsClassifying(true);
    setError(null);

    try {
      const response = await fetch(`/api/classification/${problemId}/feedback`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Feedback submission failed');
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Feedback submission failed');
      }

    } catch (err) {
      const errorMessage = err.message || 'Feedback submission failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsClassifying(false);
    }
  }, []);

  /**
   * Get classification statistics
   * @returns {Promise<Object>} Statistics data
   */
  const getStats = useCallback(async () => {
    setIsClassifying(true);
    setError(null);

    try {
      const response = await fetch('/api/classification/stats');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch statistics');
      }

      const result = await response.json();
      
      if (result.success) {
        setStats(result.data.stats);
        return result.data.stats;
      } else {
        throw new Error(result.error || 'Failed to fetch statistics');
      }

    } catch (err) {
      const errorMessage = err.message || 'Statistics request failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsClassifying(false);
    }
  }, []);

  /**
   * Get available subject information
   * @returns {Promise<Object>} Subjects data
   */
  const getSubjects = useCallback(async () => {
    try {
      const response = await fetch('/api/classification/subjects');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch subjects');
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data.subjects;
      } else {
        throw new Error(result.error || 'Failed to fetch subjects');
      }

    } catch (err) {
      const errorMessage = err.message || 'Subjects request failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Reset classification state
   */
  const reset = useCallback(() => {
    setClassification(null);
    setError(null);
    setStats(null);
    setIsClassifying(false);
  }, []);

  /**
   * Get human-readable labels for classification data
   */
  const getClassificationLabels = useCallback((classificationData) => {
    if (!classificationData) return {};

    const subjectLabels = {
      algebra: 'Algebra',
      geometry: 'Geometry',
      calculus: 'Calculus',
      trigonometry: 'Trigonometry',
      statistics: 'Statistics',
      arithmetic: 'Arithmetic'
    };

    const gradeLevelLabels = {
      middleSchool: 'Middle School (6-8)',
      highSchool: 'High School (9-12)',
      college: 'College Level',
      unknown: 'Unknown'
    };

    const difficultyLabels = {
      1: 'Very Easy',
      2: 'Easy',
      3: 'Easy-Medium',
      4: 'Medium',
      5: 'Medium',
      6: 'Medium-Hard',
      7: 'Hard',
      8: 'Hard',
      9: 'Very Hard',
      10: 'Expert'
    };

    return {
      subject: subjectLabels[classificationData.primarySubject] || classificationData.primarySubject,
      gradeLevel: gradeLevelLabels[classificationData.gradeLevel?.level] || 'Unknown',
      difficulty: difficultyLabels[classificationData.difficulty] || `Level ${classificationData.difficulty}`,
      confidence: `${classificationData.confidence}%`
    };
  }, []);

  return {
    // State
    isClassifying,
    classification,
    error,
    stats,

    // Actions
    classifyProblem,
    classifyBatch,
    submitFeedback,
    getStats,
    getSubjects,
    reset,
    getClassificationLabels
  };
};

export default useClassification;
