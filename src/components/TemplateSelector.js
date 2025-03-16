import React, { useState } from 'react';
import { fetchTemplates } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const TemplateSelector = ({ templates, selectedTemplate, onTemplateSelect, isLoading, error: externalError }) => {
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Define available categories
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'content', name: 'Content' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'social', name: 'Social Media' },
    { id: 'business', name: 'Business' }
  ];

  // Handle template selection
  const handleTemplateClick = (template) => {
    console.log('Selected template:', template);
    onTemplateSelect(template);
  };

  // Combined error from props or local state
  const displayError = externalError || error;

  return (
    <div className="template-selector">
      <h2 className="mb-3">Select a Template</h2>
      
      {/* Category filter */}
      <div className="category-filter mb-4">
        <div className="d-flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              className={`btn btn-sm ${categoryFilter === category.id 
                ? 'btn-primary' 
                : 'btn-outline-secondary'}`}
              onClick={() => setCategoryFilter(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Error message */}
      {displayError && <ErrorMessage message={displayError} />}
      
      {/* Loading state */}
      {isLoading ? (
        <div className="d-flex justify-content-center my-4">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Templates grid - Smaller templates with proper classes */}
          {templates && templates.length > 0 ? (
            <div className="omu-templates-grid">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`omu-template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                  onClick={() => handleTemplateClick(template)}
                >
                  {template.thumbnail && (
                    <div className="omu-template-card-image">
                      <img 
                        src={template.thumbnail} 
                        alt={template.name}
                      />
                    </div>
                  )}
                  <div className="omu-template-info">
                    <p>{template.name}</p>
                    <small>{template.description}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              No templates found. Try changing the filter or check your API connection.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TemplateSelector;