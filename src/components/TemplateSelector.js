import React from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';

/**
 * Template selector component that displays available templates and allows selection
 */
const TemplateSelector = ({ 
  templates, 
  selectedTemplate, 
  onTemplateSelect, 
  isLoading, 
  templateLayers,
  isLoadingLayers 
}) => {
  // Handle image load errors
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/200x200?text=No+Preview';
  };

  return (
    <div className="omu-template-selector">
      <label>
        <div className="omu-form-label">
          <span className="omu-form-number">1</span>
          <span>Select a Template</span>
        </div>
      </label>
      
      {isLoading ? (
        <div className="omu-loading-container">
          <LoadingSpinner message="Loading templates..." />
        </div>
      ) : (
        <>
          <div className="omu-templates-grid">
            {templates.length > 0 ? (
              templates.map(template => (
                <div 
                  key={template.id}
                  className={`omu-template-card ${selectedTemplate && selectedTemplate.id === template.id ? 'selected' : ''}`}
                  onClick={() => onTemplateSelect(template)}
                >
                  <div className="omu-template-card-image">
                    <img 
                      src={template.thumbnail_url || template.thumbnail || 
                          `https://templated-assets.s3.us-east-1.amazonaws.com/public/thumbnail/${template.id}.webp`} 
                      alt={template.name}
                      onError={handleImageError}
                    />
                  </div>
                  <div className="omu-template-info">
                    <p>{template.name}</p>
                    <small>{template.dimensions}</small>
                  </div>
                </div>
              ))
            ) : (
              <div className="omu-empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                <p>No templates found</p>
                <small>Try selecting a different folder or refreshing the page</small>
              </div>
            )}
          </div>
          
          {/* Display Template Layers */}
          {selectedTemplate && (
            <div className="omu-template-layers">
              <h3>Template Layers</h3>
              
              {isLoadingLayers ? (
                <LoadingSpinner message="Loading layer details..." size="small" />
              ) : (
                templateLayers && Object.keys(templateLayers).length > 0 ? (
                  <ul>
                    {Object.entries(templateLayers).map(([layerName, layerInfo]) => (
                      <li key={layerName} className={`layer-type-${layerInfo.type}`}>
                        <span className="layer-name">{layerName}</span>
                        <span className="layer-type">{layerInfo.type}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="omu-empty-message">No layers found for this template</p>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

TemplateSelector.propTypes = {
  templates: PropTypes.array.isRequired,
  selectedTemplate: PropTypes.object,
  onTemplateSelect: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  templateLayers: PropTypes.object,
  isLoadingLayers: PropTypes.bool.isRequired
};

TemplateSelector.defaultProps = {
  templates: [],
  selectedTemplate: null,
  templateLayers: {},
  isLoading: false,
  isLoadingLayers: false
};

export default TemplateSelector; 