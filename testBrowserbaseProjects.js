import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🧪 Browserbase API Key Test - Projects List\n');

// Read environment variables
const API_KEY = process.env.BROWSERBASE_API_KEY;
const API_URL = 'https://api.browserbase.com/v1/projects';

// Validate required variables
if (!API_KEY) {
  console.error('❌ BROWSERBASE_API_KEY is missing from .env file');
  process.exit(1);
}

// Log configuration (safely)
console.log('📋 Configuration:');
console.log(`   API Key: ${API_KEY.substring(0, 10)}...`);
console.log(`   Endpoint: ${API_URL}\n`);

// Build request headers
const headers = {
  'X-BB-API-Key': API_KEY
};

console.log('📤 Request Details:');
console.log(`   Method: GET`);
console.log(`   URL: ${API_URL}`);
console.log(`   Headers: ${JSON.stringify({ ...headers, 'X-BB-API-Key': `${API_KEY.substring(0, 10)}...` })}\n`);

// Make request
console.log('➡️ Testing API key with projects list...\n');

axios.get(API_URL, { headers })
  .then(response => {
    console.log('✅ Success! API key is valid.');
    console.log('📄 Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Check if your project ID is in the list
    const PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;
    if (PROJECT_ID && response.data.projects) {
      const project = response.data.projects.find(p => p.id === PROJECT_ID);
      if (project) {
        console.log(`\n✅ Your project ID "${PROJECT_ID}" was found in the projects list!`);
      } else {
        console.log(`\n⚠️ Your project ID "${PROJECT_ID}" was NOT found in the projects list.`);
        console.log('   Available projects:');
        response.data.projects.forEach(p => console.log(`   - ${p.id} (${p.name || 'unnamed'})`));
      }
    }
  })
  .catch(error => {
    console.error('❌ Request failed:');
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Double-check your API key in .env');
    console.log('   2. Make sure your Browserbase account is active');
    console.log('   3. Try regenerating your API key in the dashboard');
    console.log('   4. Restart your terminal after changing .env file');
  }); 