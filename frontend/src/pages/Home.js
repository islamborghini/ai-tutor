import React, { useState } from 'react';

// Import components
import FileUpload from '../components/FileUpload';
import ActionButtons from '../components/ActionButtons';
import StatusDisplay from '../components/StatusDisplay';

// Import custom hook
import useAITutorAPI from '../hooks/useAITutorAPI';

/**
 * Home Page Component - Main AI Tutor functionality
 * Contains file upload, problem solving, and video generation features
 */
function Home() {
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
    const result = await solveProblem();
    setUploadStatus(result.message);
  };

  /**
   * Handles video generation using the custom hook
   */
  const handleGenerateVideo = async () => {
    setUploadStatus('Generating video...');
    const result = await generateVideo();
    setUploadStatus(result.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI Tutor - Problem Solver
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your problem images and get instant AI-powered solutions with explanatory videos
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* File Upload Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Problem</h2>
              <FileUpload onFileSelect={handleFileSelect} />
            </div>

            {/* Actions Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Actions</h2>
              <ActionButtons
                onUpload={handleUpload}
                onSolveProblem={handleSolveProblem}
                onGenerateVideo={handleGenerateVideo}
                isLoading={isLoading}
                hasFile={selectedFile !== null}
              />
            </div>
          </div>

          {/* Status Display */}
          <div className="mt-8">
            <StatusDisplay status={uploadStatus} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
