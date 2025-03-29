require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false // Disabled for development, consider enabling for production
}));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'msc-wound-care-secret',
  genid: () => uuidv4(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
// Insurance Verification Request form
app.post('/api/submit-ivr', async (req, res) => {
  try {
    // Log form data
    console.log('Form data:', req.body);
    
    // In a real implementation, you would save to database using Prisma
    // Example:
    // const formData = await prisma.insuranceVerificationRequest.create({
    //   data: {
    //     patientName: req.body.patientName,
    //     patientDob: new Date(req.body.patientDob),
    //     ...other fields...
    //   }
    // });
    
    res.status(200).json({
      success: true,
      message: 'Insurance verification request submitted successfully'
    });
  } catch (error) {
    console.error('Error processing IVR form submission:', error);
    res.status(500).json({
      success: false,
      message: 'Form submission failed',
      error: error.message
    });
  }
});

// Product Education form
app.post('/api/submit-education', async (req, res) => {
  try {
    console.log('Education request data:', req.body);
    
    // Similar to above, save to database using Prisma
    
    res.status(200).json({
      success: true,
      message: 'Education request submitted successfully'
    });
  } catch (error) {
    console.error('Error processing education request:', error);
    res.status(500).json({
      success: false,
      message: 'Request submission failed',
      error: error.message
    });
  }
});

// Order form
app.post('/api/submit-order', async (req, res) => {
  try {
    console.log('Order data:', req.body);
    
    // Similar to above, save to database using Prisma
    
    res.status(200).json({
      success: true,
      message: 'Order submitted successfully'
    });
  } catch (error) {
    console.error('Error processing order submission:', error);
    res.status(500).json({
      success: false,
      message: 'Order submission failed',
      error: error.message
    });
  }
});

// Onboarding form
app.post('/api/submit-onboarding', async (req, res) => {
  try {
    console.log('Onboarding data:', req.body);
    
    // Similar to above, save to database using Prisma
    
    res.status(200).json({
      success: true,
      message: 'Onboarding form submitted successfully'
    });
  } catch (error) {
    console.error('Error processing onboarding submission:', error);
    res.status(500).json({
      success: false,
      message: 'Onboarding submission failed',
      error: error.message
    });
  }
});

// Webhook endpoint for n8n integration
app.post('/api/webhook', async (req, res) => {
  try {
    console.log('Received webhook data:', req.body);
    
    // Process the webhook data
    // For example, n8n might send status updates for form processing
    
    res.status(200).json({
      success: true,
      message: 'Webhook received successfully'
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    });
  }
});

// Default route for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});
