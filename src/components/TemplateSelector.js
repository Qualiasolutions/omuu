import React, { useState } from 'react';
import { generateFromTemplate } from '../services/api';

const TemplateSelector = ({ templates, onSelect, selectedTemplate, onGenerate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleTemplateClick = (template) => {
    onSelect(template);
  };

  const handleGenerateClick = async () => {
    if (!selectedTemplate) {
      setError('Please select a template first');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      
      // Call the API to generate content from the selected template
      const generatedContent = await generateFromTemplate(selectedTemplate.id);
      
      // Call the onGenerate callback with the generated content
      if (onGenerate) {
        onGenerate(generatedContent);
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError('Failed to generate template: ' + (err.message || 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="template-selector">
      <h2>Select a Template</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="templates-grid">
        {templates && templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
            onClick={() => handleTemplateClick(template)}
          >
            {template.thumbnail && <img src={template.thumbnail} alt={template.name} />}
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="action-buttons">
        <button 
          className="generate-button" 
          onClick={handleGenerateClick}
          disabled={isGenerating || !selectedTemplate}
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  );
};

export default TemplateSelector;