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
        Analyze the following website content for ${startupName} and provide a comprehensive, professional summary.

        Website Content:
        ${websiteContent.substring(0, 4000)}

        Please provide a clear, structured summary that includes:

        **Company Overview:**
        - What product or service this company offers
        - Their primary business model and revenue streams

        **Target Market:**
        - Who their ideal customers are
        - Market segments they serve

        **Value Proposition:**
        - Their main competitive advantage
        - Key benefits they provide to customers

        **Key Features:**
        - 3-5 most important features or capabilities
        - What makes them unique

        **Technology & Approach:**
        - Any notable technologies they use
        - Their approach to solving problems

        Write this in a professional, business-friendly tone. Keep it comprehensive but concise (300-400 words).
        Use clear headings and bullet points where appropriate.
      `;

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a senior business analyst specializing in startup research and market analysis. Provide clear, structured, and professional analysis.'
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
        Analyze the following content and extract comprehensive funding-related information.

        Content:
        ${content.substring(0, 3000)}

        Please provide a detailed funding analysis including:

        **Funding Rounds:**
        - Series A, B, C, etc. with amounts
        - Seed funding if mentioned
        - Any other investment rounds

        **Investment Details:**
        - Total funding raised
        - Individual round amounts
        - Valuation information (if available)

        **Investors:**
        - Lead investors for each round
        - Notable angel investors
        - Venture capital firms involved

        **Timeline:**
        - Funding dates
        - Company milestones around funding

        **Additional Context:**
        - How they plan to use the funding
        - Growth plans or expansion mentioned

        If no funding information is found, clearly state: "No funding information was found in the analyzed content."

        Format your response with clear headings and bullet points for easy reading.
      `;

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst specializing in startup funding research. Provide detailed, accurate funding analysis with clear structure.'
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
        Based on the startup description and search results, provide a comprehensive competitive analysis.

        Startup Description:
        ${startupDescription}

        Search Results:
        ${searchResults.substring(0, 3000)}

        Please provide a detailed competitive analysis including:

        **Direct Competitors:**
        - Companies offering similar products/services
        - Direct alternatives to this startup
        - For each: Company name, brief description, key differentiators

        **Indirect Competitors:**
        - Companies in the same market space
        - Alternative solutions customers might consider
        - For each: Company name, what they do, why they're relevant

        **Market Positioning:**
        - How this startup differentiates itself
        - Any "unlike X" or "compared to Y" language found
        - Unique value propositions mentioned

        **Competitive Landscape:**
        - Market share indicators (if mentioned)
        - Pricing comparisons (if available)
        - Feature comparisons (if mentioned)

        If no competitors are clearly identified, explain why and suggest potential competitors based on the industry.

        Format with clear headings and bullet points for easy reading.
      `;

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a competitive intelligence analyst specializing in startup ecosystem research. Provide thorough competitive analysis with clear structure.'
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
        Based on the startup description and competitor information, provide a comprehensive industry analysis.

        Startup Description:
        ${startupDescription}

        Competitors:
        ${competitors}

        Please provide a detailed industry overview including:

        **Industry Classification:**
        - Primary industry and sector
        - Sub-industry or niche
        - Related industries

        **Market Trends:**
        - Current trends driving growth
        - Technology trends affecting the industry
        - Consumer behavior changes
        - Regulatory or policy impacts

        **Market Size & Growth:**
        - Total addressable market (TAM)
        - Serviceable addressable market (SAM)
        - Growth rate and projections
        - Regional market variations

        **Key Players:**
        - Market leaders and incumbents
        - Emerging challengers
        - Notable startups in the space
        - Market share distribution (if known)

        **Growth Drivers:**
        - Factors fueling industry growth
        - Technology adoption trends
        - Market demand drivers

        **Challenges & Risks:**
        - Industry challenges and barriers
        - Competitive threats
        - Regulatory risks
        - Technology disruption risks

        **Future Outlook:**
        - Industry projections
        - Emerging opportunities
        - Potential disruptions

        Format with clear headings, bullet points, and professional analysis. Include specific data points when possible.
      `;

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an industry analyst with expertise in market research and business intelligence. Provide comprehensive industry analysis with clear structure and actionable insights.'
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