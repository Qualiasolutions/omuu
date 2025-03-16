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
          <label htmlFor="business-type">2. Select Business Type</label>
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
          <label htmlFor="content-type">3. Select Content Style</label>
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
          <label htmlFor="custom-text">4. Custom Text (Optional)</label>
          <textarea
            id="custom-text"
            value={customText}
            onChange={onCustomTextChange}
            placeholder="Enter your custom text here. Leave empty to use the template text."
            disabled={isGenerating}
            className="omu-textarea"
            rows={4}
          />
          <small className="omu-preview-text">
            Preview: {previewText || "Your text will appear here"}
          </small>
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
            'Generate Instagram Post'
          )}
        </button>
      </form>
      
      {isGenerating && (
        <div className="omu-generating-overlay">
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