import React, { useState } from 'react';

// Import components
import FileUpload from '../components/FileUpload';
import ActionButtons from '../components/ActionButtons';
import SolutionDisplay from '../components/SolutionDisplay';

// Import custom hook
import useAITutorAPI from '../hooks/useAITutorAPI';

/**
 * AI Tutor Page Component
 * Contains the main AI tutor functionality: file upload, problem solving, and video generation
 * This is where users interact with the AI to solve problems
 */
function Tutor() {
  // State management for file and status
  const [selectedFile, setSelectedFile] = useState(null); // Currently selected file for upload
  const [solution, setSolution] = useState(null); // Status messages for user feedback

  // Custom hook for API operations
  const { isLoading, uploadFile, solveProblem, generateVideo } = useAITutorAPI();

  /**
   * Handles file selection from FileUpload component
   * @param {File} file - Selected file
   */
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setSolution(null); // Clear any previous solutions
  };

  /**
   * Handles file upload using the custom hook
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setSolution({ type: 'loading', message: 'Uploading...' });
    const result = await uploadFile(selectedFile);
    setSolution({ type: 'success', message: result.message });
  };

  /**
   * Handles problem solving using the custom hook
   */
  const handleSolveProblem = async () => {
    setSolution({ type: 'loading', message: 'Solving problem...' });
    const result = await solveProblem('Sample math problem');
    
    // Create a solution object with steps
    if (result.success) {
      setSolution({ 
        type: 'solution', 
        title: 'Problem Solution',
        steps: [
          { number: 1, content: result.message },
          { number: 2, content: 'Additional explanation or steps would appear here' }
        ],
        metadata: {
          difficulty: 'Medium',
          timeSpent: '2 minutes',
          subject: 'Mathematics'
        }
      });
    } else {
      setSolution({ type: 'error', message: result.message || 'Failed to solve problem' });
    }
  };

  /**
   * Handles video generation using the custom hook
   */
  const handleGenerateVideo = async () => {
    setSolution({ type: 'loading', message: 'Generating video...' });
    const result = await generateVideo('Sample educational content');
    
    // Create a video solution object
    if (result.success) {
      setSolution({ 
        type: 'video', 
        title: 'Educational Video',
        videoUrl: result.videoUrl || '/sample-video.mp4', // Use actual video URL from result
        description: result.message || 'Generated educational video content',
        metadata: {
          duration: '5 minutes',
          quality: 'HD',
          subject: 'Education'
        }
      });
    } else {
      setSolution({ type: 'error', message: result.message || 'Failed to generate video' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
      {/* Page Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🤖 AI Tutor - Problem Solver
          </h1>
          <p className="text-lg md:text-xl text-white text-opacity-90 font-light max-w-2xl mx-auto">
            Upload your problem images and get instant AI-powered solutions with explanatory videos
          </p>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {/* File upload section */}
          <FileUpload
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onUpload={handleUpload}
            isLoading={isLoading}
          />

          {/* AI action buttons section */}
          <ActionButtons
            onSolveProblem={handleSolveProblem}
            onGenerateVideo={handleGenerateVideo}
            isLoading={isLoading}
          />

          {/* Solution display section */}
          <SolutionDisplay solution={solution} />
        </main>
      </div>
    </div>
  );
}

export default Tutor;
