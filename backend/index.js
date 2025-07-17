const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ai-tutor')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB not available, running without database'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// File upload route
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({ 
    message: 'File uploaded successfully',
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size,
    path: req.file.path
  });
});

// Problem solving route
app.post('/api/solve', (req, res) => {
  res.json({ message: 'Problem solving endpoint' });
});

// Video generation route
app.post('/api/generate-video', (req, res) => {
  res.json({ message: 'Video generation endpoint' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
