import React from 'react';

/**
 * ActionButtons Component
 * Contains AI action buttons for problem solving and video generation
 * @param {function} onSolveProblem - Callback when solve problem button is clicked
 * @param {function} onGenerateVideo - Callback when generate video button is clicked
 * @param {boolean} isLoading - Loading state for action buttons
 */
const ActionButtons = ({ onSolveProblem, onGenerateVideo, isLoading }) => {
  return (
    <div className="actions-section">
      <h2>🧠 AI Actions</h2>
      <div className="button-group">
        {/* Problem solving button */}
        <button
          onClick={onSolveProblem}
          disabled={isLoading}
          className="action-button solve-button"
        >
          {isLoading ? '⏳ Processing...' : '🔍 Solve Problem'}
        </button>
        {/* Video generation button */}
        <button
          onClick={onGenerateVideo}
          disabled={isLoading}
          className="action-button video-button"
        >
          {isLoading ? '⏳ Generating...' : '🎥 Generate Video'}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
