import React from 'react';

/**
 * ActionButtons Component
 * Contains AI action buttons for problem solving and video generation
 * @param {function} onSolveProblem - Callback when solve problem button is clicked
 * @param {function} onGenerateVideo - Callback when generate video button is clicked
 * @param {boolean} isLoading - Loading state for action buttons
 * @param {boolean} hasContent - Whether there is content (file or text) to solve
 * @param {boolean} hasSolution - Whether a solution is available for video generation
 */
const ActionButtons = ({ onSolveProblem, onGenerateVideo, isLoading, hasContent = false, hasSolution = false }) => {
  return (
    <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white border-opacity-20 shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">
        🧠 AI Actions
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {/* Problem solving button */}
        <button
          onClick={onSolveProblem}
          disabled={isLoading || !hasContent}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none transition-all duration-300 min-w-[180px] w-full sm:w-auto"
        >
          {isLoading ? '⏳ Processing...' : '🔍 Solve Problem'}
        </button>
        
        {/* Video generation button */}
        <button
          onClick={onGenerateVideo}
          disabled={isLoading || !hasSolution}
          className="bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-gray-800 font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none transition-all duration-300 min-w-[180px] w-full sm:w-auto"
        >
          {isLoading ? '⏳ Generating...' : '🎥 Generate Video'}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
