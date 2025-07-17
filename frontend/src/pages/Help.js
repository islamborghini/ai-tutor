import React, { useState } from 'react';

/**
 * Help Page Component
 * Provides frequently asked questions and help documentation
 */
function Help() {
  const [openFAQ, setOpenFAQ] = useState(null);

  /**
   * Toggles FAQ item open/closed state
   * @param {number} index - Index of the FAQ item
   */
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I upload a problem image?",
      answer: "Navigate to the Home page and click on the 'Choose File' button in the Upload Problem section. Select an image file (JPG, PNG, GIF) that contains your problem. The file size should be under 5MB for optimal processing."
    },
    {
      question: "What types of problems can AI Tutor solve?",
      answer: "AI Tutor can help with a wide range of mathematical problems including algebra, calculus, geometry, statistics, and more. It can also assist with physics problems, chemistry equations, and basic programming questions."
    },
    {
      question: "How long does it take to get a solution?",
      answer: "Most problems are processed within 30-60 seconds. Complex problems or high-resolution images may take slightly longer. You'll see a loading indicator while your problem is being processed."
    },
    {
      question: "Can I get step-by-step explanations?",
      answer: "Yes! AI Tutor provides detailed step-by-step solutions for most problems. After uploading your problem, click 'Solve Problem' to get a comprehensive breakdown of the solution process."
    },
    {
      question: "What are explanatory videos?",
      answer: "Explanatory videos are custom-generated video tutorials that walk through the solution process. Click 'Generate Video' after solving a problem to create a personalized video explanation."
    },
    {
      question: "Is my data secure and private?",
      answer: "Yes, we take privacy seriously. Uploaded images are processed securely and are not stored permanently on our servers. All data transmission is encrypted, and we don't share your information with third parties."
    },
    {
      question: "What image formats are supported?",
      answer: "We support JPG, JPEG, PNG, and GIF image formats. For best results, ensure your image is clear, well-lit, and the text/equations are easily readable."
    },
    {
      question: "Can I use AI Tutor on mobile devices?",
      answer: "Yes! AI Tutor is fully responsive and works on smartphones, tablets, and desktop computers. The interface adapts to your device size for optimal usability."
    },
    {
      question: "What if the AI doesn't understand my problem?",
      answer: "If the AI has trouble understanding your problem, try taking a clearer photo with better lighting, or break complex problems into smaller parts. You can also contact our support team for assistance."
    },
    {
      question: "Is there a limit to how many problems I can solve?",
      answer: "Currently, there are no limits on the number of problems you can solve. However, we may implement fair usage policies in the future to ensure good service for all users."
    }
  ];

  const guides = [
    {
      title: "Getting Started",
      description: "Learn the basics of using AI Tutor",
      steps: [
        "Visit the Home page",
        "Upload an image of your problem",
        "Click 'Upload' to process the image",
        "Use 'Solve Problem' for step-by-step solutions",
        "Generate explanatory videos for complex topics"
      ]
    },
    {
      title: "Best Practices for Image Upload",
      description: "Tips for getting the best results",
      steps: [
        "Ensure good lighting when taking photos",
        "Keep the camera steady to avoid blur",
        "Crop images to focus on the problem",
        "Use high contrast between text and background",
        "Avoid shadows or reflections on the paper"
      ]
    },
    {
      title: "Troubleshooting Common Issues",
      description: "Solutions to common problems",
      steps: [
        "If upload fails, check your internet connection",
        "Ensure image file size is under 5MB",
        "Try a different image format if needed",
        "Refresh the page if buttons become unresponsive",
        "Contact support if problems persist"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Help & Support</h1>
            <p className="text-lg text-gray-600">
              Find answers to common questions and learn how to use AI Tutor effectively
            </p>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quick Start Guide</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {guides.map((guide, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{guide.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                  <ol className="space-y-1">
                    {guide.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-sm text-gray-600 flex items-start">
                        <span className="text-orange-600 font-bold mr-2 text-xs">{stepIndex + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        openFAQ === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Still Need Help?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Contact Support</h3>
                <p className="text-gray-600 mb-4">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> support@ai-tutor.com
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Response Time:</span> Within 24 hours
                  </p>
                </div>
                <a
                  href="/contact"
                  className="inline-block mt-4 bg-orange-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Contact Us
                </a>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">API Services - Operational</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">File Upload - Operational</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">Video Generation - Operational</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">Database - Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
