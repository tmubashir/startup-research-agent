import OpenAI from 'openai';
import { config } from './config.js';

class OpenAIClient {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey
    });
  }

  async generateSummary(websiteContent, startupName) {
    const prompt = `You are a startup research analyst. Based on the provided website content, create a comprehensive executive summary for ${startupName}.

**Website Content:**
${websiteContent}

**Instructions:**
- Write a clear, professional executive summary (2-3 paragraphs)
- Focus on what the company does, their value proposition, target market, and key features
- Use bullet points for key features/benefits
- Keep it concise but informative
- Avoid marketing language - be objective and analytical
- Structure the response with clear sections

**Format your response as:**
## Executive Summary
[2-3 paragraph summary]

## Key Features
- [Feature 1]
- [Feature 2]
- [Feature 3]

## Target Market
[Clear description of target customers]

## Value Proposition
[What makes them unique/different]`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 800
    });

    return response.choices[0].message.content;
  }

  async generateFundingInfo(websiteContent, startupName) {
    const prompt = `You are a startup research analyst. Analyze the provided website content to extract funding information for ${startupName}.

**Website Content:**
${websiteContent}

**Instructions:**
- Look for any mention of funding rounds, investors, investment amounts, or valuation
- Search for terms like "Series A", "Series B", "funding", "investment", "investors", "raised", "valuation"
- If no funding information is found, clearly state that
- If funding info is found, provide details in a structured format
- Be specific about amounts, dates, and investor names if available

**Format your response as:**
## Funding Information
[Detailed funding information or "No funding information found"]

## Key Details
- Funding Round: [if applicable]
- Amount: [if applicable]
- Date: [if applicable]
- Investors: [if applicable]
- Valuation: [if applicable]`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 600
    });

    return response.choices[0].message.content;
  }

  async generateCompetitors(websiteContent, startupName) {
    const prompt = `You are a startup research analyst. Based on the provided website content, identify potential competitors for ${startupName}.

**Website Content:**
${websiteContent}

**Instructions:**
- Analyze the company's industry, product/service, and target market
- Identify 3-5 direct competitors in the same space
- For each competitor, provide:
  * Company name
  * Brief description of what they do
  * Why they're considered a competitor
- If you cannot identify specific competitors, explain why and suggest the general competitive landscape
- Focus on companies that offer similar products/services or target the same market

**Format your response as:**
## Competitive Analysis
[Overview of competitive landscape]

## Direct Competitors
1. **[Competitor Name]**
   - Description: [What they do]
   - Competitive Angle: [Why they compete]

2. **[Competitor Name]**
   - Description: [What they do]
   - Competitive Angle: [Why they compete]

[Continue for 3-5 competitors]

## Competitive Landscape
[Summary of competitive positioning]`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 800
    });

    return response.choices[0].message.content;
  }

  async generateIndustryOverview(websiteContent, startupName) {
    const prompt = `You are a startup research analyst. Create a comprehensive industry overview for ${startupName} based on the provided website content.

**Website Content:**
${websiteContent}

**Instructions:**
- Analyze the industry/sector this startup operates in
- Provide market size, growth trends, and key players
- Include current market dynamics and challenges
- Discuss growth potential and opportunities
- Use bullet points for better readability
- Be specific with numbers and data when possible
- Structure the information clearly

**Format your response as:**
## Industry Overview

### Market Size & Growth
- [Market size and growth statistics]
- [Growth rate and projections]

### Key Market Trends
- [Trend 1]
- [Trend 2]
- [Trend 3]

### Major Players
- [Key companies in the space]
- [Market leaders and their positioning]

### Market Challenges
- [Challenge 1]
- [Challenge 2]

### Growth Opportunities
- [Opportunity 1]
- [Opportunity 2]

### Industry Outlook
[Summary of future prospects]`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  }
}

export default OpenAIClient; 