const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const checkRoutes = require('./routes/checks');
const userRoutes = require('./routes/user'); 
const authRoutes = require('./routes/auth');
const linkScanRoutes = require('./routes/linkscan');
const connectDB = require('./config/db');
const { submitFeedback } = require('./feedback/feedbackcontroller');

dotenv.config();
const app = express();

app.use(cors({
   origin: "http://127.0.0.1:5500", // or your frontend origin
}));
app.use(express.json());

connectDB(); // Connect to MongoDB

app.use('/api/check', checkRoutes); // Checking Route
app.use('/api/auth', authRoutes); // Authentication Route
app.use('/api/links', linkScanRoutes); // Quick scan Route
app.use('/api/user', userRoutes); // User Interaction and Dashboard Route
app.use('/api/feedback', submitFeedback);

app.get('/', (req, res) => {
  res.send('🌐 WebGuardX Server is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
