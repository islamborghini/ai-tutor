# MongoDB Installation Guide for AI Tutor Backend

## Current Status
The AI Tutor backend has a complete database schema implemented, but requires MongoDB to be running locally for full functionality.

## Installation Options

### Option 1: Local MongoDB Installation (Recommended for Development)

#### Prerequisites
- macOS with Homebrew installed
- Updated Xcode Command Line Tools

#### Steps

1. **Update Command Line Tools (if needed)**:
```bash
# Remove old tools
sudo rm -rf /Library/Developer/CommandLineTools

# Install latest tools
sudo xcode-select --install
```

2. **Install MongoDB via Homebrew**:
```bash
# Add MongoDB tap
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

3. **Verify Installation**:
```bash
# Test connection
mongosh

# Should connect and show MongoDB shell
# Type 'exit' to close
```

### Option 2: Docker MongoDB (Alternative)

1. **Install Docker Desktop** from [docker.com](https://www.docker.com/products/docker-desktop)

2. **Run MongoDB in Docker**:
```bash
# Start MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest

# Verify it's running
docker ps
```

3. **Connect to MongoDB**:
```bash
# Using mongosh (if installed)
mongosh mongodb://localhost:27017

# Or using Docker exec
docker exec -it mongodb mongosh
```

### Option 3: MongoDB Atlas (Cloud)

1. **Create free account** at [mongodb.com/atlas](https://www.mongodb.com/atlas)

2. **Create a cluster** (free tier available)

3. **Get connection string** and update backend:
```javascript
// In /backend/index.js, replace:
mongoose.connect('mongodb://localhost:27017/ai-tutor')

// With your Atlas connection string:
mongoose.connect('mongodb+srv://username:password@cluster.mongodb.net/ai-tutor')
```

## Testing Database Connection

Once MongoDB is running, test with our backend:

### 1. Start Backend Server
```bash
cd /Users/islam/ai-tutor/backend
node index.js
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running in development mode on port 3001
```

### 2. Test Problem Creation
```bash
curl -X POST http://localhost:3001/api/problems \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "originalImage": {
        "url": "/uploads/test-problem.jpg",
        "filename": "test-problem.jpg",
        "size": 245760
      },
      "classification": {
        "problemType": "algebra",
        "gradeLevel": "high-school", 
        "difficulty": "medium"
      }
    }
  }'
```

### 3. Test Problem Retrieval
```bash
curl http://localhost:3001/api/problems
```

## Database Schema Features

### Complete Problem Lifecycle
- **Input**: File uploads, OCR processing, problem classification
- **Solution**: AI-generated step-by-step solutions
- **Analytics**: User engagement, completion rates, ratings
- **Content**: Generated videos, audio, practice problems

### Performance Optimizations
- Strategic indexing for common queries
- Text search capabilities
- Soft delete for data preservation
- Analytics calculations on save

### API Endpoints Available
- `POST /api/problems` - Create new problem
- `GET /api/problems` - List problems with filtering
- `GET /api/problems/:id` - Get specific problem
- `PUT /api/problems/:id` - Update problem
- `DELETE /api/problems/:id` - Soft delete problem

## Troubleshooting

### Common Issues

1. **Connection Refused Error**:
   - Ensure MongoDB is running: `brew services list | grep mongodb`
   - Restart if needed: `brew services restart mongodb-community`

2. **Port 27017 in Use**:
   - Check what's using the port: `lsof -i :27017`
   - Kill conflicting process or use different port

3. **Permission Issues**:
   - Check MongoDB log: `/opt/homebrew/var/log/mongodb/mongo.log`
   - Fix permissions: `sudo chown -R $(whoami) /opt/homebrew/var/mongodb`

### Verification Commands
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# View MongoDB logs
tail -f /opt/homebrew/var/log/mongodb/mongo.log

# Connect with mongosh
mongosh mongodb://localhost:27017/ai-tutor

# Show databases
show dbs

# Show collections in ai-tutor database
use ai-tutor
show collections
```

## Next Steps

Once MongoDB is running:

1. **Test schema functionality** with the test script:
   ```bash
   cd /Users/islam/ai-tutor/backend
   node test-schema.js
   ```

2. **Connect frontend** to backend APIs for full functionality

3. **Add sample data** for development testing

4. **Configure environment variables** for production deployment

## Current Status Summary

✅ **Complete**: Database schema, API endpoints, validation, indexes
⏳ **Pending**: MongoDB installation and connection
🎯 **Goal**: Full database functionality for problem management and analytics
