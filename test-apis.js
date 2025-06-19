import { config, validateConfig } from './src/config.js';
import BrowserbaseClient from './src/browserbase.js';
import OpenAIClient from './src/openai.js';

async function testAPIs() {
  console.log('🧪 Testing API Connections...\n');
  
  try {
    // Test configuration
    console.log('1️⃣ Testing configuration...');
    validateConfig();
    console.log('✅ Configuration is valid');
    
    // Test OpenAI
    console.log('\n2️⃣ Testing OpenAI API...');
    const openai = new OpenAIClient();
    const testResponse = await openai.generateSummary('This is a test company that does amazing things.', 'Test Company');
    console.log('✅ OpenAI API working');
    console.log('   Sample response:', testResponse.substring(0, 100) + '...');
    
    // Test Browserbase
    console.log('\n3️⃣ Testing Browserbase API...');
    const browserbase = new BrowserbaseClient();
    
    console.log('   Creating session...');
    await browserbase.createSession();
    
    console.log('   Navigating to a test page...');
    await browserbase.navigateTo('https://example.com');
    
    console.log('   Getting page content...');
    const content = await browserbase.getPageContent();
    console.log('   Content length:', content.length, 'characters');
    
    console.log('   Closing session...');
    await browserbase.closeSession();
    
    console.log('✅ Browserbase API working');
    
    console.log('\n🎉 All APIs are working correctly!');
    console.log('\nYou can now run:');
    console.log('  node index.js "Flare.io" "https://flare.io"');
    
  } catch (error) {
    console.error('\n❌ API Test Failed:');
    console.error('   Error:', error.message);
    
    if (error.message.includes('OPENAI_API_KEY')) {
      console.error('\n🔧 Fix: Add your OpenAI API key to .env file');
      console.error('   Get it from: https://platform.openai.com/api-keys');
    }
    
    if (error.message.includes('BROWSERBASE_API_KEY')) {
      console.error('\n🔧 Fix: Add your Browserbase API key to .env file');
      console.error('   Get it from: https://browserbase.com/');
    }
    
    if (error.response) {
      console.error('\n🔧 API Response Details:');
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testAPIs(); 