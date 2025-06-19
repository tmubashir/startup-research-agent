import BrowserbaseClient from './browserbase.js';
import OpenAIClient from './openai.js';
import fs from 'fs';

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
        additionalContent += '\n\nAbout Page:\n' + aboutContent.text;
      } catch (error) {
        console.log('About page not accessible');
      }
      
      // Try Blog page
      try {
        const blogUrl = new URL('/blog', url).href;
        await this.browserbase.navigateTo(blogUrl);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const blogContent = await this.browserbase.getPageContent();
        additionalContent += '\n\nBlog Page:\n' + blogContent.text;
      } catch (error) {
        console.log('Blog page not accessible');
      }
      
      // Combine main content with additional pages
      const fullContent = content.text + additionalContent;
      return fullContent;
    } catch (error) {
      console.error('Failed to scrape website:', error.message);
      throw error;
    }
  }

  async extractFundingInfo(content) {
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
          fundingInfo = await this.openai.extractFundingInfo(searchResults.text);
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
      const competitors = await this.openai.detectCompetitors(startupDescription, searchResults.text);
      
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

  async generateResearchReport(startupName, websiteUrl) {
    console.log(`🔍 Starting research for: ${startupName}`);
    console.log(`🌐 Website: ${websiteUrl}`);

    try {
      // Step 1: Create session and navigate to website
      console.log('📄 Scraping website content...');
      await this.browserbase.createSession();
      await this.browserbase.navigateTo(websiteUrl);
      const websiteContent = await this.browserbase.getPageContent();
      
      if (!websiteContent || !websiteContent.text || websiteContent.text.length < 100) {
        throw new Error('Failed to extract sufficient content from website');
      }

      // Step 2: Take screenshot
      console.log('📸 Taking website screenshot...');
      const screenshot = await this.browserbase.takeScreenshot();

      // Step 3: Generate analysis using OpenAI
      console.log('🤖 Generating AI analysis...');
      
      const [summary, funding, competitors, industry] = await Promise.all([
        this.openai.generateSummary(websiteContent.text, startupName),
        this.openai.generateFundingInfo(websiteContent.text, startupName),
        this.openai.generateCompetitors(websiteContent.text, startupName),
        this.openai.generateIndustryOverview(websiteContent.text, startupName)
      ]);

      // Step 4: Compile report
      const report = {
        startupName,
        url: websiteUrl,
        summary,
        funding,
        competitors,
        industry,
        screenshot,
        timestamp: new Date().toISOString()
      };

      // Step 5: Save reports
      await this.saveReport(report);

      // Step 6: Close session
      await this.browserbase.closeSession();

      console.log('✅ Research completed successfully!');
      return report;

    } catch (error) {
      console.error('❌ Research failed:', error.message);
      // Try to close session even if there was an error
      try {
        await this.browserbase.closeSession();
      } catch (closeError) {
        console.log('⚠️  Could not close session:', closeError.message);
      }
      throw error;
    }
  }

  generateMarkdownReport(report) {
    // Format the timestamp nicely
    const timestamp = new Date(report.timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Clean up the content for better formatting
    const cleanSummary = report.summary.replace(/\*\*/g, '').replace(/\n/g, '\n\n');
    const cleanFunding = report.funding.replace(/\*\*/g, '').replace(/\n/g, '\n\n');
    const cleanCompetitors = report.competitors.replace(/\*\*/g, '').replace(/\n/g, '\n\n');
    const cleanIndustry = report.industry.replace(/\*\*/g, '').replace(/\n/g, '\n\n');

    const markdown = `# 🚀 Startup Research Report: ${report.startupName}

<div align="center">

![${report.startupName}](https://img.shields.io/badge/Startup-${encodeURIComponent(report.startupName)}-blue?style=for-the-badge&logo=rocket)

**Report Generated:** ${timestamp}  
**Website:** [Visit ${report.startupName}](${report.url})

</div>

---

## 📋 Executive Summary

${cleanSummary}

---

## 💰 Funding Information

${cleanFunding}

---

## 🏆 Competitive Analysis

${cleanCompetitors}

---

## 📊 Industry Overview

${cleanIndustry}

---

## 🔗 Additional Resources

| Resource | Link |
|----------|------|
| **Website** | [Visit ${report.startupName}](${report.url}) |
${report.screenshot ? `| **Screenshot** | [View Screenshot](${report.screenshot}) |` : '| **Screenshot** | Not available |'}

---

## 📈 Key Insights

### 🎯 **What They Do**
${cleanSummary.split('.')[0]}.

### 💡 **Value Proposition**
${cleanSummary.includes('value proposition') ? cleanSummary.split('value proposition')[1]?.split('.')[0] : 'Provides innovative solutions in their market segment'}.

### 🎪 **Target Market**
${cleanSummary.includes('target market') ? cleanSummary.split('target market')[1]?.split('.')[0] : 'Businesses seeking their specific solution'}.

---

<div align="center">

**Report generated by AI-powered Startup Research Agent** 🤖  
*Powered by OpenAI GPT-4 & Browserbase*

</div>
`;

    return markdown;
  }

  // Generate a clean JSON report without base64 data
  generateCleanJsonReport(report) {
    const cleanReport = {
      startupName: report.startupName,
      url: report.url,
      summary: report.summary,
      funding: report.funding,
      competitors: report.competitors,
      industry: report.industry,
      screenshot: report.screenshot ? 'Screenshot available' : 'No screenshot',
      timestamp: report.timestamp,
      reportGenerated: new Date(report.timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    };
    
    return cleanReport;
  }

  async saveReport(report) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = report.startupName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${safeName}_report_${timestamp}`;
    
    // Create reports directory if it doesn't exist
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports');
    }

    // Save clean JSON report (without base64 data)
    const cleanJsonReport = this.generateCleanJsonReport(report);
    const jsonPath = `reports/${filename}.json`;
    fs.writeFileSync(jsonPath, JSON.stringify(cleanJsonReport, null, 2));
    console.log(`✅ JSON report saved: ${jsonPath}`);

    // Save enhanced Markdown report
    const markdownReport = this.generateMarkdownReport(report);
    const mdPath = `reports/${filename}.md`;
    fs.writeFileSync(mdPath, markdownReport);
    console.log(`✅ Markdown report saved: ${mdPath}`);

    // Save screenshot separately if available
    if (report.screenshot && report.screenshot.startsWith('data:image')) {
      try {
        const base64Data = report.screenshot.replace(/^data:image\/\w+;base64,/, '');
        const screenshotPath = `reports/${filename}_screenshot.png`;
        fs.writeFileSync(screenshotPath, Buffer.from(base64Data, 'base64'));
        console.log(`✅ Screenshot saved: ${screenshotPath}`);
      } catch (error) {
        console.log('⚠️  Could not save screenshot:', error.message);
      }
    }

    return {
      jsonPath,
      mdPath,
      filename
    };
  }
}

export default StartupResearchAgent;