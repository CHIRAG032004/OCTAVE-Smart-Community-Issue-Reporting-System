const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDatabase } = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

// Check if Appwrite is configured
if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY) {
  console.warn('⚠️  Appwrite auth not fully configured. Set APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, and APPWRITE_API_KEY in your .env file');
} else {
  console.log('✅ Appwrite authentication configured');
}

// Middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to OCTAVE');
});

// Use Routes
app.use('/api', require('./routes/issue'));
app.use('/api', require('./routes/logs'));
app.use("/api", require('./routes/upload'));
app.use('/api', require('./routes/officer'));

connectDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});
