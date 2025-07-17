const sharp = require('sharp');
const path = require('path');

/**
 * Image Validation and Analysis Utilities
 * Provides comprehensive image validation, quality assessment, and optimization recommendations
 * Used before OCR processing to ensure optimal results
 */

/**
 * Supported image formats for OCR processing
 */
const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp', 'avif', 'heif'];

/**
 * Image validation configuration
 */
const VALIDATION_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB max file size
  minWidth: 100,
  maxWidth: 4000,
  minHeight: 100,
  maxHeight: 4000,
  minAspectRatio: 0.1, // Very wide or very tall images
  maxAspectRatio: 10,
  qualityThresholds: {
    excellent: 0.9,
    good: 0.7,
    fair: 0.5,
    poor: 0.3
  }
};

/**
 * Validates basic file properties (size, format, etc.)
 * @param {Object} file - Multer file object or file-like object
 * @returns {Object} Validation result with issues and recommendations
 */
const validateFileProperties = (file) => {
  const issues = [];
  const recommendations = [];
  
  // Check file size
  if (file.size > VALIDATION_CONFIG.maxFileSize) {
    issues.push('File size too large');
    recommendations.push(`Reduce file size to under ${VALIDATION_CONFIG.maxFileSize / 1024 / 1024}MB`);
  }
  
  if (file.size < 1024) { // Less than 1KB is suspicious
    issues.push('File size too small');
    recommendations.push('Ensure the image file is not corrupted');
  }
  
  // Check file format
  const fileExtension = path.extname(file.originalname || file.name || '').toLowerCase().slice(1);
  if (!SUPPORTED_FORMATS.includes(fileExtension)) {
    issues.push(`Unsupported format: ${fileExtension}`);
    recommendations.push(`Use one of: ${SUPPORTED_FORMATS.join(', ')}`);
  }
  
  // Check MIME type if available
  if (file.mimetype && !file.mimetype.startsWith('image/')) {
    issues.push('File is not an image');
    recommendations.push('Upload a valid image file');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    recommendations,
    fileSize: file.size,
    format: fileExtension
  };
};

/**
 * Analyzes image dimensions and quality using Sharp
 * @param {Buffer} imageBuffer - Image buffer data
 * @returns {Object} Detailed image analysis
 */
const analyzeImageQuality = async (imageBuffer) => {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    const stats = await sharp(imageBuffer).stats();
    
    const issues = [];
    const recommendations = [];
    
    // Dimension validation
    if (metadata.width < VALIDATION_CONFIG.minWidth || metadata.height < VALIDATION_CONFIG.minHeight) {
      issues.push('Image resolution too low');
      recommendations.push(`Minimum resolution: ${VALIDATION_CONFIG.minWidth}x${VALIDATION_CONFIG.minHeight}`);
    }
    
    if (metadata.width > VALIDATION_CONFIG.maxWidth || metadata.height > VALIDATION_CONFIG.maxHeight) {
      issues.push('Image resolution too high');
      recommendations.push(`Maximum resolution: ${VALIDATION_CONFIG.maxWidth}x${VALIDATION_CONFIG.maxHeight}`);
    }
    
    // Aspect ratio check
    const aspectRatio = metadata.width / metadata.height;
    if (aspectRatio < VALIDATION_CONFIG.minAspectRatio || aspectRatio > VALIDATION_CONFIG.maxAspectRatio) {
      issues.push('Unusual aspect ratio');
      recommendations.push('Use images with normal width/height proportions');
    }
    
    // Quality assessment based on image statistics
    const channels = stats.channels;
    let qualityScore = 0;
    
    if (channels && channels.length > 0) {
      // Calculate quality based on contrast and sharpness indicators
      const avgStdDev = channels.reduce((sum, channel) => sum + channel.std, 0) / channels.length;
      const avgMean = channels.reduce((sum, channel) => sum + channel.mean, 0) / channels.length;
      
      // Higher standard deviation indicates better contrast
      const contrastScore = Math.min(avgStdDev / 64, 1); // Normalize to 0-1
      
      // Avoid very dark or very bright images
      const brightnessScore = 1 - Math.abs(avgMean - 128) / 128;
      
      qualityScore = (contrastScore * 0.7) + (brightnessScore * 0.3);
    }
    
    // Quality recommendations
    if (qualityScore < VALIDATION_CONFIG.qualityThresholds.fair) {
      issues.push('Poor image quality detected');
      recommendations.push('Try improving lighting and focus');
    }
    
    // Check for transparency (PNG with alpha channel)
    const hasTransparency = metadata.channels === 4 && metadata.format === 'png';
    if (hasTransparency) {
      recommendations.push('Consider using JPG format for better OCR results');
    }
    
    return {
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        channels: metadata.channels,
        hasAlpha: metadata.hasAlpha,
        density: metadata.density
      },
      quality: {
        score: qualityScore,
        level: getQualityLevel(qualityScore),
        contrast: channels ? channels[0]?.std / 64 : 0,
        brightness: channels ? channels[0]?.mean / 255 : 0
      },
      analysis: {
        aspectRatio,
        isValid: issues.length === 0,
        issues,
        recommendations
      }
    };
    
  } catch (error) {
    return {
      metadata: null,
      quality: { score: 0, level: 'unknown' },
      analysis: {
        isValid: false,
        issues: ['Failed to analyze image'],
        recommendations: ['Ensure the file is a valid image'],
        error: error.message
      }
    };
  }
};

/**
 * Determines quality level based on score
 * @param {number} score - Quality score (0-1)
 * @returns {string} Quality level
 */
const getQualityLevel = (score) => {
  if (score >= VALIDATION_CONFIG.qualityThresholds.excellent) return 'excellent';
  if (score >= VALIDATION_CONFIG.qualityThresholds.good) return 'good';
  if (score >= VALIDATION_CONFIG.qualityThresholds.fair) return 'fair';
  if (score >= VALIDATION_CONFIG.qualityThresholds.poor) return 'poor';
  return 'very poor';
};

/**
 * Detects if image likely contains mathematical content
 * @param {Buffer} imageBuffer - Image buffer data
 * @returns {Object} Math content detection result
 */
const detectMathContent = async (imageBuffer) => {
  try {
    // This is a placeholder for more advanced detection
    // Could be enhanced with ML models or pattern recognition
    const metadata = await sharp(imageBuffer).metadata();
    
    // Basic heuristics for math content
    const hasGoodAspectRatio = metadata.width / metadata.height > 0.5 && metadata.width / metadata.height < 3;
    const hasReasonableSize = metadata.width >= 200 && metadata.height >= 100;
    
    return {
      likelyMathContent: hasGoodAspectRatio && hasReasonableSize,
      confidence: hasGoodAspectRatio && hasReasonableSize ? 0.7 : 0.3,
      indicators: {
        aspectRatio: metadata.width / metadata.height,
        size: `${metadata.width}x${metadata.height}`
      }
    };
  } catch (error) {
    return {
      likelyMathContent: false,
      confidence: 0,
      error: error.message
    };
  }
};

/**
 * Comprehensive image validation combining all checks
 * @param {Object} file - Multer file object
 * @param {Buffer} imageBuffer - Image buffer data
 * @returns {Object} Complete validation result
 */
const validateImage = async (file, imageBuffer) => {
  console.log('🔍 Starting comprehensive image validation...');
  
  // Basic file validation
  const fileValidation = validateFileProperties(file);
  
  // Skip quality analysis if basic validation fails
  if (!fileValidation.isValid) {
    return {
      isValid: false,
      fileValidation,
      qualityAnalysis: null,
      mathContent: null,
      overallRecommendation: 'Fix file issues before processing'
    };
  }
  
  // Quality and content analysis
  const [qualityAnalysis, mathContent] = await Promise.all([
    analyzeImageQuality(imageBuffer),
    detectMathContent(imageBuffer)
  ]);
  
  // Combine all validation results
  const allIssues = [
    ...fileValidation.issues,
    ...(qualityAnalysis.analysis?.issues || [])
  ];
  
  const allRecommendations = [
    ...fileValidation.recommendations,
    ...(qualityAnalysis.analysis?.recommendations || [])
  ];
  
  // Overall assessment
  const isValid = allIssues.length === 0;
  const needsFallback = qualityAnalysis.quality?.score < VALIDATION_CONFIG.qualityThresholds.fair;
  
  let overallRecommendation = 'Image is ready for OCR processing';
  if (needsFallback) {
    overallRecommendation = 'Image quality is poor - will use enhanced OCR processing';
  }
  if (!isValid) {
    overallRecommendation = 'Please fix the identified issues before processing';
  }
  
  console.log(`✅ Image validation complete: ${isValid ? 'Valid' : 'Issues found'}`);
  
  return {
    isValid,
    needsFallback,
    fileValidation,
    qualityAnalysis,
    mathContent,
    summary: {
      issues: allIssues,
      recommendations: allRecommendations,
      overallRecommendation
    }
  };
};

module.exports = {
  validateFileProperties,
  analyzeImageQuality,
  detectMathContent,
  validateImage,
  VALIDATION_CONFIG,
  SUPPORTED_FORMATS
};
