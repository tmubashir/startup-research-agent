import React, { useState } from 'react'
import ResearchForm from './components/ResearchForm'
import ResearchResults from './components/ResearchResults'
import LoadingSpinner from './components/LoadingSpinner'
import './styles/App.css'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleResearch = async (startupName, websiteUrl) => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startupName, websiteUrl }),
      })

      if (!response.ok) {
        throw new Error('Research failed. Please try again.')
      }

      const data = await response.json()
      setResults(data.data || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResults(null)
    setError(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-rocket"></i>
            <h1>Startup Research Agent</h1>
          </div>
          <p className="subtitle">AI-Powered Startup Intelligence Platform</p>
        </div>
      </header>

      <main className="app-main">
        {!results && !isLoading && (
          <ResearchForm onSubmit={handleResearch} />
        )}

        {isLoading && (
          <div className="loading-container">
            <LoadingSpinner />
            <h2>Researching Startup...</h2>
            <p>This may take a few minutes. We're analyzing the website, extracting funding data, and generating insights.</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-card">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Research Failed</h3>
              <p>{error}</p>
              <button onClick={handleReset} className="btn-primary">
                Try Again
              </button>
            </div>
          </div>
        )}

        {results && (
          <ResearchResults 
            results={results} 
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Startup Research Agent. Powered by AI & Browserbase.</p>
      </footer>
    </div>
  )
}

export default App 