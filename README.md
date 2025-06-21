# 🚀 Startup Research Agent

An AI-powered startup research platform that analyzes websites, extracts funding information, identifies competitors, and generates comprehensive reports using OpenAI GPT-4 and Browserbase for web scraping.

## ✨ Features

- **Website Analysis**: Scrapes and analyzes startup websites
- **Funding Intelligence**: Extracts funding information from websites and press releases
- **Competitor Detection**: Uses Google search to identify direct and indirect competitors
- **Industry Overview**: Generates market analysis and industry insights
- **Screenshot Capture**: Takes website screenshots for visual reference
- **Structured Reports**: Outputs both JSON and Markdown reports
- **Modern UI**: React frontend with real-time progress tracking

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React, Vite
- **AI**: OpenAI GPT-4
- **Web Scraping**: Browserbase, Selenium WebDriver
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Browserbase API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd agent_research
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run install-frontend
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   BROWSERBASE_API_KEY=your_browserbase_api_key
   BROWSERBASE_PROJECT_ID=your_project_id
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5050

## 🌐 Deployment to Vercel

### Prerequisites

- Vercel account
- GitHub repository with your code

### Step-by-Step Deployment

1. **Prepare your repository**
   - Ensure all files are committed to git
   - The `vercel.json` configuration is already included

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your repository

3. **Configure environment variables**
   In your Vercel project settings, add these environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   BROWSERBASE_API_KEY=your_browserbase_api_key
   BROWSERBASE_PROJECT_ID=your_project_id
   NODE_ENV=production
   ```

4. **Deploy**
   - Vercel will automatically detect the configuration
   - Click "Deploy"
   - Wait for the build to complete

5. **Access your app**
   - Your app will be available at `https://your-project-name.vercel.app`

### Vercel Configuration

The `vercel.json` file configures:
- **Backend**: Node.js server for API routes
- **Frontend**: Static build of React app
- **Routing**: API routes to backend, everything else to frontend

## 📁 Project Structure

```
agent_research/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── styles/         # CSS files
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   └── vite.config.js
├── src/                     # Backend source
│   ├── browserbase.js      # Browserbase client
│   ├── config.js           # Configuration
│   ├── openai.js           # OpenAI client
│   └── researchAgent.js    # Main research logic
├── reports/                # Generated reports
├── server.js               # Express server
├── package.json            # Backend dependencies
├── vercel.json            # Vercel configuration
└── README.md
```

## 🔧 API Endpoints

- `POST /api/research` - Start research for a startup
- `GET /api/health` - Health check endpoint

### Research Request Format
```json
{
  "startupName": "Example Startup",
  "websiteUrl": "https://example.com"
}
```

## 📊 Generated Reports

The agent generates:
- **JSON Report**: Structured data for programmatic access
- **Markdown Report**: Formatted report with sections and insights
- **Screenshot**: Visual capture of the website

Reports are saved in the `reports/` directory with timestamps.

## 🎯 Usage

1. **Enter startup details**: Name and website URL
2. **Start research**: Click "Start Research"
3. **Wait for analysis**: The agent will:
   - Scrape the website
   - Search for funding information
   - Identify competitors via Google search
   - Generate industry insights
   - Capture screenshots
4. **View results**: Download reports or view in the UI

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 | Yes |
| `BROWSERBASE_API_KEY` | Browserbase API key | Yes |
| `BROWSERBASE_PROJECT_ID` | Browserbase project ID | Yes |
| `NODE_ENV` | Environment (production/development) | No |

## 🚨 Important Notes

- **API Limits**: Be aware of OpenAI and Browserbase rate limits
- **Concurrency**: Browserbase has session limits
- **Costs**: Monitor API usage costs
- **Reports**: Generated reports are stored locally, not in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License

## 🆘 Support

For issues and questions:
- Check the logs for error details
- Verify API keys are correct
- Ensure all dependencies are installed
- Check Browserbase session limits

---

**Built with ❤️ using AI and modern web technologies** 