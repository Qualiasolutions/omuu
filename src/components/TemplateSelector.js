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
      <label>1. Select a Template</label>
      
      {isLoading ? (
        <LoadingSpinner message="Loading templates..." />
      ) : (
        <div className="omu-templates-grid">
          {templates.map(template => (
            <div 
              key={template.id}
              className={`omu-template-card ${selectedTemplate && selectedTemplate.id === template.id ? 'selected' : ''}`}
              onClick={() => onTemplateSelect(template)}
            >
              <img 
                src={template.thumbnail_url || template.thumbnail || 
                     `https://templated-assets.s3.us-east-1.amazonaws.com/public/thumbnail/${template.id}.webp`} 
                alt={template.name}
                onError={handleImageError}
              />
              <div className="omu-template-info">
                <p>{template.name}</p>
                <small>{template.dimensions}</small>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Display Template Layers */}
      {selectedTemplate && (
        <div className="omu-template-layers">
          <h3>Template Layers:</h3>
          
          {isLoadingLayers ? (
            <LoadingSpinner message="Loading layer details..." size="small" />
          ) : (
            templateLayers && Object.keys(templateLayers).length > 0 ? (
              <ul>
                {Object.entries(templateLayers).map(([layerName, layerInfo]) => (
                  <li key={layerName}>
                    {layerName} ({layerInfo.type})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No layers found for this template</p>
            )
          )}
        </div>
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