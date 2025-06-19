import OpenAI from 'openai';
import { config } from './config.js';

class OpenAIClient {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey
    });
  }

  async complete(prompt, max_tokens = 800, temperature = 0.3) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens
    });
    return response.choices[0].message.content;
  }

  async generateSummary(websiteContent, startupName) {
    const prompt = `You are a startup research analyst. Based on the provided website content, create a comprehensive executive summary for ${startupName}.

**Website Content:**
${websiteContent}

**Instructions:**
- Format your response in Markdown.
- Use a section header: ## Executive Summary
- Write 2-3 concise, professional paragraphs.
- Add a section: ## Key Features (bulleted list)
- Add a section: ## Target Market (short paragraph)
- Add a section: ## Value Proposition (short paragraph)
- Use clear line breaks and spacing for readability.

**Example Format:**
## Executive Summary
[2-3 paragraph summary]

## Key Features
- [Feature 1]
- [Feature 2]

## Target Market
[Description]

## Value Proposition
[Description]
`;
    return this.complete(prompt, 800, 0.3);
  }

  async generateFundingInfo(websiteContent, startupName) {
    const prompt = `You are a startup research analyst specializing in funding analysis. Analyze the provided content to extract comprehensive funding information for ${startupName}.

**Content to Analyze:**
${websiteContent}

**Instructions:**
- Format your response in Markdown.
- Use a section header: ## Funding Information
- If funding is found, use a bulleted list for each round (amount, date, investors, valuation, etc.)
- If no funding is found, clearly state so under the header
- Add a section: ## Notable Investors (bulleted list, if any)
- Add a section: ## Funding Summary (short paragraph)
- Use clear line breaks and spacing for readability.

**Example Format:**
## Funding Information
- **Series A**: $10M, Jan 2022, led by Sequoia
- **Seed**: $2M, 2021, Y Combinator

## Notable Investors
- Sequoia Capital
- Y Combinator

## Funding Summary
[Short summary]
`;
    return this.complete(prompt, 600, 0.2);
  }

  async generateCompetitors(websiteContent, startupName) {
    const prompt = `You are a startup research analyst. Based on the provided website content, generate a detailed competitive analysis for ${startupName}.

**Website Content:**
${websiteContent}

**Instructions:**
- Format your response in Markdown.
- Use a section header: ## Competitive Analysis
- List direct competitors as a bulleted list. For each competitor, include:
  - **Name** (bold)
  - *Description* (italic)
  - Sub-bullet for Competitive Angle (why/how they compete)
- Use clear line breaks and spacing for readability.
- After the list, add a section header: ## Competitive Landscape
- Write a short paragraph summarizing the overall competitive landscape and what makes ${startupName} unique.

**Example Format:**
## Competitive Analysis
- **Competitor 1**: *Description*
  - Competitive Angle: [explanation]
- **Competitor 2**: *Description*
  - Competitive Angle: [explanation]

## Competitive Landscape
[Paragraph]
`;
    return this.complete(prompt, 700, 0.3);
  }

  async generateIndustryOverview(websiteContent, startupName) {
    const prompt = `You are a startup research analyst. Based on the provided website content, generate a detailed industry overview for ${startupName}.

**Website Content:**
${websiteContent}

**Instructions:**
- Format your response in Markdown.
- Use a section header: ## Industry Overview
- Write 1-2 paragraphs about the industry, trends, and market size
- Add a section: ## Key Trends (bulleted list)
- Add a section: ## Market Size (short paragraph)
- Use clear line breaks and spacing for readability.

**Example Format:**
## Industry Overview
[Paragraphs]

## Key Trends
- [Trend 1]
- [Trend 2]

## Market Size
[Description]
`;
    return this.complete(prompt, 600, 0.3);
  }
}

export default OpenAIClient; 