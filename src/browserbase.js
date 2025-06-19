import axios from 'axios';
import { config } from './config.js';

class BrowserbaseClient {
  constructor() {
    this.apiKey = config.browserbase.apiKey;
    this.apiUrl = config.browserbase.apiUrl;
    this.sessionId = null;
    this.projectId = config.browserbase.projectId;
  }

  async createSession() {
    try {
      console.log(`🔧 Creating Browserbase session with API URL: ${this.apiUrl}`);
      console.log(`🔧 API Key (first 10 chars): ${this.apiKey.substring(0, 10)}...`);
      
      // Try different API formats with projectId
      const payloads = [
        // Format 1: Simple session creation with projectId
        {
          projectId: this.projectId
        },
        // Format 2: With browser config and projectId
        {
          projectId: this.projectId,
          browser: {
            type: 'chromium',
            headless: true,
            viewport: { width: 1920, height: 1080 }
          }
        },
        // Format 3: Alternative format with projectId
        {
          projectId: this.projectId,
          config: {
            browser: 'chromium',
            headless: true
          }
        }
      ];

      let lastError = null;
      
      for (const payload of payloads) {
        try {
          console.log(`🔧 Trying payload format:`, JSON.stringify(payload, null, 2));
          
          const response = await axios.post(
            `${this.apiUrl}/sessions`,
            payload,
            {
              headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
              },
              timeout: config.browserbase.timeout
            }
          );

          console.log(`🔧 Response:`, JSON.stringify(response.data, null, 2));
          
          // Handle different response formats
          this.sessionId = response.data.sessionId || response.data.id || response.data.session_id;
          
          if (this.sessionId) {
            console.log(`✅ Browserbase session created: ${this.sessionId}`);
            return this.sessionId;
          }
        } catch (error) {
          lastError = error;
          console.log(`❌ Format failed: ${error.message}`);
          if (error.response && error.response.data) {
            console.log(`   Details:`, JSON.stringify(error.response.data, null, 2));
          }
          continue;
        }
      }
      
      throw lastError || new Error('All API formats failed');
      
    } catch (error) {
      console.error('❌ Failed to create Browserbase session:');
      console.error('   Error:', error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  async navigateTo(url) {
    if (!this.sessionId) {
      throw new Error('No active session. Call createSession() first.');
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}/sessions/${this.sessionId}/navigate`,
        { url },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: config.browserbase.timeout
        }
      );

      console.log(`✅ Navigated to: ${url}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to navigate to ${url}:`, error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  async getPageContent() {
    if (!this.sessionId) {
      throw new Error('No active session. Call createSession() first.');
    }

    try {
      const response = await axios.get(
        `${this.apiUrl}/sessions/${this.sessionId}/content`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: config.browserbase.timeout
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Failed to get page content:', error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  async takeScreenshot() {
    if (!this.sessionId) {
      throw new Error('No active session. Call createSession() first.');
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}/sessions/${this.sessionId}/screenshot`,
        {
          format: 'png',
          fullPage: true
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: config.browserbase.timeout
        }
      );

      return response.data.screenshotUrl || response.data.url;
    } catch (error) {
      console.error('❌ Failed to take screenshot:', error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  async searchGoogle(query) {
    if (!this.sessionId) {
      throw new Error('No active session. Call createSession() first.');
    }

    try {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      await this.navigateTo(searchUrl);
      
      // Wait for page to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const content = await this.getPageContent();
      return content;
    } catch (error) {
      console.error(`❌ Failed to search Google for "${query}":`, error.message);
      throw error;
    }
  }

  async closeSession() {
    if (!this.sessionId) {
      return;
    }

    try {
      await axios.delete(
        `${this.apiUrl}/sessions/${this.sessionId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: config.browserbase.timeout
        }
      );

      console.log(`✅ Browserbase session closed: ${this.sessionId}`);
      this.sessionId = null;
    } catch (error) {
      console.error('❌ Failed to close session:', error.message);
    }
  }
}

export default BrowserbaseClient; 