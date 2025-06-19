import express from 'express';
import cors from 'cors';
import StartupResearchAgent from './src/researchAgent.js';

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend build
app.use(express.static('frontend/dist'));

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

    // Create research agent instance
    const agent = new StartupResearchAgent();
    
    // Run the research
    const results = await agent.generateResearchReport(startupName, websiteUrl);

    console.log(`Research completed for: ${startupName}`);

    res.json(results);

  } catch (error) {
    console.error('Research error:', error);
    res.status(500).json({
      error: 'Research failed. Please try again.',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'frontend/dist' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});