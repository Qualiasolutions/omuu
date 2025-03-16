import React, { useState, useEffect } from 'react';
import { fetchTemplates, generateFromTemplate } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const TemplateSelector = ({ onGenerate }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
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

  // Fetch templates on component mount and when filter changes
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Prepare filter options
        const options = {};
        if (categoryFilter && categoryFilter !== 'all') {
          options.category = categoryFilter;
        }
        
        // Fetch templates from Templated.io
        const fetchedTemplates = await fetchTemplates(options);
        setTemplates(fetchedTemplates);
      } catch (err) {
        console.error("Error loading templates:", err);
        setError("Failed to load templates. Please check your API key and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [categoryFilter]);

  // Handle template selection
  const handleTemplateClick = (template) => {
    console.log('Selected template:', template);
    setSelectedTemplate(template);
  };

  // Handle generate button click
  const handleGenerateClick = async () => {
    if (!selectedTemplate) {
      setError('Please select a template first');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      
      // Get the correct template ID format - Templated.io uses template property
      const templateId = selectedTemplate.template_id || selectedTemplate.id;
      console.log(`Generating from template: ${templateId}`);
      
      // Call the Templated.io API to generate content
      const generatedContent = await generateFromTemplate(templateId);
      
      console.log('Generation successful, results:', generatedContent);
      
      // Pass the generated content up to the parent component
      if (onGenerate) {
        onGenerate(generatedContent);
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError(`Failed to generate: ${err.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="template-selector">
      <h2 className="text-2xl font-bold mb-4">Select a Template</h2>
      
      {/* Category filter */}
      <div className="category-filter mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium 
                ${categoryFilter === category.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              onClick={() => setCategoryFilter(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Error message */}
      {error && <ErrorMessage message={error} />}
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center my-8">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Templates grid */}
          {templates.length > 0 ? (
            <div className="templates-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`template-card border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg
                    ${selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleTemplateClick(template)}
                >
                  {template.thumbnail && (
                    <div className="aspect-video bg-gray-100">
                      <img 
                        src={template.thumbnail} 
                        alt={template.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{template.name}</h3>
                    <p className="text-gray-600 mt-1">{template.description}</p>
                    
                    {template.tags && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {template.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No templates found. Try changing the filter or check your API connection.
            </div>
          )}
          
          {/* Generate button */}
          <div className="flex justify-center mt-6">
            <button
              className={`px-6 py-3 rounded-lg font-bold text-white ${
                isGenerating || !selectedTemplate
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={handleGenerateClick}
              disabled={isGenerating || !selectedTemplate}
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Generating...</span>
                </span>
              ) : (
                'Generate'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateSelector;