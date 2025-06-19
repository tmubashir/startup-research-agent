import StartupResearchAgent from './src/researchAgent.js';
import { validateConfig } from './src/config.js';
import fs from 'fs/promises';

async function main() {
  try {
    // Validate configuration
    validateConfig();
    console.log('✅ Configuration validated successfully');
    
    // Initialize the research agent
    const agent = new StartupResearchAgent();
    
    // Example usage - you can modify these values
    const startupName = process.argv[2] || 'Stripe';
    const startupUrl = process.argv[3] || 'https://stripe.com';
    
    console.log(`\n🚀 Starting research for: ${startupName}`);
    console.log(`🌐 URL: ${startupUrl}\n`);
    
    // Generate the research report
    const report = await agent.generateReport(startupName, startupUrl);
    
    // Output results
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESEARCH REPORT COMPLETE');
    console.log('='.repeat(60));
    
    // Save JSON report
    const jsonFilename = `reports/${startupName.toLowerCase().replace(/\s+/g, '_')}_report.json`;
    await fs.mkdir('reports', { recursive: true });
    await fs.writeFile(jsonFilename, JSON.stringify(report, null, 2));
    console.log(`💾 JSON report saved: ${jsonFilename}`);
    
    // Save Markdown report
    const markdownReport = agent.generateMarkdownReport(report);
    const mdFilename = `reports/${startupName.toLowerCase().replace(/\s+/g, '_')}_report.md`;
    await fs.writeFile(mdFilename, markdownReport);
    console.log(`📝 Markdown report saved: ${mdFilename}`);
    
    // Display summary in console
    console.log('\n📋 EXECUTIVE SUMMARY:');
    console.log('-'.repeat(40));
    console.log(report.summary);
    
    console.log('\n💰 FUNDING INFO:');
    console.log('-'.repeat(40));
    console.log(report.funding);
    
    console.log('\n🏆 COMPETITORS:');
    console.log('-'.repeat(40));
    console.log(report.competitors);
    
    console.log('\n📊 INDUSTRY OVERVIEW:');
    console.log('-'.repeat(40));
    console.log(report.industry);
    
    if (report.screenshot) {
      console.log(`\n📸 Screenshot: ${report.screenshot}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Handle command line usage
if (process.argv.length < 3) {
  console.log(`
🤖 AI-Powered Startup Research Agent

Usage:
  node index.js <startup_name> [startup_url]

Examples:
  node index.js "Stripe" "https://stripe.com"
  node index.js "Notion" "https://notion.so"
  node index.js "Figma"

Environment Variables Required:
  - OPENAI_API_KEY: Your OpenAI API key
  - BROWSERBASE_API_KEY: Your Browserbase API key

See env.example for configuration details.
  `);
  process.exit(0);
}

main(); 