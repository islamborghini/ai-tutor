const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ai-tutor')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB not available, running without database'));

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// File upload route
app.post('/api/upload', (req, res) => {
  res.json({ message: 'File upload endpoint' });
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
