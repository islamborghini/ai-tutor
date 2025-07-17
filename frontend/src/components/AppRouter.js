import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import Landing from '../pages/Landing';
import Tutor from '../pages/Tutor';

// Import layout components
import Header from './Header';

/**
 * App Router Component
 * Manages client-side routing for the AI Tutor application
 * Uses React Router for navigation between pages
 */
const AppRouter = () => {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Fixed header with navigation */}
        <Header />
        
        {/* Main content area with top padding to account for fixed header */}
        <main className="pt-32">
          <Routes>
            {/* Landing page - hero, about, help, contact sections */}
            <Route path="/" element={<Landing />} />
            
            {/* AI Tutor page - main functionality */}
            <Route path="/tutor" element={<Tutor />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default AppRouter;
