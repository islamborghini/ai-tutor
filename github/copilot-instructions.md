# Copilot Instructions

## Project Overview
This is a math AI tutor platform where students upload math problems via photo or text input, receive AI-generated step-by-step solutions, and learn through interactive Khan Academy-style whiteboard videos. Target audience: middle school and high school students.

## Stack & Architecture
- **Backend**: Node.js + Express.js + MongoDB
- **Frontend**: React.js + Tailwind CSS
- **AI**: Hugging Face Transformers + OpenAI GPT-3.5-turbo (fallback)
- **OCR**: Tesseract.js (primary) + Google Vision API (fallback)
- **TTS**: Web Speech API + Google Text-to-Speech
- **Storage**: Cloudinary (files) + MongoDB Atlas (data)
- **Deployment**: Vercel (frontend) + Railway (backend)

## Core Rules

### Always Do
- PRIORITIZE READABLE AND MAINTAINABLE CODE OVER SIMPLE IMPLEMENTATION
- Explain what you will do and how you will do it in details before implementing
- Always ask something before implementing
- Never do something I did not ask you to implement (no extra functionality)
- Never alter or delete a working parts of the code without permission
- Write readable comments and docstrings for me to understand what is going on in the project
- Use async/await for all asynchronous operations
- Implement proper error handling with try-catch blocks
- Use environment variables for all API keys and secrets
- Validate all user inputs before processing
- Use JWT for authentication on protected routes
- Implement rate limiting on API endpoints
- Use Mongoose schemas with proper validation
- Cache AI responses to minimize API usage costs
- Implement proper loading states and error messages in UI
- Use KaTeX for mathematical notation rendering
- Prioritize free/freemium services to minimize costs

### Never Do
- Use callbacks instead of async/await
- Hardcode API keys or secrets in source code
- Trust client-side validation alone
- Store sensitive data without encryption
- Use class components in React (use functional components with hooks)
- Skip input validation on API endpoints
- Store files in local filesystem in production
- Expose internal error details to users
- Use inline styles (use Tailwind CSS classes)
- Process images larger than 5MB without compression

## Backend Patterns

### API Structure
```
/api/auth/* - Authentication endpoints
/api/problems/* - Problem CRUD operations
/api/solutions/* - Solution generation
/api/videos/* - Video generation and streaming
/api/users/* - User management
```

### Response Format
Always return consistent JSON responses with proper HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

### Error Handling
- Use structured error responses
- Log errors with sufficient context
- Provide user-friendly error messages
- Implement global error handlers
- Never expose stack traces to users

### Database
- Use Mongoose ODM with proper schemas
- Implement proper indexing for performance
- Use ObjectId references for relationships
- Implement soft deletes for user data
- Always include timestamps (createdAt, updatedAt)

## Frontend Patterns

### React Components
- Use functional components with hooks only
- Implement proper prop validation
- Use custom hooks for complex logic
- Implement loading and error states
- Use React.memo for performance optimization
- Use useCallback for expensive operations

### State Management
- Use useState for component state
- Use useEffect for side effects with proper cleanup
- Implement proper dependency arrays
- Never mutate state directly
- Use context for global state sparingly

### Styling
- Use Tailwind CSS utility classes exclusively
- Implement responsive design (mobile-first)
- Use consistent spacing and typography
- Implement proper accessibility features
- Use semantic HTML elements

## AI Integration

### API Usage
- Use Hugging Face as primary AI service (free tier)
- Use OpenAI GPT-3.5-turbo as fallback for complex problems
- Implement proper retry logic for failed API calls
- Cache responses to minimize costs
- Validate AI responses before using them
- Include rate limiting for AI endpoints

### OCR Processing
- Use Tesseract.js for client-side OCR processing
- Use Google Vision API only as fallback
- Preprocess images (resize, enhance contrast) before OCR
- Validate OCR results and provide manual correction interface
- Implement proper error handling for failed OCR

### Solution Generation
- Generate step-by-step solutions with clear explanations
- Verify mathematical accuracy before returning solutions
- Support common mathematical notation (fractions, exponents, etc.)
- Provide explanations appropriate for target grade level
- Include visual aids and diagrams when helpful

## Video Generation

### Canvas Recording
- Use MediaRecorder API for canvas recording
- Implement proper video compression
- Provide generation progress feedback
- Cache generated videos to avoid regeneration
- Limit video length to 10 minutes maximum

### Audio Integration
- Use Web Speech API for primary TTS
- Use Google TTS API as fallback
- Synchronize audio with video timeline
- Implement proper audio compression
- Provide volume controls and mute functionality

## File Handling

### Upload Rules
- Use Cloudinary for all file storage
- Implement file size limits (images: 5MB, videos: 50MB)
- Validate file types before upload
- Generate unique filenames to avoid conflicts
- Implement file cleanup for failed uploads
- Optimize images before storage

### Security
- Validate and sanitize all file inputs
- Implement proper CORS configuration
- Use secure HTTP headers (helmet.js)
- Log security-related events
- Implement proper session management

## Performance

### Optimization
- Use Redis caching for frequently accessed data
- Implement pagination for large datasets
- Use lazy loading for images and videos
- Compress responses with gzip
- Optimize database queries with proper indexing
- Use CDN for static assets

### Monitoring
- Implement proper health checks
- Use structured logging with appropriate levels
- Monitor API response times and error rates
- Track user engagement and learning progress
- Implement proper alerting for system issues

## Testing

### Requirements
- Write unit tests for utility functions
- Implement integration tests for API endpoints
- Test error scenarios and edge cases
- Mock external API calls in tests
- Test file upload functionality
- Implement proper test data cleanup

### Coverage
- Maintain minimum 80% code coverage
- Test both success and failure scenarios
- Include performance testing for video generation
- Test cross-browser compatibility
- Implement accessibility testing

## Deployment

### Environment
- Use environment variables for all configuration
- Implement proper health checks
- Use process managers (PM2) for production
- Implement graceful shutdown handling
- Use separate environments for development, staging, and production

### Monitoring
- Implement proper logging and monitoring
- Use error tracking (Sentry or similar)
- Monitor resource usage and performance
- Set up automated alerts for critical issues
- Implement proper backup and disaster recovery

## Security Checklist

### Authentication
- Implement proper JWT token validation
- Use secure password hashing (bcrypt)
- Implement proper session management
- Add rate limiting to prevent abuse
- Implement proper logout functionality

### Data Protection
- Validate and sanitize all inputs
- Use parameterized queries to prevent SQL injection
- Implement proper CORS policies
- Use HTTPS in production
- Encrypt sensitive data at rest

## Mathematical Processing

### Expression Parsing
- Support common mathematical notation
- Handle fractions, exponents, and special symbols
- Validate mathematical expressions before processing
- Provide visual feedback for parsing results
- Implement step-by-step solution verification

### Whiteboard Rendering
- Use KaTeX for mathematical notation
- Implement proper canvas scaling for different devices
- Provide zoom and pan functionality
- Implement proper step highlighting
- Use smooth animations with appropriate timing

## User Experience

### Interface Design
- Design for middle and high school students
- Use clear, simple language in explanations
- Implement intuitive navigation
- Provide helpful error messages
- Include progress indicators for long operations

### Accessibility
- Implement proper keyboard navigation
- Use semantic HTML elements
- Provide alt text for images
- Implement proper color contrast
- Support screen readers

### Mobile Support
- Implement responsive design
- Optimize for touch interactions
- Consider mobile-specific features (camera integration)
- Optimize performance for mobile devices
- Test on various screen sizes

## Code Quality

### Standards
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Implement proper separation of concerns
- Follow consistent code formatting
- Use ESLint and Prettier for code quality

### Organization
- Organize code by feature, not file type
- Use meaningful directory structure
- Implement proper import/export patterns
- Keep components small and focused
- Extract reusable logic into utilities

Remember: The goal is to create an effective learning platform that helps students understand mathematics through interactive, step-by-step solutions while maintaining low operational costs through smart use of free and freemium services.