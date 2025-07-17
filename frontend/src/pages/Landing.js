import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Landing Page Component
 * Single page with Hero, About, Help, and Contact sections
 * Contains call-to-action button to navigate to AI Tutor functionality
 */
function Landing() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);

  /**
   * Handles form input changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handles form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      answer: "Navigate to the AI Tutor and click on the 'Choose File' button. Select an image file (JPG, PNG, GIF) that contains your problem. The file size should be under 5MB for optimal processing."
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
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white flex items-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            🤖 AI Tutor
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Upload a problem image and get AI-powered step-by-step solutions with explanatory videos
          </p>
          <p className="text-lg mb-12 max-w-2xl mx-auto opacity-90">
            Perfect for middle school and high school students seeking instant help with math, physics, and chemistry problems
          </p>
          <Link
            to="/tutor"
            className="inline-block bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
          >
            Start Tutoring Now →
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">About AI Tutor</h2>
              <p className="text-lg text-gray-600">
                Learn more about our AI-powered educational platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  AI Tutor is designed to revolutionize the way students learn by providing 
                  instant, AI-powered solutions to mathematical and educational problems. 
                  Our platform combines cutting-edge artificial intelligence with intuitive 
                  user experience to make learning more accessible and effective.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h3>
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
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Features</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Image Recognition</h4>
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
                  <h4 className="font-semibold text-gray-800 mb-2">Smart Solutions</h4>
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
                  <h4 className="font-semibold text-gray-800 mb-2">Video Tutorials</h4>
                  <p className="text-gray-600 text-sm">
                    Personalized video explanations for complex topics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section id="help" className="py-20 bg-gradient-to-br from-yellow-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Help & Support</h2>
              <p className="text-lg text-gray-600">
                Find answers to common questions and learn how to use AI Tutor effectively
              </p>
            </div>

            {/* Quick Start Guide */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Quick Start Guide</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Getting Started</h4>
                  <p className="text-gray-600 text-sm mb-4">Learn the basics of using AI Tutor</p>
                  <ol className="space-y-2">
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">1.</span>
                      <span>Click "Start Tutoring Now"</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">2.</span>
                      <span>Upload an image of your problem</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">3.</span>
                      <span>Click 'Upload' to process the image</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">4.</span>
                      <span>Use 'Solve Problem' for solutions</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">5.</span>
                      <span>Generate explanatory videos</span>
                    </li>
                  </ol>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Best Practices</h4>
                  <p className="text-gray-600 text-sm mb-4">Tips for getting the best results</p>
                  <ol className="space-y-2">
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">1.</span>
                      <span>Ensure good lighting when taking photos</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">2.</span>
                      <span>Keep the camera steady to avoid blur</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">3.</span>
                      <span>Crop images to focus on the problem</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">4.</span>
                      <span>Use high contrast backgrounds</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">5.</span>
                      <span>Avoid shadows or reflections</span>
                    </li>
                  </ol>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Troubleshooting</h4>
                  <p className="text-gray-600 text-sm mb-4">Solutions to common problems</p>
                  <ol className="space-y-2">
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">1.</span>
                      <span>Check internet connection if upload fails</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">2.</span>
                      <span>Ensure image file size is under 5MB</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">3.</span>
                      <span>Try a different image format if needed</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">4.</span>
                      <span>Refresh the page if unresponsive</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-600 font-bold mr-2 text-xs">5.</span>
                      <span>Contact support if problems persist</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Frequently Asked Questions</h3>
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
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-green-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-lg text-gray-600">
                Get in touch with our team - we're here to help!
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-8">Get in Touch</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Email</h4>
                      <p className="text-gray-600">support@ai-tutor.com</p>
                      <p className="text-gray-600">info@ai-tutor.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Phone</h4>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-gray-600">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Response Time</h4>
                      <p className="text-gray-600">Within 24 hours</p>
                      <p className="text-gray-600">Emergency: Within 2 hours</p>
                    </div>
                  </div>
                </div>

                {/* System Status */}
                <div className="pt-8 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4">System Status</h4>
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
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-8">Send us a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                      placeholder="Tell us more details..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>

                  {submitStatus && (
                    <div className={`p-4 rounded-lg ${submitStatus.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {submitStatus}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
