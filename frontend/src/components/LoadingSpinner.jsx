import React from 'react'
import '../styles/LoadingSpinner.css'

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
    </div>
  )
}

export default LoadingSpinner 