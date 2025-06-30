const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory storage (in production, use a proper database)
const resumeStorage = new Map();
const sheetStorage = new Map();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 1. Resume API Endpoint (GET)
app.get('/api/resume', (req, res) => {
  try {
    const userId = req.query.user_id;
    
    if (!userId) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const resumeData = resumeStorage.get(userId);
    
    if (!resumeData) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({
      resume_text: resumeData.content,
      suggested_roles: resumeData.suggested_roles,
      user_id: userId
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Store resume data (helper endpoint)
app.post('/api/resume', (req, res) => {
  try {
    const { user_id, resume_text, suggested_roles } = req.body;
    
    if (!user_id || !resume_text) {
      return res.status(400).json({ error: 'user_id and resume_text are required' });
    }

    resumeStorage.set(user_id, {
      content: resume_text,
      suggested_roles: suggested_roles || [],
      created_at: new Date()
    });

    res.json({ success: true, message: 'Resume stored successfully' });
  } catch (error) {
    console.error('Error storing resume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Sheet Storage Endpoint (POST)
app.post('/api/store-sheet', (req, res) => {
  try {
    const { user_id, sheet_id, sheet_name, download_url } = req.body;
    
    if (!user_id || !sheet_id || !download_url) {
      return res.status(400).json({ error: 'user_id, sheet_id, and download_url are required' });
    }

    sheetStorage.set(user_id, {
      sheet_id,
      sheet_name: sheet_name || 'LinkedIn Job Matches',
      download_url,
      created_at: new Date()
    });

    res.json({ success: true, message: 'Sheet information stored successfully' });
  } catch (error) {
    console.error('Error storing sheet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Download Button Implementation
app.get('/api/download-sheet', async (req, res) => {
  try {
    const userId = req.query.user_id;
    
    if (!userId) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const sheetInfo = sheetStorage.get(userId);
    
    if (!sheetInfo) {
      return res.status(404).json({ error: 'Sheet not found for user' });
    }

    // Return the download URL instead of redirecting
    res.json({ 
      download_url: sheetInfo.download_url,
      sheet_name: sheetInfo.sheet_name,
      created_at: sheetInfo.created_at
    });
  } catch (error) {
    console.error('Error getting download URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Trigger n8n Workflow
app.post('/api/trigger-job-search', async (req, res) => {
  try {
    const { user_id, resume_text, suggested_roles, keywords } = req.body;
    
    if (!user_id || !resume_text || !suggested_roles) {
      return res.status(400).json({ error: 'user_id, resume_text, and suggested_roles are required' });
    }

    // Store resume data for n8n workflow to access
    resumeStorage.set(user_id, {
      content: resume_text,
      suggested_roles,
      keywords: keywords || [],
      created_at: new Date()
    });

    // n8n webhook URL (replace with your actual n8n webhook URL)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/job-search-trigger';
    
    // Prepare data for n8n workflow
    const workflowData = {
      user_id,
      resume_text,
      suggested_roles,
      keywords: keywords || [],
      callback_url: `${req.protocol}://${req.get('host')}/api/store-sheet`,
      timestamp: new Date().toISOString()
    };

    // For demo purposes, simulate n8n workflow response
    // In production, uncomment the axios call below
    /*
    const n8nResponse = await axios.post(n8nWebhookUrl, workflowData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 seconds timeout
    });
    */

    // Simulate successful workflow trigger
    const simulatedResponse = {
      success: true,
      workflow_id: `workflow_${Date.now()}`,
      message: 'Job search workflow triggered successfully'
    };

    // Simulate Excel file generation after delay
    setTimeout(() => {
      const mockDownloadUrl = `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/export?format=xlsx`;
      
      // Store the mock sheet data
      sheetStorage.set(user_id, {
        sheet_id: `sheet_${Date.now()}`,
        sheet_name: 'LinkedIn Job Matches',
        download_url: mockDownloadUrl,
        created_at: new Date()
      });
    }, 10000); // 10 seconds delay to simulate processing

    res.json({
      success: true,
      workflow_id: simulatedResponse.workflow_id,
      download_url: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/export?format=xlsx',
      message: simulatedResponse.message
    });

  } catch (error) {
    console.error('Error triggering n8n workflow:', error);
    
    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({ error: 'n8n service unavailable' });
    } else if (error.code === 'ETIMEDOUT') {
      res.status(504).json({ error: 'n8n workflow timeout' });
    } else {
      res.status(500).json({ error: 'Failed to trigger job search workflow' });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    storage: {
      resumes: resumeStorage.size,
      sheets: sheetStorage.size
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`Resume API server running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/health');
  console.log('  GET  /api/resume?user_id=<id>');
  console.log('  POST /api/resume');
  console.log('  POST /api/trigger-job-search');
  console.log('  POST /api/store-sheet');
  console.log('  GET  /api/download-sheet?user_id=<id>');
});

module.exports = app;