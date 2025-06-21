import axios from 'axios';
import http from 'http';
import { Builder, By, until } from 'selenium-webdriver';
import { config } from './config.js';

class BrowserbaseClient {
  constructor() {
    this.apiKey = config.browserbase.apiKey;
    this.apiUrl = config.browserbase.apiUrl;
    this.sessionId = null;
    this.projectId = config.browserbase.projectId;
    this.driver = null;
    this.seleniumUrl = null;
    this.signingKey = null;
  }

  async createSession() {
    try {
      console.log(`🔧 Creating Browserbase session with API URL: ${this.apiUrl}`);
      console.log(`🔧 API Key (first 10 chars): ${this.apiKey.substring(0, 10)}...`);
      
      const response = await axios.post(
        `${this.apiUrl}/sessions`,
        { projectId: this.projectId },
        {
          headers: {
            'X-BB-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          },
          timeout: config.browserbase.timeout
        }
      );

      console.log(`🔧 Response:`, JSON.stringify(response.data, null, 2));
      
      this.sessionId = response.data.id;
      this.seleniumUrl = response.data.seleniumRemoteUrl;
      this.signingKey = response.data.signingKey;
      
      console.log(`✅ Browserbase session created: ${this.sessionId}`);
      console.log(`🔗 Selenium URL: ${this.seleniumUrl}`);
      
      return this.sessionId;
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

  async connectToSession() {
    if (!this.seleniumUrl) {
      throw new Error('No Selenium URL available. Call createSession() first.');
    }

    try {
      console.log(`🔗 Connecting to Selenium WebDriver: ${this.seleniumUrl}`);

      // Create a custom HTTP agent that sets the x-bb-signing-key header
      const customHttpAgent = new http.Agent({});
      customHttpAgent.addRequest = (req, options) => {
        req.setHeader('x-bb-signing-key', this.signingKey);
        http.Agent.prototype.addRequest.call(customHttpAgent, req, options);
      };

      this.driver = await new Builder()
        .forBrowser('chrome')
        .usingHttpAgent(customHttpAgent)
        .usingServer(this.seleniumUrl)
        .build();

      console.log('✅ Connected to Selenium WebDriver');
      return this.driver;
    } catch (error) {
      console.error('❌ Failed to connect to Selenium WebDriver:', error.message);
      throw error;
    }
  }

  async navigateTo(url) {
    if (!this.driver) {
      await this.connectToSession();
    }

    try {
      console.log(`🌐 Navigating to: ${url}`);
      await this.driver.get(url);
      
      // Wait for page to load
      await this.driver.wait(until.titleIs(await this.driver.getTitle()), 10000);
      
      console.log(`✅ Navigated to: ${url}`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Failed to navigate to ${url}:`, error.message);
      throw error;
    }
  }

  async getPageContent() {
    if (!this.driver) {
      throw new Error('No active driver. Call navigateTo() first.');
    }

    try {
      console.log('📄 Getting page content...');
      
      // Get the page source (HTML)
      const pageSource = await this.driver.getPageSource();
      
      // Get the page title
      const title = await this.driver.getTitle();
      
      // Get visible text content
      const bodyText = await this.driver.findElement(By.tagName('body')).getText();
      
      const content = {
        title: title,
        html: pageSource,
        text: bodyText
      };
      
      console.log(`✅ Got page content (${pageSource.length} chars HTML, ${bodyText.length} chars text)`);
      return content;
    } catch (error) {
      console.error('❌ Failed to get page content:', error.message);
      throw error;
    }
  }

  async takeScreenshot() {
    if (!this.driver) {
      throw new Error('No active driver. Call navigateTo() first.');
    }

    try {
      console.log('📸 Taking screenshot...');
      
      const screenshot = await this.driver.takeScreenshot();
      
      // Convert base64 to a data URL
      const screenshotUrl = `data:image/png;base64,${screenshot}`;
      
      console.log('✅ Screenshot taken');
      return screenshotUrl;
    } catch (error) {
      console.error('❌ Failed to take screenshot:', error.message);
      throw error;
    }
  }

  async searchGoogle(query) {
    if (!this.driver) {
      await this.connectToSession();
    }

    try {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      console.log(`🔍 Searching Google for: "${query}"`);
      
      await this.navigateTo(searchUrl);
      
      // Wait for page to load and try multiple selectors for search results
      let searchResultsFound = false;
      const selectors = [
        '#search',           // Main search container
        '#rso',              // Results container
        '.g',                // Individual results
        '[data-hveid]',      // Results with data attributes
        '#main',             // Main content area
        'div[role="main"]'   // Main role container
      ];
      
      for (const selector of selectors) {
        try {
          await this.driver.wait(until.elementLocated(By.css(selector)), 3000);
          console.log(`✅ Found search results with selector: ${selector}`);
          searchResultsFound = true;
          break;
        } catch (error) {
          // Continue to next selector
        }
      }
      
      if (!searchResultsFound) {
        console.log('⚠️ Could not find standard search results, proceeding with page content');
      }
      
      // Add a small delay to ensure content is loaded
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const content = await this.getPageContent();
      return content;
    } catch (error) {
      console.error(`❌ Failed to search Google for "${query}":`, error.message);
      // Return empty content instead of throwing error
      return {
        title: 'Google Search',
        html: '<html><body>Search failed</body></html>',
        text: 'Search failed'
      };
    }
  }

  async closeSession() {
    try {
      if (this.driver) {
        console.log('🔒 Closing Selenium WebDriver...');
        await this.driver.quit();
        this.driver = null;
        console.log('✅ Selenium WebDriver closed');
      }

      if (this.sessionId) {
        console.log(`✅ Browserbase session ${this.sessionId} closed via WebDriver.`);
        this.sessionId = null;
      }
    } catch (error) {
      console.error('❌ Failed to close session:', error.message);
    }
  }
}

export default BrowserbaseClient; 