import StartupResearchAgent from '../src/researchAgent.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
} 