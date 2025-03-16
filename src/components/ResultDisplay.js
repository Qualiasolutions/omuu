import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component to display the generated Instagram post image with download option
 */
const ResultDisplay = ({ renderUrl, onReset }) => {
  if (!renderUrl) {
    return null;
  }
  
  return (
    <div className="omu-result">
      <div className="omu-result-header">
        <h2>Your Instagram Post is Ready!</h2>
        <div className="omu-result-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Generated</span>
        </div>
      </div>
      
      <div className="omu-result-image">
        <img src={renderUrl} alt="Generated Instagram Post" />
      </div>
      
      <div className="omu-result-actions">
        <a 
          href={renderUrl} 
          download="instagram-post.jpg" 
          className="omu-download-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download Image
        </a>
        <button 
          className="omu-restart-button"
          onClick={onReset}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6"></path>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
            <path d="M3 22v-6h6"></path>
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
          </svg>
          Create Another
        </button>
      </div>
    </div>
  );
};

ResultDisplay.propTypes = {
  renderUrl: PropTypes.string,
  onReset: PropTypes.func.isRequired
};

export default ResultDisplay; 