import BrowserbaseClient from './browserbase.js';
import OpenAIClient from './openai.js';

class StartupResearchAgent {
  constructor() {
    this.browserbase = new BrowserbaseClient();
    this.openai = new OpenAIClient();
  }

  async scrapeWebsite(url) {
    console.log(`🔍 Scraping website: ${url}`);
    
    try {
      await this.browserbase.createSession();
      await this.browserbase.navigateTo(url);
      
      // Wait for page to load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const content = await this.browserbase.getPageContent();
      
      // Try to scrape additional pages if available
      let additionalContent = '';
      
      // Try About page
      try {
        const aboutUrl = new URL('/about', url).href;
        await this.browserbase.navigateTo(aboutUrl);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const aboutContent = await this.browserbase.getPageContent();
        additionalContent += '\n\nAbout Page:\n' + aboutContent;
      } catch (error) {
        console.log('About page not accessible');
      }
      
      // Try Blog page
      try {
        const blogUrl = new URL('/blog', url).href;
        await this.browserbase.navigateTo(blogUrl);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const blogContent = await this.browserbase.getPageContent();
        additionalContent += '\n\nBlog Page:\n' + blogContent;
      } catch (error) {
        console.log('Blog page not accessible');
      }
      
      return content + additionalContent;
    } catch (error) {
      console.error('Failed to scrape website:', error.message);
      throw error;
    }
  }

  async extractFunding(content) {
    console.log('💰 Extracting funding information...');
    
    try {
      // First, try to find funding info in the scraped content
      let fundingInfo = await this.openai.extractFundingInfo(content);
      
      // If no funding info found, try searching for press releases or news
      if (fundingInfo.toLowerCase().includes('no funding') || fundingInfo.toLowerCase().includes('not found')) {
        console.log('No funding info found in content, searching for press releases...');
        
        // Navigate back to homepage and search for press/news
        try {
          const searchResults = await this.browserbase.searchGoogle(`${this.startupName} funding press release news`);
          fundingInfo = await this.openai.extractFundingInfo(searchResults);
        } catch (error) {
          console.log('Could not search for additional funding info');
        }
      }
      
      return fundingInfo;
    } catch (error) {
      console.error('Failed to extract funding info:', error.message);
      return 'Unable to extract funding information';
    }
  }

  async detectCompetitors(startupDescription) {
    console.log('🏆 Detecting competitors...');
    
    try {
      // Search for competitors using Google
      const searchResults = await this.browserbase.searchGoogle(`${this.startupName} competitors alternatives`);
      
      // Use AI to analyze and identify competitors
      const competitors = await this.openai.detectCompetitors(startupDescription, searchResults);
      
      return competitors;
    } catch (error) {
      console.error('Failed to detect competitors:', error.message);
      return 'Unable to detect competitors';
    }
  }

  async generateIndustryOverview(startupDescription, competitors) {
    console.log('📊 Generating industry overview...');
    
    try {
      const industryOverview = await this.openai.generateIndustryOverview(startupDescription, competitors);
      return industryOverview;
    } catch (error) {
      console.error('Failed to generate industry overview:', error.message);
      return 'Unable to generate industry overview';
    }
  }

  async captureScreenshot() {
    console.log('📸 Capturing homepage screenshot...');
    
    try {
      const screenshotUrl = await this.browserbase.takeScreenshot();
      return screenshotUrl;
    } catch (error) {
      console.error('Failed to capture screenshot:', error.message);
      return null;
    }
  }

  async generateReport(startupName, url) {
    console.log(`🚀 Starting research for: ${startupName}`);
    this.startupName = startupName;
    
    try {
      // Step 1: Scrape website
      const websiteContent = await this.scrapeWebsite(url);
      
      // Step 2: Generate startup summary
      console.log('📝 Generating startup summary...');
      const startupSummary = await this.openai.generateSummary(websiteContent, startupName);
      
      // Step 3: Extract funding information
      const fundingInfo = await this.extractFunding(websiteContent);
      
      // Step 4: Detect competitors
      const competitors = await this.detectCompetitors(startupSummary);
      
      // Step 5: Generate industry overview
      const industryOverview = await this.generateIndustryOverview(startupSummary, competitors);
      
      // Step 6: Capture screenshot
      const screenshotUrl = await this.captureScreenshot();
      
      // Step 7: Generate final report
      const report = {
        startupName,
        url,
        summary: startupSummary,
        funding: fundingInfo,
        competitors,
        industry: industryOverview,
        screenshot: screenshotUrl,
        timestamp: new Date().toISOString()
      };
      
      return report;
    } catch (error) {
      console.error('Failed to generate report:', error.message);
      throw error;
    } finally {
      // Always close the browser session
      await this.browserbase.closeSession();
    }
  }

  generateMarkdownReport(report) {
    const markdown = `# Startup Research Report: ${report.startupName}

## 📋 Executive Summary
${report.summary}

## 💰 Funding Information
${report.funding}

## 🏆 Competitors
${report.competitors}

## 📊 Industry Overview
${report.industry}

## 🔗 Links
- **Website**: ${report.url}
${report.screenshot ? `- **Screenshot**: ${report.screenshot}` : ''}

---
*Report generated on ${new Date(report.timestamp).toLocaleString()}*
`;

    return markdown;
  }
}

export default StartupResearchAgent; 