import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import useOCR from '../hooks/useOCR';

/**
 * FileUpload Component with OCR Integration
 * Handles file selection, OCR processing, and upload functionality
 * Features: Drag & drop, image validation, real-time OCR text extraction
 * @param {File|null} selectedFile - Currently selected file
 * @param {function} onFileSelect - Callback when file is selected
 * @param {function} onUpload - Callback when upload button is clicked
 * @param {boolean} isLoading - Loading state for upload button
 * @param {function} onOCRResult - Callback when OCR processing completes
 */
const FileUpload = ({ selectedFile, onFileSelect, onUpload, isLoading, onOCRResult }) => {
  const [ocrResult, setOcrResult] = useState(null);
  const [showOCRPreview, setShowOCRPreview] = useState(false);
  const { extractText, isProcessing: isOCRProcessing, progress: ocrProgress, validateOCRQuality, terminateWorker } = useOCR();

  /**
   * Cleanup OCR worker on component unmount
   */
  useEffect(() => {
    return () => {
      terminateWorker();
    };
  }, [terminateWorker]);

  /**
   * Process OCR when a new file is selected
   */
  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      processOCR(selectedFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]); // processOCR function is stable, safe to exclude

  /**
   * Performs OCR processing on the selected image
   * @param {File} imageFile - Image file to process
   */
  const processOCR = async (imageFile) => {
    try {
      console.log('🔍 Starting OCR processing for:', imageFile.name);
      const result = await extractText(imageFile);
      
      // Validate OCR quality
      const quality = validateOCRQuality(result);
      
      const finalResult = {
        ...result,
        quality,
        filename: imageFile.name
      };
      
      setOcrResult(finalResult);
      
      // Notify parent component of OCR result
      if (onOCRResult) {
        onOCRResult(finalResult);
      }
      
      // Show preview if text was extracted successfully
      if (result.success && result.text.length > 0) {
        setShowOCRPreview(true);
      }
      
    } catch (error) {
      console.error('OCR processing error:', error);
      const errorResult = {
        success: false,
        error: error.message,
        text: '',
        confidence: 0
      };
      setOcrResult(errorResult);
      if (onOCRResult) {
        onOCRResult(errorResult);
      }
    }
  };
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

      {/* OCR Processing Status */}
      {selectedFile && selectedFile.type.startsWith('image/') && (
        <div className="mb-4">
          {isOCRProcessing ? (
            <div className="p-4 bg-blue-500 bg-opacity-10 rounded-lg border border-blue-400 border-opacity-30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-200 font-medium">🔍 Extracting text from image...</span>
                <span className="text-blue-200 text-sm">{ocrProgress}%</span>
              </div>
              <div className="w-full bg-blue-900 bg-opacity-30 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${ocrProgress}%` }}
                ></div>
              </div>
            </div>
          ) : ocrResult && (
            <div className="space-y-3">
              {/* OCR Success/Error Status */}
              {ocrResult.success ? (
                <div className="p-3 bg-green-500 bg-opacity-10 rounded-lg border border-green-400 border-opacity-30">
                  <div className="flex items-center justify-between">
                    <span className="text-green-200 font-medium">
                      ✅ Text extracted successfully
                    </span>
                    <span className="text-green-200 text-sm">
                      {ocrResult.confidence?.toFixed(1)}% confidence
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-red-500 bg-opacity-10 rounded-lg border border-red-400 border-opacity-30">
                  <span className="text-red-200 font-medium">
                    ❌ OCR failed: {ocrResult.error}
                  </span>
                </div>
              )}

              {/* Extracted Text Preview */}
              {ocrResult.success && ocrResult.text && showOCRPreview && (
                <div className="p-4 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">📝 Extracted Text:</span>
                    <button
                      onClick={() => setShowOCRPreview(false)}
                      className="text-white text-opacity-60 hover:text-opacity-80 text-sm"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="bg-gray-800 bg-opacity-50 rounded p-3 max-h-32 overflow-y-auto">
                    <p className="text-white text-sm font-mono whitespace-pre-wrap">
                      {ocrResult.text || 'No text detected'}
                    </p>
                  </div>
                  
                  {/* Quality Indicators */}
                  {ocrResult.quality && (
                    <div className="mt-2 text-xs">
                      {ocrResult.quality.isGoodQuality ? (
                        <span className="text-green-300">✅ Good quality text extraction</span>
                      ) : (
                        <div className="text-yellow-300">
                          <span>⚠️ Quality issues detected:</span>
                          <ul className="ml-4 mt-1">
                            {ocrResult.quality.suggestions.map((suggestion, index) => (
                              <li key={index}>• {suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Show extracted text button if hidden */}
              {ocrResult.success && ocrResult.text && !showOCRPreview && (
                <button
                  onClick={() => setShowOCRPreview(true)}
                  className="text-blue-300 hover:text-blue-200 text-sm underline"
                >
                  📝 Show extracted text ({ocrResult.text.length} characters)
                </button>
              )}
            </div>
          )}
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
