import React from 'react';

/**
 * SolutionDisplay Component
 * Displays AI-generated solutions, videos, and processing states
 * Replaces the basic StatusDisplay with comprehensive solution rendering
 * 
 * @param {Object} solution - Solution data from AI processing
 * @param {string} solution.type - Type of content ('solution', 'video', 'loading', 'error')
 * @param {string} solution.content - Main content to display
 * @param {string} solution.title - Title for the solution
 * @param {Array} solution.steps - Step-by-step solution breakdown
 * @param {string} solution.videoUrl - URL for generated video
 * @param {number} solution.confidence - AI confidence score (0-1)
 * @param {number} solution.processingTime - Time taken to process (ms)
 */
const SolutionDisplay = ({ solution }) => {
  // Don't render if no solution data
  if (!solution) return null;

  /**
   * Renders loading state with spinner
   */
  const renderLoadingState = () => (
    <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-8 border border-white border-opacity-20 shadow-lg">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 bg-opacity-20 rounded-full mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">
          🤖 Processing Your Problem
        </h3>
        <p className="text-white text-opacity-80">
          {solution.content || 'AI is analyzing your problem and generating a solution...'}
        </p>
      </div>
    </div>
  );

  /**
   * Renders error state with helpful message
   */
  const renderErrorState = () => (
    <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-center text-white">
        ❌ Error
      </h3>
      <div className="p-4 rounded-lg border bg-red-500 bg-opacity-20 border-red-400 border-opacity-50 text-red-100">
        <p className="text-center font-medium">
          {solution.content || 'An error occurred while processing your request.'}
        </p>
        <p className="text-center text-sm mt-2 text-red-200">
          Please try again or contact support if the problem persists.
        </p>
      </div>
    </div>
  );

  /**
   * Renders step-by-step solution
   */
  const renderSolutionSteps = () => (
    <div className="space-y-4">
      {solution.steps && solution.steps.length > 0 ? (
        solution.steps.map((step, index) => (
          <div key={index} className="bg-white bg-opacity-10 rounded-lg p-4 border border-white border-opacity-20">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-white leading-relaxed">{step}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white bg-opacity-10 rounded-lg p-4 border border-white border-opacity-20">
          <p className="text-white leading-relaxed">
            {solution.content || 'Solution content will appear here.'}
          </p>
        </div>
      )}
    </div>
  );

  /**
   * Renders solution metadata (confidence, processing time)
   */
  const renderMetadata = () => (
    <div className="flex justify-between items-center text-sm text-white text-opacity-70 mt-4 pt-4 border-t border-white border-opacity-20">
      {solution.confidence !== undefined && (
        <span>
          Confidence: {Math.round(solution.confidence * 100)}%
        </span>
      )}
      {solution.processingTime !== undefined && (
        <span>
          Processed in: {(solution.processingTime / 1000).toFixed(1)}s
        </span>
      )}
    </div>
  );

  /**
   * Renders video player for generated videos
   */
  const renderVideoContent = () => (
    <div className="space-y-4">
      {solution.videoUrl ? (
        <div className="bg-black bg-opacity-30 rounded-lg p-4">
          <video 
            controls 
            className="w-full rounded-lg"
            poster="/api/placeholder/640/360"
          >
            <source src={solution.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center border border-white border-opacity-20">
          <div className="text-4xl mb-2">🎥</div>
          <p className="text-white">
            {solution.content || 'Video is being generated...'}
          </p>
        </div>
      )}
    </div>
  );

  /**
   * Renders main solution content based on type
   */
  const renderSolutionContent = () => (
    <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 shadow-lg">
      <h3 className="text-2xl font-semibold mb-6 text-center text-white">
        {solution.type === 'video' ? '🎥 Generated Video' : '🧮 Solution'}
      </h3>
      
      {solution.title && (
        <h4 className="text-lg font-medium mb-4 text-white text-opacity-90">
          {solution.title}
        </h4>
      )}

      {solution.type === 'video' ? renderVideoContent() : renderSolutionSteps()}
      
      {renderMetadata()}
    </div>
  );

  // Render appropriate content based on solution type
  switch (solution.type) {
    case 'loading':
      return renderLoadingState();
    case 'error':
      return renderErrorState();
    case 'solution':
    case 'video':
      return renderSolutionContent();
    default:
      return renderSolutionContent();
  }
};

export default SolutionDisplay;
