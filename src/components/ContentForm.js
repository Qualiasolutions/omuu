import React from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';

/**
 * Content form component for configuring post content
 */
const ContentForm = ({
  businessType,
  contentType,
  customText,
  onBusinessTypeChange,
  onContentTypeChange,
  onCustomTextChange,
  previewText,
  onSubmit,
  isGenerating,
  hasTemplate
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="omu-generator">
      <form className="omu-form" onSubmit={handleSubmit}>
        <div className="omu-form-group">
          <label htmlFor="business-type">
            <div className="omu-form-label">
              <span className="omu-form-number">2</span>
              <span>Select Business Type</span>
            </div>
          </label>
          <select
            id="business-type"
            value={businessType}
            onChange={onBusinessTypeChange}
            disabled={isGenerating}
            className="omu-select"
          >
            <option value="coffee-shop">Coffee Shop</option>
            <option value="salon">Salon</option>
            <option value="gym">Gym</option>
            <option value="restaurant">Restaurant</option>
            <option value="clothing-store">Clothing Store</option>
          </select>
        </div>

        <div className="omu-form-group">
          <label htmlFor="content-type">
            <div className="omu-form-label">
              <span className="omu-form-number">3</span>
              <span>Select Content Style</span>
            </div>
          </label>
          <select
            id="content-type"
            value={contentType}
            onChange={onContentTypeChange}
            disabled={isGenerating}
            className="omu-select"
          >
            <option value="casual">Casual</option>
            <option value="energetic">Energetic</option>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
          </select>
        </div>

        <div className="omu-form-group">
          <label htmlFor="custom-text">
            <div className="omu-form-label">
              <span className="omu-form-number">4</span>
              <span>Custom Text (Optional)</span>
            </div>
          </label>
          <textarea
            id="custom-text"
            value={customText}
            onChange={onCustomTextChange}
            placeholder="Enter your custom text here. Leave empty to use the template text."
            disabled={isGenerating}
            className="omu-textarea"
            rows={4}
          />
          {previewText && (
            <div className="omu-preview-text">
              <strong>Preview:</strong> {previewText}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="omu-generate-button"
          disabled={isGenerating || !hasTemplate}
        >
          {isGenerating ? (
            <>
              <span className="omu-button-spinner"></span>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="omu-button-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Generate Instagram Post
            </>
          )}
        </button>
      </form>
      
      {isGenerating && (
        <div className="omu-loading-overlay">
          <LoadingSpinner message="Creating your Instagram post..." />
        </div>
      )}
    </div>
  );
};

ContentForm.propTypes = {
  businessType: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
  customText: PropTypes.string,
  onBusinessTypeChange: PropTypes.func.isRequired,
  onContentTypeChange: PropTypes.func.isRequired,
  onCustomTextChange: PropTypes.func.isRequired,
  previewText: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isGenerating: PropTypes.bool.isRequired,
  hasTemplate: PropTypes.bool.isRequired
};

ContentForm.defaultProps = {
  customText: '',
  isGenerating: false,
  hasTemplate: false
};

export default ContentForm; 