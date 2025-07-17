import React from 'react';

/**
 * About Page Component
 * Provides information about the AI Tutor application
 */
function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">About AI Tutor</h1>
            <p className="text-lg text-gray-600">
              Learn more about our AI-powered educational platform
            </p>
          </div>

          {/* Content Sections */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                AI Tutor is designed to revolutionize the way students learn by providing 
                instant, AI-powered solutions to mathematical and educational problems. 
                Our platform combines cutting-edge artificial intelligence with intuitive 
                user experience to make learning more accessible and effective.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-600 font-bold mr-2">1.</span>
                  Upload an image of your problem or question
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 font-bold mr-2">2.</span>
                  Our AI analyzes and understands the content
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 font-bold mr-2">3.</span>
                  Get detailed step-by-step solutions
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 font-bold mr-2">4.</span>
                  Watch explanatory videos for better understanding
                </li>
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Image Recognition</h3>
                <p className="text-gray-600 text-sm">
                  Advanced AI to understand handwritten and printed problems
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Smart Solutions</h3>
                <p className="text-gray-600 text-sm">
                  Step-by-step explanations with detailed reasoning
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Video Tutorials</h3>
                <p className="text-gray-600 text-sm">
                  Personalized video explanations for complex topics
                </p>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Frontend</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• React.js for interactive user interface</li>
                  <li>• Tailwind CSS for modern styling</li>
                  <li>• React Router for navigation</li>
                  <li>• Custom hooks for state management</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Backend</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Node.js with Express.js framework</li>
                  <li>• MongoDB for data storage</li>
                  <li>• Multer for file handling</li>
                  <li>• Winston for comprehensive logging</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
