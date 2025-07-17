import React from 'react';

/**
 * Header Component
 * Displays the main application title and description
 */
const Header = () => {
  return (
    <header className="bg-white bg-opacity-10 backdrop-blur-sm border-b border-white border-opacity-20 py-8 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
          🤖 AI Tutor
        </h1>
        <p className="text-lg md:text-xl text-white text-opacity-90 font-light max-w-2xl mx-auto">
          Upload a problem image and get AI-powered solutions and explanations
        </p>
      </div>
    </header>
  );
};

export default Header;
