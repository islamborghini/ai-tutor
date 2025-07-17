import React from 'react';

/**
 * StatusDisplay Component
 * Shows status messages and feedback to the user
 * @param {string} status - Status message to display
 */
const StatusDisplay = ({ status }) => {
  // Don't render if no status message
  if (!status) return null;

  // Determine if it's an error or success message
  const isError = status.includes('Error');

  return (
    <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-center text-white">
        📊 Status
      </h3>
      
      {/* Dynamic styling based on success/error status */}
      <div className={`p-4 rounded-lg border ${
        isError 
          ? 'bg-red-500 bg-opacity-20 border-red-400 border-opacity-50 text-red-100' 
          : 'bg-green-500 bg-opacity-20 border-green-400 border-opacity-50 text-green-100'
      }`}>
        <p className="text-center font-medium">
          {status}
        </p>
      </div>
    </div>
  );
};

export default StatusDisplay;
