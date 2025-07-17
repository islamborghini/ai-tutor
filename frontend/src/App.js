import React from 'react';

// Import the main router component
import AppRouter from './components/AppRouter';

/**
 * Main AI Tutor Application Component
 * Entry point that renders the router and handles all page navigation
 */
function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
