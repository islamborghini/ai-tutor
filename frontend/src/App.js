import React, { useState } from 'react';
import './App.css';

// Import components
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ActionButtons from './components/ActionButtons';
import StatusDisplay from './components/StatusDisplay';

// Import custom hook
import useAITutorAPI from './hooks/useAITutorAPI';

/**
 * Main AI Tutor Application Component
 * Orchestrates the interaction between file upload, AI processing, and user feedback
 */
function App() {
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
    <div className="App">
      {/* Header section */}
      <Header />

      <main className="App-main">
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
  );
}

export default App;
