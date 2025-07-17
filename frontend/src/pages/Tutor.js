import React, { useState } from 'react';

// Import components
import FileUpload from '../components/FileUpload';
import ActionButtons from '../components/ActionButtons';
import StatusDisplay from '../components/StatusDisplay';

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
  const [uploadStatus, setUploadStatus] = useState(''); // Status messages for user feedback

  // Custom hook for API operations
  const { isLoading, uploadFile, solveProblem, generateVideo } = useAITutorAPI();

  /**
   * Handles file selection from FileUpload component
   * @param {File} file - Selected file
   */
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadStatus(''); // Clear any previous status messages
  };

  /**
   * Handles file upload using the custom hook
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setUploadStatus('Uploading...');
    const result = await uploadFile(selectedFile);
    setUploadStatus(result.message);
  };

  /**
   * Handles problem solving using the custom hook
   */
  const handleSolveProblem = async () => {
    setUploadStatus('Solving problem...');
    const result = await solveProblem('Sample math problem');
    setUploadStatus(result.message);
  };

  /**
   * Handles video generation using the custom hook
   */
  const handleGenerateVideo = async () => {
    setUploadStatus('Generating video...');
    const result = await generateVideo('Sample educational content');
    setUploadStatus(result.message);
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

          {/* Status display section */}
          <StatusDisplay status={uploadStatus} />
        </main>
      </div>
    </div>
  );
}

export default Tutor;
