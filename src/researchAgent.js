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

  async extractFundingInfo(content, startupName) {
    console.log('💰 Extracting funding information...');
    
    try {
      // First, try to find funding info in the scraped content
      let fundingInfo = await this.openai.generateFundingInfo(content, startupName);
      
      // If no funding info found, try searching for press releases or news
      if (fundingInfo.toLowerCase().includes('no funding') || 
          fundingInfo.toLowerCase().includes('not found') ||
          fundingInfo.toLowerCase().includes('unable to find')) {
        console.log('No funding info found in content, searching for press releases...');
        
        try {
          // Search for funding news and press releases
          const searchQuery = `${startupName} funding press release news investment`;
          console.log(`🔍 Searching Google for: "${searchQuery}"`);
          const searchResults = await this.browserbase.searchGoogle(searchQuery);
          
          if (searchResults && searchResults.text && searchResults.text.length > 100) {
            console.log('Found search results, analyzing for funding info...');
            fundingInfo = await this.openai.generateFundingInfo(searchResults.text, startupName);
          } else {
            console.log('No search results found for funding info');
          }
        } catch (error) {
          console.log('Could not search for additional funding info:', error.message);
        }
      }
      
      return fundingInfo;
    } catch (error) {
      console.error('Failed to extract funding info:', error.message);
      return 'Unable to extract funding information';
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
      // Initialize Browserbase session
      await this.browserbase.createSession();
      
      // Step 1: Scrape website content and take a screenshot
      console.log('📄 Scraping website content...');

      // Navigate to the website and get content
      await this.browserbase.navigateTo(websiteUrl);
      const websiteContent = await this.browserbase.getPageContent();

      // Take a screenshot
      const screenshot = await this.browserbase.takeScreenshot();

      // Step 2: Generate AI analysis
      console.log('🤖 Generating AI analysis...');
      const summary = await this.openai.generateSummary(websiteContent.text, startupName);

      // Step 3: Perform parallel, non-critical analyses with error handling
      let competitors = 'No competitor information found.';
      let fundingInfo = 'No funding information found.';
      let recentNews = 'No recent news found.';

      try {
        console.log('🏆 Searching for competitors...');
        const competitorSearchQuery = `${startupName} competitors alternatives`;
        const competitorSearchResults = await this.browserbase.searchGoogle(competitorSearchQuery);
        if (competitorSearchResults && competitorSearchResults.text) {
          competitors = await this.openai.generateCompetitors(competitorSearchResults.text, startupName);
        }
      } catch (e) {
        console.warn(`⚠️ Could not search for competitors: ${e.message}`);
      }

      try {
        console.log('💰 Searching for funding information...');
        const fundingSearchQuery = `${startupName} funding rounds news`;
        const fundingSearchResults = await this.browserbase.searchGoogle(fundingSearchQuery);
        if (fundingSearchResults && fundingSearchResults.text) {
          fundingInfo = await this.openai.generateFundingInfo(fundingSearchResults.text, startupName);
        }
      } catch (e) {
        console.warn(`⚠️ Could not search for funding info: ${e.message}`);
      }

      // Step 4: Compile the final report
      const report = {
        startupName,
        url: websiteUrl,
        summary,
        funding: fundingInfo,
        competitors,
        recentNews,
        screenshot,
        timestamp: new Date().toISOString()
      };

      // Step 7: Save reports
      await this.saveReport(report);

      // Step 8: Close session
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
    const timestamp = new Date(report.timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Use the content as-is to preserve Markdown formatting
    const markdown = `# 🚀 Startup Research Report: ${report.startupName}

---

**Website:** [${report.url}](${report.url})  
**Generated:** ${timestamp}

---

${report.summary}

---

${report.funding}

---

${report.competitors}

---

${report.industry}

---

![Screenshot](${report.screenshotPath || ''})
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