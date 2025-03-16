import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  width: number;
  height: number;
}

interface RenderResponse {
  id: string;
  url: string;
  status: string;
}

const API_KEY = '4a6c2169-01f9-4e0d-89e3-d02d44143823';

const App: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const [customText, setCustomText] = useState<string>('This is my custom text');
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [bgColor, setBgColor] = useState<string>('#0000FF');
  const [imageLayerUrl, setImageLayerUrl] = useState<string>('https://placehold.co/600x400');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.templated.io/v1/templates', {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      setTemplates(response.data.templates || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to fetch templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createRender = async () => {
    if (!selectedTemplate) {
      setError('Please select a template first');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        'https://api.templated.io/v1/render',
        {
          template: selectedTemplate,
          layers: {
            'text-1': {
              text: customText,
              color: textColor,
              background: bgColor,
            },
            'image-1': {
              image_url: imageLayerUrl,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );

      // Check status or poll for completion
      await checkRenderStatus(response.data.id);
    } catch (err) {
      console.error('Error creating render:', err);
      setError('Failed to create render. Please try again.');
      setLoading(false);
    }
  };

  const checkRenderStatus = async (renderId: string) => {
    try {
      const response = await axios.get(`https://api.templated.io/v1/render/${renderId}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      const render = response.data as RenderResponse;
      if (render.status === 'COMPLETED') {
        setImageUrl(render.url);
        setLoading(false);
      } else if (render.status === 'FAILED') {
        setError('Render failed. Please try again.');
        setLoading(false);
      } else {
        // Poll again after a delay
        setTimeout(() => checkRenderStatus(renderId), 2000);
      }
    } catch (err) {
      console.error('Error checking render status:', err);
      setError('Failed to check render status. Please try again.');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `instagram-post-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Instagram Template Generator</h1>
        <p>Powered by Templated API</p>
      </header>

      <main>
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        <div className="templates-container">
          <h2>Select a Template</h2>
          <div className="templates-grid">
            {loading && !templates.length && <p>Loading templates...</p>}
            {!loading && !templates.length && <p>No templates found</p>}
            {templates.map((template) => (
              <div 
                key={template.id}
                className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <img src={template.thumbnail} alt={template.name} />
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <p>{template.width} × {template.height}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="editor-container">
          <h2>Customize Template</h2>
          
          <div className="form-group">
            <label>Text Content:</label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Enter text"
            />
          </div>
          
          <div className="form-group">
            <label>Text Color:</label>
            <div className="color-input">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                placeholder="#FFFFFF"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Background Color:</label>
            <div className="color-input">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                placeholder="#0000FF"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="text"
              value={imageLayerUrl}
              onChange={(e) => setImageLayerUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {imageLayerUrl && (
              <div className="image-preview">
                <img
                  src={imageLayerUrl}
                  alt="Preview"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            )}
          </div>
          
          <button 
            className="create-button"
            onClick={createRender}
            disabled={loading || !selectedTemplate}
          >
            {loading ? 'Creating...' : 'Create Instagram Post'}
          </button>
        </div>

        {imageUrl && (
          <div className="result-container">
            <h2>Your Instagram Post</h2>
            <div className="result-image">
              <img src={imageUrl} alt="Generated Instagram Post" />
            </div>
            <div className="result-actions">
              <button onClick={handleDownload}>Download Image</button>
              <button onClick={() => navigator.clipboard.writeText(imageUrl)}>
                Copy Image URL
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
