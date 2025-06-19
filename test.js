import StartupResearchAgent from './src/researchAgent.js';

// Mock the API clients for testing
class MockBrowserbaseClient {
  async createSession() {
    console.log('🔧 Mock: Browserbase session created');
    return 'mock-session-id';
  }
  
  async navigateTo(url) {
    console.log(`🔧 Mock: Navigated to ${url}`);
    return { success: true };
  }
  
  async getPageContent() {
    return `
      Stripe is a technology company that builds economic infrastructure for the internet. 
      Businesses of every size—from new startups to Fortune 500s—use our software to accept payments 
      and grow their revenue online. We handle billions of dollars every year for forward-thinking 
      businesses around the world.
      
      Our mission is to increase the GDP of the internet. We do this by making it easy for businesses 
      to accept payments and scale their operations globally.
      
      Recent funding: Stripe has raised over $2.2 billion in funding across multiple rounds, 
      including a $600 million Series H round in March 2021, valuing the company at $95 billion.
    `;
  }
  
  async searchGoogle(query) {
    console.log(`🔧 Mock: Google search for "${query}"`);
    return `
      Search results for Stripe competitors:
      - PayPal: Digital payments platform
      - Square: Payment processing for small businesses  
      - Adyen: Global payment platform
      - Braintree: Payment gateway owned by PayPal
    `;
  }
  
  async takeScreenshot() {
    console.log('🔧 Mock: Screenshot captured');
    return 'https://mock-screenshot-url.com/stripe.png';
  }
  
  async closeSession() {
    console.log('🔧 Mock: Browserbase session closed');
  }
}

class MockOpenAIClient {
  async generateSummary(content, startupName) {
    console.log(`🔧 Mock: Generating summary for ${startupName}`);
    return `${startupName} is a leading technology company that provides payment processing infrastructure for businesses of all sizes. They enable companies to accept payments online and scale their operations globally, with a mission to increase the GDP of the internet.`;
  }
  
  async extractFundingInfo(content) {
    console.log('🔧 Mock: Extracting funding information');
    return 'Stripe has raised over $2.2 billion in funding across multiple rounds, including a $600 million Series H round in March 2021, valuing the company at $95 billion. Key investors include Sequoia Capital, Andreessen Horowitz, and General Catalyst.';
  }
  
  async detectCompetitors(startupDescription, searchResults) {
    console.log('🔧 Mock: Detecting competitors');
    return 'Direct competitors include PayPal, Square, and Adyen. These companies also provide payment processing solutions for businesses, though each has different strengths and target markets.';
  }
  
  async generateIndustryOverview(startupDescription, competitors) {
    console.log('🔧 Mock: Generating industry overview');
    return 'Stripe operates in the fintech and payment processing industry, which is experiencing rapid growth due to the increasing shift toward digital payments. The global payment processing market is valued at over $40 billion and growing at 10% annually.';
  }
}

// Test function
async function testResearchAgent() {
  console.log('🧪 Testing Startup Research Agent (Mock Mode)\n');
  
  // Create agent with mocked clients
  const agent = new StartupResearchAgent();
  agent.browserbase = new MockBrowserbaseClient();
  agent.openai = new MockOpenAIClient();
  
  try {
    // Test the research process
    const report = await agent.generateReport('Stripe', 'https://stripe.com');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST COMPLETE - MOCK REPORT GENERATED');
    console.log('='.repeat(60));
    
    // Display the report
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
    
    console.log(`\n📸 Screenshot: ${report.screenshot}`);
    
    // Generate markdown report
    const markdown = agent.generateMarkdownReport(report);
    console.log('\n📝 MARKDOWN REPORT:');
    console.log('-'.repeat(40));
    console.log(markdown);
    
    console.log('\n🎉 Test completed successfully!');
    console.log('\nTo run with real APIs:');
    console.log('1. Set up your .env file with API keys');
    console.log('2. Run: node index.js "Stripe" "https://stripe.com"');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testResearchAgent(); 