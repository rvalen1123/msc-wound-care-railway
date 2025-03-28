const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON and URL-encoded bodies (increasing limit for file uploads and signatures)
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main form page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'msc-wound-ivr-form.html'));
});

// Create a proxy endpoint to forward to n8n
app.post('/submit-form', async (req, res) => {
  try {
    // Get the n8n webhook URL from environment variable
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!n8nWebhookUrl) {
      throw new Error('N8N webhook URL not configured');
    }
    
    console.log('Forwarding form submission to n8n');
    
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });
    
    if (!response.ok) {
      throw new Error(`n8n responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
    
    console.log('Form submission processed successfully');
  } catch (error) {
    console.error('Error forwarding to n8n:', error);
    res.status(500).json({ 
      error: 'Failed to process form submission',
      message: error.message
    });
  }
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Form available at: http://localhost:${PORT}`);
});
