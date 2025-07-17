import React from 'react';

/**
 * FileUpload Component
 * Handles file selection, display, and upload functionality
 * @param {File|null} selectedFile - Currently selected file
 * @param {function} onFileSelect - Callback when file is selected
 * @param {function} onUpload - Callback when upload button is clicked
 * @param {boolean} isLoading - Loading state for upload button
 */
const FileUpload = ({ selectedFile, onFileSelect, onUpload, isLoading }) => {
  /**
   * Handles file selection from input field
   * Validates that selected file is an image format
   * @param {Event} event - File input change event
   */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type - only allow image files
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      } else {
        alert('Please select an image file (JPG, PNG, GIF, etc.)');
      }
    }
  };

  return (
    <div className="upload-section">
      <h2>📁 Upload Problem Image</h2>
      {/* File input with image validation */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="file-input"
      />
      {/* Display selected file information */}
      {selectedFile && (
        <p className="file-info">
          Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
        </p>
      )}
      {/* Upload button - disabled if no file selected or loading */}
      <button
        onClick={onUpload}
        disabled={!selectedFile || isLoading}
        className="action-button upload-button"
      >
        {isLoading ? '⏳ Uploading...' : '📤 Upload'}
      </button>
    </div>
  );
};

export default FileUpload;
