import OpenAI from 'openai';
import { config } from './config.js';

class OpenAIClient {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey
    });
  }

  async generateSummary(websiteContent, startupName) {
    try {
      const prompt = `
        Analyze the following website content for ${startupName} and provide a concise summary of what this company does.
        
        Website Content:
        ${websiteContent.substring(0, 4000)} // Limit content to avoid token limits
        
        Please provide a clear, professional summary that explains:
        1. What product or service this company offers
        2. Their target market or customers
        3. Their main value proposition
        4. Key features or benefits
        
        Keep the summary under 200 words and write it in a professional tone.
      `;

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a business analyst specializing in startup research and analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Failed to generate summary:', error.message);
      throw error;
    }
  }

  async extractFundingInfo(content) {
    try {
      const prompt = `
        Analyze the following content and extract any funding-related information.
        
        Content:
        ${content.substring(0, 3000)}
        
        Look for information about:
        - Funding rounds (Series A, B, C, etc.)
        - Investment amounts
        - Investor names
        - Funding dates
        - Valuation information
        
        If no funding information is found, indicate that.
        
        Return the information in a structured format.
      `;

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst specializing in startup funding research.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Failed to extract funding info:', error.message);
      throw error;
    }
  }

  async detectCompetitors(startupDescription, searchResults) {
    try {
      const prompt = `
        Based on the startup description and search results, identify potential competitors.
        
        Startup Description:
        ${startupDescription}
        
        Search Results:
        ${searchResults.substring(0, 3000)}
        
        Please identify:
        1. Direct competitors (companies offering similar products/services)
        2. Indirect competitors (companies in the same market space)
        3. Mention any "unlike X" or "compared to Y" language found
        
        For each competitor, provide:
        - Company name
        - Brief description of what they do
        - Why they're considered a competitor
        
        Return the information in a structured format.
      `;

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a competitive intelligence analyst specializing in startup ecosystem research.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Failed to detect competitors:', error.message);
      throw error;
    }
  }

  async generateIndustryOverview(startupDescription, competitors) {
    try {
      const prompt = `
        Based on the startup description and competitor information, provide an industry overview.
        
        Startup Description:
        ${startupDescription}
        
        Competitors:
        ${competitors}
        
        Please provide:
        1. Industry classification and sector
        2. Current market trends in this space
        3. Key market players (beyond the competitors already identified)
        4. Market size estimates if mentioned or can be inferred
        5. Growth potential and challenges in this industry
        
        Write this as a comprehensive but concise industry analysis.
      `;

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an industry analyst with expertise in market research and business intelligence.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Failed to generate industry overview:', error.message);
      throw error;
    }
  }
}

export default OpenAIClient; 