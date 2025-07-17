/**
 * Image Preprocessing Utility for AI Tutor
 * Enhances uploaded images for better OCR and AI processing
 * Features: Resize, contrast enhancement, noise reduction, format normalization
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const logger = require('./logger');

/**
 * Image Preprocessing Configuration
 * Optimized settings for mathematical content OCR
 */
const PROCESSING_CONFIG = {
  // Resize settings - optimal for OCR processing
  resize: {
    width: 2000,
    height: null, // Maintain aspect ratio
    fit: 'inside',
    withoutEnlargement: true
  },
  
  // Enhancement settings for better text recognition
  enhance: {
    brightness: 1.1,
    contrast: 1.3,
    saturation: 0.8, // Reduce color saturation for better text focus
    gamma: 1.1
  },
  
  // Noise reduction and sharpening
  filter: {
    blur: 0.3, // Light blur to reduce noise
    sharpen: 1.5 // Sharpen to enhance text edges
  },
  
  // Output format settings
  output: {
    format: 'png',
    quality: 95,
    compressionLevel: 6
  }
};

/**
 * Processes an uploaded image to enhance OCR accuracy
 * Creates both original and processed versions
 * 
 * @param {string} inputPath - Path to the original uploaded image
 * @param {string} filename - Original filename for processed version naming
 * @returns {Object} Processing result with paths and metadata
 */
async function processImage(inputPath, filename) {
  try {
    logger.info(`🖼️  Starting image preprocessing: ${filename}`);
    
    // Generate processed filename
    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext);
    const processedFilename = `${baseName}_processed.png`;
    const processedPath = path.join(path.dirname(inputPath), processedFilename);
    
    // Get original image metadata
    const originalMetadata = await sharp(inputPath).metadata();
    logger.info(`📊 Original image: ${originalMetadata.width}x${originalMetadata.height}, format: ${originalMetadata.format}`);
    
    // Create processing pipeline
    let pipeline = sharp(inputPath);
    
    // Step 1: Resize for optimal OCR processing
    if (originalMetadata.width > PROCESSING_CONFIG.resize.width) {
      pipeline = pipeline.resize(PROCESSING_CONFIG.resize);
      logger.info(`📏 Resizing to max width: ${PROCESSING_CONFIG.resize.width}px`);
    }
    
    // Step 2: Convert to grayscale for better text recognition
    pipeline = pipeline.grayscale();
    
    // Step 3: Enhance contrast and brightness
    pipeline = pipeline.modulate({
      brightness: PROCESSING_CONFIG.enhance.brightness,
      saturation: PROCESSING_CONFIG.enhance.saturation
    }).gamma(PROCESSING_CONFIG.enhance.gamma);
    
    // Step 4: Apply light blur to reduce noise
    pipeline = pipeline.blur(PROCESSING_CONFIG.filter.blur);
    
    // Step 5: Sharpen to enhance text edges
    pipeline = pipeline.sharpen({
      sigma: PROCESSING_CONFIG.filter.sharpen,
      flat: 1.0,
      jagged: 2.0
    });
    
    // Step 6: Normalize contrast
    pipeline = pipeline.normalize();
    
    // Step 7: Output as high-quality PNG
    pipeline = pipeline.png({
      quality: PROCESSING_CONFIG.output.quality,
      compressionLevel: PROCESSING_CONFIG.output.compressionLevel
    });
    
    // Execute processing pipeline
    const processedBuffer = await pipeline.toBuffer();
    await fs.writeFile(processedPath, processedBuffer);
    
    // Get processed image metadata
    const processedMetadata = await sharp(processedPath).metadata();
    
    logger.info(`✅ Image preprocessing completed successfully`);
    logger.info(`📊 Processed image: ${processedMetadata.width}x${processedMetadata.height}, size: ${(processedBuffer.length / 1024).toFixed(1)}KB`);
    
    return {
      success: true,
      original: {
        path: inputPath,
        filename: filename,
        size: originalMetadata.size || 0,
        width: originalMetadata.width,
        height: originalMetadata.height,
        format: originalMetadata.format
      },
      processed: {
        path: processedPath,
        filename: processedFilename,
        size: processedBuffer.length,
        width: processedMetadata.width,
        height: processedMetadata.height,
        format: 'png'
      },
      enhancement: {
        resized: originalMetadata.width > PROCESSING_CONFIG.resize.width,
        contrastEnhanced: true,
        noiseReduced: true,
        optimizedForOCR: true
      }
    };
    
  } catch (error) {
    logger.error(`❌ Image preprocessing failed: ${error.message}`);
    
    // Return original image info as fallback
    try {
      const originalMetadata = await sharp(inputPath).metadata();
      return {
        success: false,
        error: error.message,
        original: {
          path: inputPath,
          filename: filename,
          size: originalMetadata.size || 0,
          width: originalMetadata.width,
          height: originalMetadata.height,
          format: originalMetadata.format
        },
        processed: null,
        fallbackToOriginal: true
      };
    } catch (fallbackError) {
      logger.error(`❌ Failed to get original image metadata: ${fallbackError.message}`);
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }
}

/**
 * Validates if an image file is suitable for processing
 * Checks format, size, and dimensions
 * 
 * @param {string} filePath - Path to the image file
 * @returns {Object} Validation result
 */
async function validateImage(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    
    const validation = {
      isValid: true,
      issues: [],
      metadata: metadata
    };
    
    // Check supported formats
    const supportedFormats = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'bmp', 'tiff'];
    if (!supportedFormats.includes(metadata.format.toLowerCase())) {
      validation.isValid = false;
      validation.issues.push(`Unsupported format: ${metadata.format}`);
    }
    
    // Check minimum dimensions (too small for OCR)
    if (metadata.width < 100 || metadata.height < 100) {
      validation.isValid = false;
      validation.issues.push(`Image too small: ${metadata.width}x${metadata.height} (minimum 100x100)`);
    }
    
    // Check maximum dimensions (might cause memory issues)
    if (metadata.width > 10000 || metadata.height > 10000) {
      validation.isValid = false;
      validation.issues.push(`Image too large: ${metadata.width}x${metadata.height} (maximum 10000x10000)`);
    }
    
    return validation;
    
  } catch (error) {
    return {
      isValid: false,
      issues: [`Failed to read image: ${error.message}`],
      metadata: null
    };
  }
}

/**
 * Creates thumbnails for preview purposes
 * Generates small preview images for UI display
 * 
 * @param {string} inputPath - Path to the original image
 * @param {string} filename - Original filename
 * @returns {Object} Thumbnail creation result
 */
async function createThumbnail(inputPath, filename) {
  try {
    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext);
    const thumbnailFilename = `${baseName}_thumb.jpg`;
    const thumbnailPath = path.join(path.dirname(inputPath), thumbnailFilename);
    
    await sharp(inputPath)
      .resize(300, 300, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);
    
    logger.info(`📸 Thumbnail created: ${thumbnailFilename}`);
    
    return {
      success: true,
      path: thumbnailPath,
      filename: thumbnailFilename
    };
    
  } catch (error) {
    logger.error(`❌ Thumbnail creation failed: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  processImage,
  validateImage,
  createThumbnail,
  PROCESSING_CONFIG
};
