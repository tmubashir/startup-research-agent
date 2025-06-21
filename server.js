import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import StartupResearchAgent from './src/researchAgent.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/research', async (req, res) => {
  try {
    const { startupName, websiteUrl } = req.body;

    if (!startupName || !websiteUrl) {
      return res.status(400).json({
        error: 'Missing required fields: startupName and websiteUrl'
      });
    }

    console.log(`Starting research for: ${startupName} (${websiteUrl})`);
    
    const agent = new StartupResearchAgent();
    const result = await agent.generateResearchReport(startupName, websiteUrl);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Research error:', error);
    res.status(500).json({
      error: error.message || 'Research failed'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files from frontend build (if it exists)
const frontendPath = path.join(__dirname, 'frontend', 'dist');
if (fs.existsSync(frontendPath)) {
  console.log('📁 Serving frontend from:', frontendPath);
  app.use(express.static(frontendPath));
  
  // Serve index.html for all routes (SPA routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  console.log('⚠️  Frontend build not found at:', frontendPath);
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Backend is running, but frontend is not built',
      frontendPath,
      timestamp: new Date().toISOString()
    });
  });
}

// Start the server only if not in a serverless environment (like Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔌 API: http://localhost:${PORT}/api`);
  });
}

export default app;