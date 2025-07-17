import React from 'react';

/**
 * StatusDisplay Component
 * Shows status messages and feedback to the user
 * @param {string} status - Status message to display
 */
const StatusDisplay = ({ status }) => {
  // Don't render if no status message
  if (!status) return null;

  return (
    <div className="status-section">
      <h3>📊 Status</h3>
      {/* Dynamic styling based on success/error status */}
      <p className={status.includes('Error') ? 'error' : 'success'}>
        {status}
      </p>
    </div>
  );
};

export default StatusDisplay;
