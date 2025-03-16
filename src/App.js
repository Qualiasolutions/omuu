import React, { useState, useEffect } from 'react';
import { fetchTemplates } from './services/api';
import TemplateSelector from './components/TemplateSelector';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

function App() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch available templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        const templatesData = await fetchTemplates();
        setTemplates(templatesData);
        setError(null);
      } catch (err) {
        console.error("Error loading templates:", err);
        setError("Failed to load templates. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Reset any previously generated content when a new template is selected
    setGeneratedContent(null);
  };

  // Handle generated content
  const handleGenerated = (content) => {
    setGeneratedContent(content);
  };

  // Reset the generation process
  const handleReset = () => {
    setSelectedTemplate(null);
    setGeneratedContent(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Omuu Template Generator</h1>
        <p>Select a template and generate content in seconds</p>
      </header>

      <main className="app-content">
        {error && <ErrorMessage message={error} />}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {!generatedContent ? (
              <TemplateSelector
                templates={templates}
                selectedTemplate={selectedTemplate}
                onSelect={handleTemplateSelect}
                onGenerate={handleGenerated}
              />
            ) : (
              <div className="result-container">
                <ResultDisplay content={generatedContent} />
                <button className="reset-button" onClick={handleReset}>
                  Create Another
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Omuu - Advanced Template Generation</p>
      </footer>
    </div>
  );
}

export default App;