import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Header Component
 * Fixed header with navigation menu and application branding
 * Handles both landing page anchor navigation and route navigation
 */
const Header = () => {
  const location = useLocation();

  /**
   * Navigation menu items configuration
   * For landing page (/), use anchor links to sections
   * For other pages, use regular route links
   */
  const navItems = [
    { path: '/', label: 'Home', anchor: '#hero' },
    { path: '/', label: 'About', anchor: '#about' },
    { path: '/', label: 'Help', anchor: '#help' },
    { path: '/', label: 'Contact', anchor: '#contact' }
  ];

  /**
   * Handles navigation click - either route change or anchor scroll
   * @param {string} path - The route path
   * @param {string} anchor - The anchor hash (for landing page sections)
   */
  const handleNavClick = (path, anchor) => {
    if (location.pathname === '/' && anchor) {
      // If we're on landing page, scroll to anchor
      const element = document.querySelector(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'auto' });
      }
    }
    // If not on landing page, Link component will handle navigation
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Main header content */}
        <div className="flex flex-col items-center py-4">
          {/* Logo and title */}
          <div className="text-center mb-4">
            <Link to="/" className="block">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                🤖 AI Tutor
              </h1>
              <p className="text-sm md:text-base text-gray-600 font-light max-w-2xl mx-auto">
                Upload a problem image and get AI-powered solutions and explanations
              </p>
            </Link>
          </div>

          {/* Navigation menu */}
          <nav className="w-full">
            <ul className="flex justify-center space-x-8">
              {navItems.map((item) => (
                <li key={item.label}>
                  {location.pathname === '/' ? (
                    // On landing page, use anchor links
                    <a
                      href={item.anchor}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.path, item.anchor);
                      }}
                      className="text-sm font-medium px-3 py-2 rounded-md transition-colors text-gray-700 hover:text-blue-600"
                    >
                      {item.label}
                    </a>
                  ) : (
                    // On other pages, use route links to go back to landing page
                    <Link
                      to={item.path + item.anchor}
                      className="text-sm font-medium px-3 py-2 rounded-md transition-colors text-gray-700 hover:text-blue-600"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
