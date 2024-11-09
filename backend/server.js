const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv'); // Load dotenv
const connectDB = require('./config/db'); // Import the DB connection function

// Load environment variables from .env file
dotenv.config(); // MUST be at the top before anything else

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/auth', require('./routes/authRoute')); // Added authentication routes

// Connect to MongoDB
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack for debugging
  res.status(500).json({ message: 'Internal Server Error' }); // Respond with a 500 status and error message
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
