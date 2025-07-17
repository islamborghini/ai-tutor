import React, { useState, useRef } from 'react';

// Import components
import FileUpload from '../components/FileUpload';
import ActionButtons from '../components/ActionButtons';
import SolutionDisplay from '../components/SolutionDisplay';
import MathKeyboard from '../components/MathKeyboard';

// Import custom hook
import useAITutorAPI from '../hooks/useAITutorAPI';

/**
 * AI Tutor Page Component
 * Contains the main AI tutor functionality: file upload, problem solving, and video generation
 * This is where users interact with the AI to solve problems
 */
function Tutor() {
  // State management for file and status
  const [selectedFile, setSelectedFile] = useState(null); // Currently selected file for upload
  const [solution, setSolution] = useState(null); // Status messages for user feedback
  const [existingProblems, setExistingProblems] = useState([]); // Existing problems from database
  const [ocrResult, setOcrResult] = useState(null); // OCR extraction result
  const [problemText, setProblemText] = useState(''); // Editable problem text

  // Ref for the problem input textarea
  const problemInputRef = useRef(null);

  // Custom hook for API operations
  const { 
    isLoading, 
    uploadFile, 
    generateVideo, 
    createAndSolveProblem,
    getProblems
  } = useAITutorAPI();

  // Load existing problems on component mount
  React.useEffect(() => {
    let isMounted = true; // Cleanup flag to prevent state updates on unmounted component
    
    const loadProblems = async () => {
      try {
        const result = await getProblems({ limit: 5 });
        // Only update state if component is still mounted
        if (isMounted && result.success) {
          setExistingProblems(result.data.problems);
        }
      } catch (error) {
        console.error('Failed to load existing problems:', error);
      }
    };
    
    loadProblems();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount to prevent infinite re-renders

  /**
   * Handles file selection from FileUpload component
   * @param {File} file - Selected file
   */
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setSolution(null); // Clear any previous solutions
    setOcrResult(null); // Clear any previous OCR results
    setProblemText(''); // Clear problem text when new file is selected
  };

  /**
   * Handles OCR completion from FileUpload component
   * @param {Object} result - OCR processing result
   */
  const handleOCRComplete = (result) => {
    setOcrResult(result);
    setProblemText(result.extractedText || ''); // Populate textarea with OCR result
    console.log('OCR completed:', result);
  };

  /**
   * Handles file upload using the custom hook
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setSolution({ type: 'loading', message: 'Uploading...' });
    const result = await uploadFile(selectedFile);
    setSolution({ type: 'success', message: result.message });
  };

  /**
   * Handles problem solving using the database integration
   */
  const handleSolveProblem = async () => {
    // Check if we have either a file or problem text
    if (!selectedFile && !problemText.trim()) {
      alert('Please upload an image or enter a problem text first');
      return;
    }

    setSolution({ type: 'loading', message: 'Analyzing and solving problem...' });
    
    try {
      // Pass both file and text to the API
      const problemData = await createAndSolveProblem({ 
        files: selectedFile ? [selectedFile] : [], 
        problemText: problemText.trim()
      });
      
      // Convert database problem to solution format
      if (problemData.success && problemData.data) {
        const problem = problemData.data;
        setSolution({ 
          type: 'solution', 
          title: problem.metadata.title || 'Problem Solution',
          steps: problem.solution.steps.map((step) => 
            step.description || step.content || 'Solution step'
          ),
          metadata: {
            difficulty: problem.metadata.difficulty,
            timeSpent: problem.analytics.timeToSolve || 'N/A',
            subject: problem.metadata.subject,
            approach: problem.solution.approach
          }
        });

        // Refresh existing problems list
        const updatedProblems = await getProblems({ limit: 5 });
        if (updatedProblems.success) {
          setExistingProblems(updatedProblems.data.problems);
        }
      } else {
        setSolution({ type: 'error', message: problemData.message || 'Failed to solve problem' });
      }
    } catch (error) {
      setSolution({ type: 'error', message: error.message || 'Failed to solve problem' });
    }
  };

  /**
   * Handles video generation using the custom hook
   */
  const handleGenerateVideo = async () => {
    setSolution({ type: 'loading', message: 'Generating video...' });
    const result = await generateVideo('Sample educational content');
    
    // Create a video solution object
    if (result.success) {
      setSolution({ 
        type: 'video', 
        title: 'Educational Video',
        videoUrl: result.videoUrl || '/sample-video.mp4', // Use actual video URL from result
        description: result.message || 'Generated educational video content',
        metadata: {
          duration: '5 minutes',
          quality: 'HD',
          subject: 'Education'
        }
      });
    } else {
      setSolution({ type: 'error', message: result.message || 'Failed to generate video' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
      {/* Page Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🤖 AI Tutor - Problem Solver
          </h1>
          <p className="text-lg md:text-xl text-white text-opacity-90 font-light max-w-2xl mx-auto">
            Upload your problem images and get instant AI-powered solutions with explanatory videos
          </p>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {/* Existing Problems Section */}
          {existingProblems.length > 0 && (
            <div className="mb-8 p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4">📚 Recent Problems</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {existingProblems.map((problem) => (
                  <div 
                    key={problem._id} 
                    className="p-4 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-colors cursor-pointer"
                    onClick={() => {
                      setSolution({
                        type: 'solution',
                        title: problem.metadata.title || 'Saved Problem',
                        steps: problem.solution.steps.map((step) => 
                          step.description || step.content || 'Solution step'
                        ),
                        metadata: {
                          difficulty: problem.metadata.difficulty,
                          subject: problem.metadata.subject,
                          approach: problem.solution.approach,
                          savedAt: new Date(problem.createdAt).toLocaleDateString()
                        }
                      });
                    }}
                  >
                    <h3 className="font-medium text-lg mb-2">
                      {problem.metadata.title || `Problem ${problem._id.slice(-6)}`}
                    </h3>
                    <div className="text-sm text-white text-opacity-70">
                      <span className="mr-4">📊 {problem.metadata.difficulty}</span>
                      <span className="mr-4">📖 {problem.metadata.subject}</span>
                      <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File upload section */}
          <FileUpload
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onUpload={handleUpload}
            onOCRComplete={handleOCRComplete}
            isLoading={isLoading}
            enableOCR={true}
          />

          {/* Problem Text Input and Mathematical Keyboard Section */}
          <div className="mb-8 p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm border border-white border-opacity-20">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              ✏️ Enter or Edit Your Problem
            </h2>
            <p className="text-white text-opacity-80 text-sm mb-4">
              Use the keyboard below to enter mathematical expressions, or edit the text extracted from your image.
            </p>
            
            {/* Problem input textarea */}
            <div className="mb-6">
              <textarea
                ref={problemInputRef}
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder="e.g., Solve for x: 2x + 5 = 15, or enter any mathematical problem..."
                className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-none text-gray-800"
                rows="4"
              />
              {problemText && (
                <div className="mt-2 text-white text-opacity-70 text-sm">
                  Character count: {problemText.length}
                </div>
              )}
            </div>
            
            {/* Mathematical Keyboard */}
            <MathKeyboard 
              targetRef={problemInputRef}
              onInsert={(symbol) => {
                const textarea = problemInputRef.current;
                if (!textarea) return;
                
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newText = problemText.substring(0, start) + symbol + problemText.substring(end);
                setProblemText(newText);
                
                // Focus and set cursor position after insert
                setTimeout(() => {
                  textarea.focus();
                  textarea.selectionStart = textarea.selectionEnd = start + symbol.length;
                }, 0);
              }}
            />
          </div>

          {/* AI action buttons section */}
          <ActionButtons
            onSolveProblem={handleSolveProblem}
            onGenerateVideo={handleGenerateVideo}
            isLoading={isLoading}
            hasContent={!!selectedFile || !!problemText.trim()}
            hasSolution={solution && solution.type === 'solution'}
          />

          {/* Solution display section */}
          <SolutionDisplay solution={solution} />
        </main>
      </div>
    </div>
  );
}

export default Tutor;
