import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ResultDisplay = ({ renderUrl, onReset }) => {
  useEffect(() => {
    // Log when the component receives a renderUrl
    console.log("ResultDisplay rendered with URL:", renderUrl);
  }, [renderUrl]);

  if (!renderUrl) {
    console.log("No render URL provided to ResultDisplay");
    return null;
  }

  return (
    <div className="omu-result card">
      <div className="card-body">
        <div className="omu-result-header">
          <h2 className="mb-3">Generated Result</h2>
          <div className="omu-result-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Success
          </div>
        </div>
        
        <div className="omu-result-image">
          <img 
            src={renderUrl} 
            alt="Generated content" 
            onError={(e) => {
              console.error("Error loading render image:", e);
              e.target.src = "https://via.placeholder.com/400x400?text=Error+Loading+Image";
            }}
            onLoad={() => console.log("Image loaded successfully")}
          />
        </div>
        
        <div className="omu-result-actions">
          <a 
            href={renderUrl} 
            download="instagram-post.jpg"
            className="omu-download-button btn btn-primary"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Image
          </a>
          
          <button 
            onClick={onReset} 
            className="omu-restart-button btn btn-outline-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 2v6h6M21.5 22v-6h-6"></path>
              <path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2"></path>
            </svg>
            Create Another
          </button>
        </div>
      </div>
    </div>
  );
};

ResultDisplay.propTypes = {
  renderUrl: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired
};

export default ResultDisplay;