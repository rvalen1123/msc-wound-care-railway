const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
      imgSrc: ["'self'", 'data:']
    }
  }
}));

// Compression for better performance
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Parse JSON and URL-encoded bodies (increasing limit for file uploads and signatures)
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
}));

// Routes for different forms
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'msc-wound-ivr-form.html'));
});

app.get('/order', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'msc-wound-order-form.html'));
});

app.get('/onboarding', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'msc-wound-onboarding-form.html'));
});

// Form submission endpoints (you'll expand these later)
app.post('/submit-ivr', async (req, res) => {
  try {
    // Implement form submission logic
    res.json({ success: true, message: 'IVR form submitted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/submit-order', async (req, res) => {
  try {
    // Implement order submission logic
    res.json({ success: true, message: 'Order submitted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/submit-onboarding', async (req, res) => {
  try {
    // Implement onboarding submission logic
    res.json({ success: true, message: 'Onboarding form submitted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'production' ? 'Please try again later' : err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
