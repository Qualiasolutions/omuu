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
      <h2>Your Instagram Post is Ready!</h2>
      <div className="omu-result-image">
        <img src={renderUrl} alt="Generated Instagram Post" />
      </div>
      <div className="omu-result-actions">
        <a 
          href={renderUrl} 
          download="instagram-post.jpg" 
          className="omu-download-button"
        >
          Download Image
        </a>
        <button 
          className="omu-restart-button"
          onClick={onReset}
        >
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