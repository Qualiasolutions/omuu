import React, { useState, useEffect } from 'react';
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
          {/* Templates grid - Make templates smaller and more responsive */}
          {templates && templates.length > 0 ? (
            <div className="templates-grid">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`template-card ${selectedTemplate?.id === template.id ? 'ring-2 ring-primary border-primary' : ''}`}
                  onClick={() => handleTemplateClick(template)}
                >
                  {template.thumbnail && (
                    <div className="template-thumbnail">
                      <img 
                        src={template.thumbnail} 
                        alt={template.name} 
                        className="w-100"
                      />
                    </div>
                  )}
                  <div className="p-2">
                    <h3 className="template-title">{template.name}</h3>
                    <p className="template-description">{template.description}</p>
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