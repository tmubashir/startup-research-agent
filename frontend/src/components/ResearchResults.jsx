import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import '../styles/ResearchResults.css'

const ResearchResults = ({ results, onReset }) => {
  const [activeTab, setActiveTab] = useState('summary')

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const downloadReport = (type) => {
    const element = document.createElement('a')
    const file = new Blob([type === 'json' ? JSON.stringify(results, null, 2) : results.markdownReport], {
      type: type === 'json' ? 'application/json' : 'text/markdown'
    })
    element.href = URL.createObjectURL(file)
    element.download = `${results.startupName}-research-report.${type === 'json' ? 'json' : 'md'}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="results-title">
          <h1>
            <i className="fas fa-chart-bar"></i>
            Research Results: {results.startupName}
          </h1>
          <p className="results-subtitle">
            Generated on {formatDate(results.timestamp)}
          </p>
        </div>
        
        <div className="results-actions">
          <button onClick={() => downloadReport('markdown')} className="btn-secondary">
            <i className="fas fa-download"></i>
            Download Markdown
          </button>
          <button onClick={() => downloadReport('json')} className="btn-secondary">
            <i className="fas fa-code"></i>
            Download JSON
          </button>
          <button onClick={onReset} className="btn-primary">
            <i className="fas fa-plus"></i>
            New Research
          </button>
        </div>
      </div>

      <div className="results-content">
        <div className="results-tabs">
          <button 
            className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <i className="fas fa-chart-line"></i>
            Executive Summary
          </button>
          <button 
            className={`tab ${activeTab === 'funding' ? 'active' : ''}`}
            onClick={() => setActiveTab('funding')}
          >
            <i className="fas fa-dollar-sign"></i>
            Funding
          </button>
          <button 
            className={`tab ${activeTab === 'competitors' ? 'active' : ''}`}
            onClick={() => setActiveTab('competitors')}
          >
            <i className="fas fa-users"></i>
            Competitors
          </button>
          <button 
            className={`tab ${activeTab === 'industry' ? 'active' : ''}`}
            onClick={() => setActiveTab('industry')}
          >
            <i className="fas fa-industry"></i>
            Industry
          </button>
          <button 
            className={`tab ${activeTab === 'screenshot' ? 'active' : ''}`}
            onClick={() => setActiveTab('screenshot')}
          >
            <i className="fas fa-camera"></i>
            Screenshot
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'summary' && (
            <div className="summary-section">
              <div className="summary-card">
                <h3>Executive Summary</h3>
                <div className="summary-content">
                  <ReactMarkdown>{results.summary}</ReactMarkdown>
                </div>
              </div>
              
              <div className="quick-stats">
                <div className="stat-card">
                  <i className="fas fa-globe"></i>
                  <h4>Website</h4>
                  <a href={results.url} target="_blank" rel="noopener noreferrer">
                    Visit {results.startupName}
                  </a>
                </div>
                <div className="stat-card">
                  <i className="fas fa-clock"></i>
                  <h4>Research Time</h4>
                  <span>{formatDate(results.timestamp)}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'funding' && (
            <div className="funding-section">
              <div className="funding-card">
                <h3>Funding Intelligence</h3>
                <div className="funding-content">
                  <ReactMarkdown>{results.funding}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'competitors' && (
            <div className="competitors-section">
              <div className="competitors-card">
                <h3>Competitive Analysis</h3>
                <div className="competitors-content">
                  <ReactMarkdown>{results.competitors}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'industry' && (
            <div className="industry-section">
              <div className="industry-card">
                <h3>Industry Overview</h3>
                <div className="industry-content">
                  <ReactMarkdown>{results.industry}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'screenshot' && (
            <div className="screenshot-section">
              <div className="screenshot-card">
                <h3>Website Screenshot</h3>
                <div className="screenshot-content">
                  {results.screenshotUrl ? (
                    <img 
                      src={results.screenshotUrl} 
                      alt={`${results.startupName} homepage`}
                      className="screenshot-image"
                    />
                  ) : (
                    <div className="screenshot-placeholder">
                      <i className="fas fa-image"></i>
                      <p>Screenshot not available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResearchResults 