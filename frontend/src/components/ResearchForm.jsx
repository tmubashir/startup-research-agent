import React, { useState } from 'react'
import '../styles/ResearchForm.css'

const ResearchForm = ({ onSubmit }) => {
  const [startupName, setStartupName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isValid, setIsValid] = useState(false)

  const validateForm = () => {
    const isValidForm = startupName.trim() && websiteUrl.trim() && 
                       (websiteUrl.startsWith('http://') || websiteUrl.startsWith('https://'))
    setIsValid(isValidForm)
  }

  const handleStartupNameChange = (e) => {
    setStartupName(e.target.value)
    validateForm()
  }

  const handleWebsiteUrlChange = (e) => {
    setWebsiteUrl(e.target.value)
    validateForm()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isValid) {
      onSubmit(startupName.trim(), websiteUrl.trim())
    }
  }

  return (
    <div className="research-form-container">
      <div className="form-card">
        <div className="form-header">
          <i className="fas fa-search"></i>
          <h2>Start Your Research</h2>
          <p>Enter the startup details below to generate a comprehensive research report</p>
        </div>

        <form onSubmit={handleSubmit} className="research-form">
          <div className="form-group">
            <label htmlFor="startupName">
              <i className="fas fa-building"></i>
              Startup Name
            </label>
            <input
              type="text"
              id="startupName"
              value={startupName}
              onChange={handleStartupNameChange}
              placeholder="e.g., Stripe, Notion, Airbnb"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="websiteUrl">
              <i className="fas fa-globe"></i>
              Website URL
            </label>
            <input
              type="url"
              id="websiteUrl"
              value={websiteUrl}
              onChange={handleWebsiteUrlChange}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="form-features">
            <h3>What you'll get:</h3>
            <div className="features-grid">
              <div className="feature">
                <i className="fas fa-chart-line"></i>
                <span>Executive Summary</span>
              </div>
              <div className="feature">
                <i className="fas fa-dollar-sign"></i>
                <span>Funding Intelligence</span>
              </div>
              <div className="feature">
                <i className="fas fa-users"></i>
                <span>Competitive Analysis</span>
              </div>
              <div className="feature">
                <i className="fas fa-industry"></i>
                <span>Industry Overview</span>
              </div>
              <div className="feature">
                <i className="fas fa-camera"></i>
                <span>Website Screenshot</span>
              </div>
              <div className="feature">
                <i className="fas fa-file-alt"></i>
                <span>Detailed Report</span>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn-submit ${isValid ? 'btn-primary' : 'btn-disabled'}`}
            disabled={!isValid}
          >
            <i className="fas fa-rocket"></i>
            Start Research
          </button>
        </form>

        <div className="form-footer">
          <p>
            <i className="fas fa-info-circle"></i>
            Research typically takes 2-5 minutes. We'll analyze the website, extract funding data, and generate comprehensive insights.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResearchForm 