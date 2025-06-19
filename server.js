import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import StartupResearchAgent from './src/researchAgent.js';

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

// Serve static files from frontend build (if it exists)
const frontendPath = path.join(__dirname, 'frontend/dist');
try {
  app.use(express.static(frontendPath));
  
  // Serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
} catch (error) {
  console.log('Frontend build not found, serving API only');
  
  // Fallback for API-only deployment
  app.get('/', (req, res) => {
    res.json({
      message: 'Startup Research Agent API',
      endpoints: {
        research: 'POST /api/research'
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});

export default app;