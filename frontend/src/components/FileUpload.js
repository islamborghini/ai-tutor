import React from 'react';
import { useDropzone } from 'react-dropzone';

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
   * Configure dropzone with file validation
   */
  const onDrop = (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some(error => error.code === 'file-invalid-type')) {
        alert('Please select an image file (JPG, PNG, GIF, etc.)');
      } else if (rejection.errors.some(error => error.code === 'file-too-large')) {
        alert('File size too large. Please select an image under 5MB.');
      } else {
        alert('Invalid file. Please select a valid image file.');
      }
      return;
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileSelect(file);
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB limit
    multiple: false
  });

  // Dynamic styling based on drag state
  const getDropzoneStyles = () => {
    let baseStyles = "w-full p-8 border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer ";
    
    if (isDragAccept) {
      return baseStyles + "border-green-400 bg-green-400 bg-opacity-10 text-green-200";
    } else if (isDragReject) {
      return baseStyles + "border-red-400 bg-red-400 bg-opacity-10 text-red-200";
    } else if (isDragActive) {
      return baseStyles + "border-blue-400 bg-blue-400 bg-opacity-10 text-blue-200";
    } else {
      return baseStyles + "border-white border-opacity-30 bg-white bg-opacity-10 text-white hover:border-opacity-50 hover:bg-opacity-15";
    }
  };

  return (
    <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white border-opacity-20 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-white">
        📁 Upload Problem Image
      </h2>
      
      {/* Dropzone area with drag and drop */}
      <div className="mb-4">
        <div {...getRootProps()} className={getDropzoneStyles()}>
          <input {...getInputProps()} />
          <div className="text-center">
            {isDragActive ? (
              isDragReject ? (
                <>
                  <div className="text-4xl mb-2">❌</div>
                  <p className="text-lg font-semibold">Invalid file type</p>
                  <p className="text-sm opacity-75">Please select an image file</p>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-2">📥</div>
                  <p className="text-lg font-semibold">Drop your image here</p>
                  <p className="text-sm opacity-75">Release to upload</p>
                </>
              )
            ) : (
              <>
                <div className="text-4xl mb-2">📁</div>
                <p className="text-lg font-semibold">Drag & drop an image here</p>
                <p className="text-sm opacity-75 mt-1">or click to browse files</p>
                <p className="text-xs opacity-50 mt-2">Supports: JPG, PNG, GIF, WebP (max 5MB)</p>
              </>
            )}
          </div>
        </div>
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
