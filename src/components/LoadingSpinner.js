import React from 'react';
import PropTypes from 'prop-types';

/**
 * Loading spinner component for indicating background processes
 */
const LoadingSpinner = ({ message, size }) => {
  return (
    <div className="omu-loading" style={{ minHeight: size === 'small' ? 'auto' : '400px' }}>
      <div className="omu-spinner"></div>
      {message && <p className="omu-loading-message">{message}</p>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

LoadingSpinner.defaultProps = {
  message: 'Loading...',
  size: 'medium'
};

export default LoadingSpinner; 