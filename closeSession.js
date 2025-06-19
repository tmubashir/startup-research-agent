import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.BROWSERBASE_API_KEY;
const SESSION_ID = '77baf45f-0fc6-49f3-97a1-b46b9c64d3c5'; // From the previous test

console.log('🔧 Closing existing Browserbase session...');

axios.delete(`https://api.browserbase.com/v1/sessions/${SESSION_ID}`, {
  headers: {
    'X-BB-API-Key': API_KEY
  }
})
.then(() => {
  console.log('✅ Session closed successfully!');
  console.log('Now you can run: node index.js "Flare.io" "https://flare.io"');
})
.catch(error => {
  console.error('❌ Failed to close session:', error.message);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  }
}); 