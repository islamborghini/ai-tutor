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
    <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white border-opacity-20 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-white">
        📁 Upload Problem Image
      </h2>
      
      {/* File input with image validation */}
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="w-full p-4 border-2 border-dashed border-white border-opacity-30 rounded-lg bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300"
        />
      </div>
      
      {/* Display selected file information */}
      {selectedFile && (
        <div className="mb-4 p-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20">
          <p className="text-white text-sm">
            <span className="font-semibold">Selected:</span> {selectedFile.name} 
            <span className="text-white text-opacity-70"> ({Math.round(selectedFile.size / 1024)} KB)</span>
          </p>
        </div>
      )}
      
      {/* Upload button - disabled if no file selected or loading */}
      <div className="text-center">
        <button
          onClick={onUpload}
          disabled={!selectedFile || isLoading}
          className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none transition-all duration-300 min-w-[150px]"
        >
          {isLoading ? '⏳ Uploading...' : '📤 Upload'}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
