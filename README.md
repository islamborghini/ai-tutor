# 🤖 AI Math Tutor Platform

An intelligent mathematics tutoring platform that helps middle and high school students solve math problems through image uploads, text input, and AI-generated step-by-step solutions with Khan Academy-style whiteboard videos.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Current Features](#current-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Future Plans](#future-plans)

## 🎯 Project Overview

This platform provides an AI-powered learning environment where students can:
- Upload math problem images or enter problems as text
- Receive automatic problem classification (subject, difficulty, grade level)
- Get AI-generated step-by-step solutions
- View interactive educational videos
- Track their learning progress

**Target Audience**: Middle school (grades 6-8) and high school (grades 9-12) students

## ✅ Current Features

### Backend (Node.js + Express + MongoDB)

#### 🔧 Core Functionality
- **File Upload System**: Image upload with validation, processing, and thumbnail generation using Multer and Sharp
- **Image Processing**: Automatic image optimization, thumbnail creation, and format conversion
- **Problem Classification**: Advanced AI-powered classification system that analyzes mathematical problems to determine:
  - Subject area (algebra, geometry, calculus, trigonometry, statistics, arithmetic)
  - Difficulty level (1-10 scale)
  - Grade level (middle school vs high school)
  - Complexity metrics and learning indicators
- **Database Integration**: Complete MongoDB integration with Mongoose ODM
- **Error Handling**: Comprehensive global error handling with structured logging
- **Request Logging**: HTTP request logging with Winston and Morgan

#### 📊 Problem Management
- **CRUD Operations**: Full create, read, update, delete operations for problems
- **Advanced Filtering**: Filter problems by type, grade level, difficulty, and status
- **Pagination**: Efficient pagination for large datasets
- **Soft Deletes**: Data preservation through soft delete implementation
- **Analytics Integration**: Built-in analytics tracking for user engagement

#### 🤖 AI Classification Service
- **Intelligent Analysis**: Advanced pattern matching for mathematical concepts
- **Subject Detection**: Recognizes 6 major mathematical subject areas
- **Difficulty Assessment**: Multi-factor difficulty scoring algorithm
- **Grade Level Detection**: Automatic grade level classification based on complexity
- **Feedback Learning**: Classification improvement through user feedback
- **Batch Processing**: Bulk classification for multiple problems
- **Statistical Analysis**: Classification statistics and insights

### Frontend (React + Tailwind CSS)

#### 🖥️ User Interface
- **Modern Design**: Clean, responsive interface built with React and Tailwind CSS
- **Router Integration**: Client-side routing with React Router
- **Component Architecture**: Modular component structure for maintainability
- **File Upload Interface**: Drag-and-drop file upload with React Dropzone
- **Real-time Feedback**: Loading states and error handling throughout the UI

#### 🔗 API Integration
- **Custom Hooks**: Reusable hooks for API interactions (`useAITutorAPI`, `useClassification`)
- **Error Handling**: Comprehensive frontend error handling and user feedback
- **State Management**: Efficient state management with React hooks
- **Responsive Design**: Mobile-first responsive design approach

#### 📱 Pages & Components
- **Landing Page**: Hero section with platform introduction
- **Tutor Interface**: Main problem-solving interface
- **Navigation**: Header with navigation and routing
- **File Upload**: Advanced file upload component with validation
- **Classification Display**: Visual representation of problem classification
- **Solution Display**: Structured display for step-by-step solutions

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Processing**: Multer, Sharp (image processing)
- **Logging**: Winston, Morgan
- **Error Handling**: Custom error handling middleware

### Frontend
- **Framework**: React.js (functional components with hooks)
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **File Upload**: React Dropzone
- **HTTP Client**: Fetch API

### Planned Integrations
- **AI Services**: Hugging Face Transformers (primary), OpenAI GPT-3.5-turbo (fallback)
- **OCR**: Tesseract.js (client-side), Google Vision API (fallback)
- **Storage**: Cloudinary (production file storage)
- **TTS**: Web Speech API, Google Text-to-Speech
- **Deployment**: Vercel (frontend), Railway (backend)

## 📁 Project Structure

```
ai-tutor/
├── backend/
│   ├── index.js                    # Main server file
│   ├── middleware/
│   │   └── errorHandler.js         # Global error handling
│   ├── models/
│   │   ├── index.js                # Model exports
│   │   ├── Problem.js              # Problem schema
│   │   └── User.js                 # User schema
│   ├── routes/
│   │   ├── classificationRoutes.js # Classification API endpoints
│   │   ├── mathRoutes.js           # Math processing routes
│   │   └── ocrRoutes.js            # OCR processing routes
│   ├── services/
│   │   ├── classificationService.js # AI classification logic
│   │   └── ocrService.js           # OCR processing service
│   ├── utils/
│   │   ├── imageProcessor.js       # Image processing utilities
│   │   ├── imageValidator.js       # Image validation
│   │   └── logger.js               # Logging configuration
│   └── docs/
│       ├── mongodb-setup.md        # Database setup guide
│       └── schema-documentation.md # Schema documentation
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppRouter.js        # Client-side routing
│   │   │   ├── Header.js           # Navigation header
│   │   │   ├── FileUpload.js       # File upload interface
│   │   │   ├── ClassificationDisplay.js # Problem classification UI
│   │   │   └── SolutionDisplay.js  # Solution presentation
│   │   ├── hooks/
│   │   │   ├── useAITutorAPI.js    # API integration hook
│   │   │   └── useClassification.js # Classification hook
│   │   ├── pages/
│   │   │   ├── Landing.js          # Landing page
│   │   │   └── Tutor.js            # Main tutor interface
│   │   └── App.js                  # Main app component
│   └── public/                     # Static assets
└── README.md                       # This file
```

## 🌐 API Endpoints

### File Management
- `POST /api/upload` - Upload and process problem images
- `GET /` - Health check endpoint

### Problem Management
- `POST /api/problems` - Create new problem with full metadata
- `GET /api/problems` - List problems with filtering and pagination
- `GET /api/problems/:id` - Get specific problem by ID
- `PUT /api/problems/:id` - Update problem information
- `DELETE /api/problems/:id` - Soft delete problem

### Classification System
- `POST /api/classification/analyze` - Classify individual problems
- `POST /api/classification/batch` - Batch classify multiple problems
- `PUT /api/classification/:problemId/feedback` - Submit classification feedback
- `GET /api/classification/stats` - Get classification statistics
- `GET /api/classification/subjects` - Get available subject categories

### Planned Endpoints
- `POST /api/solve` - AI-powered problem solving
- `POST /api/generate-video` - Generate educational videos
- `POST /api/auth/*` - User authentication
- `GET /api/users/*` - User management

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-tutor/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - The application will connect to `mongodb://localhost:27017/ai-tutor`

4. **Start the server**
   ```bash
   npm start
   # Server runs on http://localhost:3001
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   # Application runs on http://localhost:3000
   # Automatically proxies API calls to backend on port 3001
   ```

## 📱 Usage

1. **Access the Application**
   - Open your browser to `http://localhost:3000`
   - Navigate to the "Tutor" section

2. **Upload a Math Problem**
   - Use the file upload interface to select an image
   - Or type a math problem directly in the text area

3. **View Classification**
   - The system automatically classifies problems by subject, difficulty, and grade level
   - View detailed classification metrics and confidence scores

4. **Manage Problems**
   - Browse previously uploaded problems
   - Filter by subject, difficulty, or grade level
   - Update or delete existing problems

## 💾 Database Schema

### Problem Schema
- **Input Data**: Original image, processed images, classification metadata
- **Solution**: Step-by-step solutions, AI processing details
- **Media**: Generated videos, thumbnails, audio files
- **Analytics**: View counts, user ratings, completion rates
- **Metadata**: Status tracking, creation dates, soft delete support

### User Schema (Implemented)
- **Profile**: Personal information, preferences, learning goals
- **Authentication**: Secure login system with JWT support
- **Account Management**: Usage limits, subscription tiers
- **Learning Progress**: Tracked progress, achievements, statistics

## 🚀 Future Plans

### Phase 1: Core AI Integration
- **OCR Implementation**: Tesseract.js integration for text extraction from images
- **AI Problem Solving**: OpenAI GPT-3.5-turbo integration for step-by-step solutions
- **Math Expression Parsing**: LaTeX/KaTeX support for mathematical notation
- **Solution Verification**: Accuracy checking for generated solutions

### Phase 2: Video Generation
- **Canvas Recording**: MediaRecorder API for whiteboard-style videos
- **Text-to-Speech**: Web Speech API and Google TTS integration
- **Animation System**: Step-by-step visual problem solving
- **Video Management**: Compression, storage, and streaming optimization

### Phase 3: User Experience
- **User Authentication**: Complete JWT-based auth system
- **Progress Tracking**: Personal learning analytics and achievements
- **Adaptive Learning**: Difficulty adjustment based on performance
- **Mobile Optimization**: Enhanced mobile interface and camera integration

### Phase 4: Advanced Features
- **Practice Problems**: Generated practice problems based on user progress
- **Collaborative Learning**: Study groups and problem sharing
- **Teacher Dashboard**: Classroom management and student progress tracking
- **Performance Analytics**: Detailed learning insights and recommendations

### Phase 5: Production & Scale 
- **Cloud Deployment**: Production deployment on Vercel and Railway
- **Performance Optimization**: Caching, CDN integration, database optimization
- **Security Hardening**: Rate limiting, input sanitization, security audits
- **Monitoring & Analytics**: Error tracking, performance monitoring, user analytics

## 📖 Development Guidelines

### Code Quality Standards
- **ESLint & Prettier**: Automated code formatting and linting
- **Documentation**: Comprehensive JSDoc comments for all functions
- **Error Handling**: Structured error handling with proper logging
- **Testing**: Unit and integration testing (planned)
- **Security**: Input validation, secure headers, and proper authentication

### Architecture Principles
- **Separation of Concerns**: Clear separation between frontend and backend
- **Modularity**: Reusable components and services
- **Scalability**: Database indexing and efficient queries
- **Maintainability**: Clean code with proper documentation
- **Cost Optimization**: Prioritizing free/freemium services where possible

### Performance Considerations
- **Image Optimization**: Automatic image compression and format conversion
- **Database Optimization**: Strategic indexing and efficient queries
- **Caching Strategy**: Redis caching for frequently accessed data
- **API Rate Limiting**: Protection against abuse and resource overuse

**Built with ❤️ for mathematics education**

*This project aims to make mathematics more accessible and engaging for students through AI-powered tutoring and interactive learning experiences.*
