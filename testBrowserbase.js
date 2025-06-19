import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🧪 Browserbase API Test - Minimal Session Creation\n');

// Read environment variables
const API_KEY = process.env.BROWSERBASE_API_KEY;
const PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;
const API_URL = 'https://api.browserbase.com/v1/sessions';

// Validate required variables
if (!API_KEY) {
  console.error('❌ BROWSERBASE_API_KEY is missing from .env file');
  process.exit(1);
}

if (!PROJECT_ID) {
  console.error('❌ BROWSERBASE_PROJECT_ID is missing from .env file');
  process.exit(1);
}

// Log configuration (safely)
console.log('📋 Configuration:');
console.log(`   API Key: ${API_KEY.substring(0, 10)}...`);
console.log(`   Project ID: ${PROJECT_ID}`);
console.log(`   Endpoint: ${API_URL}\n`);

// Build request
const payload = {
  projectId: PROJECT_ID
};

const headers = {
  'X-BB-API-Key': API_KEY,
  'Content-Type': 'application/json'
};

console.log('📤 Request Details:');
console.log(`   Method: POST`);
console.log(`   URL: ${API_URL}`);
console.log(`   Headers: ${JSON.stringify({ ...headers, 'X-BB-API-Key': `${API_KEY.substring(0, 10)}...` })}`);
console.log(`   Payload: ${JSON.stringify(payload)}\n`);

// Make request
console.log('➡️ Sending request...\n');

axios.post(API_URL, payload, { headers })
  .then(response => {
    console.log('✅ Success! Session created.');
    console.log('📄 Response:');
    console.log(JSON.stringify(response.data, null, 2));
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
    console.log('   1. Double-check your API key and project ID in .env');
    console.log('   2. Make sure your Browserbase account is active');
    console.log('   3. Verify the API key has the correct permissions');
    console.log('   4. Try regenerating your API key in the dashboard');
    console.log('   5. Restart your terminal after changing .env file');
  }); 