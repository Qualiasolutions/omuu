import React from 'react';
import PropTypes from 'prop-types';

/**
 * Error message component to display error notifications
 */
const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;
  
  return (
    <div className="omu-error-message">
      <div className="omu-error-content">
        <div className="omu-error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
          </svg>
        </div>
        <div className="omu-error-text">{message}</div>
        {onClose && (
          <button className="omu-error-close" onClick={onClose} aria-label="Close error message">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func
};

export default ErrorMessage; 