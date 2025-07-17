# Problem Schema Documentation

## Overview
The Problem schema is the core data model for the AI Tutor platform, designed to capture the complete lifecycle of mathematical problems from submission to solution generation.

## Schema Structure

### Input Section
Contains all data related to the original problem submission:

- **originalImage**: File metadata (URL, size, dimensions)
- **ocr**: OCR processing results and confidence scores
- **userCorrections**: Manual corrections to OCR output
- **classification**: Problem categorization (type, grade level, difficulty)

### Solution Section
AI-generated solution with step-by-step breakdown:

- **steps**: Array of solution steps with explanations
- **finalAnswer**: Complete answer with notation
- **aiProcessing**: AI model metadata and performance metrics

### Generated Content
Additional resources created for the problem:

- **video**: Educational video with canvas data
- **audio**: Narration and transcript
- **practiceProblems**: Related practice exercises

### Metadata
Analytics and tracking information:

- **analytics**: View counts, ratings, completion rates
- **status**: Processing workflow status
- **learningObjectives**: Educational goals
- **topics**: Subject categorization

### Relationships
Connections to other data:

- **similarProblems**: Related problems
- **userProgress**: Individual learning tracking
- **prerequisites**: Required knowledge

## Key Features

### 1. Comprehensive Input Validation
- File type and size validation
- Grade level and difficulty enums
- Mathematical notation support

### 2. AI Processing Tracking
- Model identification and cost tracking
- Quality scoring and review flags
- Processing time measurement

### 3. Analytics and Learning
- User engagement metrics
- Drop-off point analysis
- Learning objective mapping

### 4. Performance Optimization
- Strategic indexing for common queries
- Compound indexes for complex searches
- Text search capabilities

## API Endpoints

### Create Problem
```javascript
POST /api/problems
{
  "input": {
    "originalImage": {
      "url": "/uploads/problem.jpg",
      "filename": "problem.jpg",
      "size": 245760
    },
    "classification": {
      "problemType": "algebra",
      "gradeLevel": "high-school",
      "difficulty": "medium"
    }
  }
}
```

### Get Problems
```javascript
GET /api/problems?problemType=algebra&gradeLevel=high-school&limit=10
```

### Update Problem
```javascript
PUT /api/problems/:id
{
  "solution": {
    "steps": [...],
    "finalAnswer": {...}
  }
}
```

## Usage Examples

### Finding Problems by Difficulty
```javascript
const mediumProblems = await Problem.findByDifficulty('medium');
```

### Searching Problems
```javascript
const results = await Problem.searchProblems('algebra equation');
```

### Analytics Summary
```javascript
const analytics = await Problem.getAnalyticsSummary();
```

## Performance Considerations

### Indexing Strategy
- Problem type and grade level for filtering
- Text search on keywords and topics
- Compound indexes for common query patterns

### Data Management
- Soft delete for data preservation
- Step validation for solution integrity
- Analytics calculation on save

## Security Features

### Input Validation
- File type restrictions
- Size limit enforcement
- Mathematical notation sanitization

### Data Protection
- Soft delete prevents data loss
- User permission checking
- IP address logging for rate limiting

## Future Enhancements

### Planned Features
- Machine learning confidence scoring
- Automated similar problem detection
- Real-time collaboration on solutions
- Advanced analytics dashboard

### Scalability Considerations
- Horizontal scaling with MongoDB sharding
- CDN integration for media files
- Caching layer for popular problems
- API rate limiting and quotas
