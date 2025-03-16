import React, { useState, useEffect } from 'react';
import './App.css';
import TemplateSelector from './components/TemplateSelector';
import ContentForm from './components/ContentForm';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import BrandGuidelines from './components/BrandGuidelines';
import FolderSelector from './components/FolderSelector';
import AssetLibrary from './components/AssetLibrary';
import RenderHistory from './components/RenderHistory';
import { fetchTemplateDetails, fetchTemplates, fetchTemplatesByFolder, createRender, checkRenderStatus } from './services/api';

function App() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateDetails, setTemplateDetails] = useState(null);
  const [formData, setFormData] = useState({});
  const [renderResult, setRenderResult] = useState(null);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [loadingRender, setLoadingRender] = useState(false);
  const [error, setError] = useState(null);
  const [renderStatusInterval, setRenderStatusInterval] = useState(null);
  const [brandGuidelines, setBrandGuidelines] = useState(() => {
    const saved = localStorage.getItem('omu-brand-guidelines');
    return saved ? JSON.parse(saved) : {
      colors: {
        primary: '#138a72',
        secondary: '#FFA500',
        accent: '#FF5733',
        text: '#333333',
        background: '#ffffff'
      },
      typography: {
        headingFont: 'Arial, sans-serif',
        bodyFont: 'Arial, sans-serif',
        headingWeight: 'bold',
        bodyWeight: 'normal'
      },
      logo: null,
      voice: 'professional'
    };
  });
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [assetLibraryVisible, setAssetLibraryVisible] = useState(true);
  const [renderHistoryVisible, setRenderHistoryVisible] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedRender, setSelectedRender] = useState(null);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    // Load Omu Media Kit logo
    const logo = new Image();
    logo.src = process.env.PUBLIC_URL + '/images/Logo.png';
    logo.onload = () => setLogoLoaded(true);
    logo.onerror = () => {
      console.log("Logo load error, using fallback");
      // Create a default logo in public folder if missing
      const defaultLogo = document.createElement('link');
      defaultLogo.rel = 'icon';
      defaultLogo.href = process.env.PUBLIC_URL + '/favicon.ico';
      document.head.appendChild(defaultLogo);
    };

    // Load templates on initial render
    loadTemplates();
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [selectedFolderId]);

  useEffect(() => {
    if (selectedTemplate) {
      loadTemplateDetails(selectedTemplate.id);
    }
  }, [selectedTemplate]);

  const loadTemplates = async () => {
    try {
      setLoadingTemplates(true);
      setError(null);
      
      let fetchedTemplates;
      
      if (selectedFolderId) {
        console.log(`Loading templates from folder: ${selectedFolderId}`);
        fetchedTemplates = await fetchTemplatesByFolder(selectedFolderId);
      } else {
        console.log('Loading all templates');
        fetchedTemplates = await fetchTemplates();
      }
      
      console.log(`Loaded ${fetchedTemplates.length} templates:`, fetchedTemplates);
      
      // Ensure each template has the correct IDs
      const processedTemplates = fetchedTemplates.map(template => ({
        ...template,
        id: template.id || template.template_id,
        template_id: template.template_id || template.id
      }));
      
      setTemplates(processedTemplates);
      
      // Clear selected template when templates change
      setSelectedTemplate(null);
      setTemplateDetails(null);
    } catch (err) {
      console.error('Error loading templates:', err);
      setError(`Failed to load templates: ${err.message}`);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const loadTemplateDetails = async (templateId) => {
    try {
      setLoadingTemplates(true);
      setError(null);
      setFormData({});
      setRenderResult(null);
      
      const details = await fetchTemplateDetails(templateId);
      setTemplateDetails(details);
      
      // Initialize form data with any default values from the template layers
      if (details.layers) {
        const initialFormData = {};
        Object.keys(details.layers).forEach(layerName => {
          const layer = details.layers[layerName];
          if (layer.type === 'text' && layer.text) {
            initialFormData[layerName] = layer.text;
          }
        });
        setFormData(initialFormData);
      }
    } catch (err) {
      console.error("Error loading template details:", err);
      setError("Failed to load template details. Please try again later.");
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleSelectTemplate = async (template) => {
    setSelectedTemplate(template);
    
    if (template && template.id) {
      try {
        setLoadingTemplates(true);
        setError(null);
        
        // Get template ID in the correct format
        const templateId = template.template_id || template.id;
        
        // Fetch the template details including layers
        const details = await fetchTemplateDetails(templateId);
        console.log('Template details:', details);
        
        setTemplateDetails(details);
        
        // Initialize form data based on template details
        if (details && details.layers) {
          const initialFormData = {};
          Object.keys(details.layers).forEach(layerName => {
            const layer = details.layers[layerName];
            if (layer.type === 'text') {
              initialFormData[layerName] = layer.text || '';
            }
          });
          setFormData(initialFormData);
        }
      } catch (err) {
        console.error('Error loading template details:', err);
        setError(`Failed to load template details: ${err.message}`);
      } finally {
        setLoadingTemplates(false);
      }
    }
  };

  const handleFormChange = (updatedFormData) => {
    setFormData(updatedFormData);
  };

  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
    // Auto-fill the asset URL into the formData for any image layer that is currently focused
    // This would require additional state to track the focused input
  };

  const handleSelectRender = (render) => {
    setSelectedRender(render);
    setRenderResult(render);
  };

  const handleToggleAssetLibrary = () => {
    setAssetLibraryVisible(!assetLibraryVisible);
  };

  const handleToggleRenderHistory = () => {
    setRenderHistoryVisible(!renderHistoryVisible);
  };

  const handleBrandGuidelinesChange = (updatedGuidelines) => {
    setBrandGuidelines(updatedGuidelines);
    localStorage.setItem('omu-brand-guidelines', JSON.stringify(updatedGuidelines));
  };

  const prepareLayerData = () => {
    if (!templateDetails || !templateDetails.layers) return {};

    const preparedLayers = {};
    
    // Apply business and content type to inform our layer customization
    const businessType = formData.businessType || 'coffee-shop';
    const contentType = formData.contentType || 'casual';
    const customText = formData.customText || '';
    
    // Create a mapping of descriptive business type colors
    const businessTypeColors = {
      'coffee-shop': { main: brandGuidelines.colors.primary, accent: '#6F4E37' },
      'salon': { main: '#D8BFD8', accent: '#FF69B4' },
      'gym': { main: '#1E90FF', accent: '#32CD32' },
      'restaurant': { main: '#FF6347', accent: '#FFA07A' },
      'clothing-store': { main: '#4B0082', accent: '#DA70D6' }
    };
    
    // Set content style based on selected voice/content type
    const contentStyle = {
      'casual': { 
        fontSize: '16px', 
        fontWeight: 'normal',
        letterSpacing: '0px'
      },
      'energetic': { 
        fontSize: '18px', 
        fontWeight: 'bold',
        letterSpacing: '1px',
        transform: 'uppercase'
      },
      'professional': { 
        fontSize: '16px', 
        fontWeight: '500',
        letterSpacing: '0.5px'
      },
      'friendly': { 
        fontSize: '17px', 
        fontWeight: 'normal',
        letterSpacing: '0px',
        fontStyle: 'italic'
      }
    };

    // Select colors based on business type, falling back to brand guidelines
    const mainColor = businessTypeColors[businessType]?.main || brandGuidelines.colors.primary;
    const accentColor = businessTypeColors[businessType]?.accent || brandGuidelines.colors.accent;
    
    Object.keys(templateDetails.layers).forEach(layerName => {
      const layer = templateDetails.layers[layerName];
      
      // Initialize layer properties object
      preparedLayers[layerName] = {};
      
      if (layer.type === 'text') {
        // Start with the base text value, either from form or layer default
        let textValue = formData[layerName] || layer.text || '';
        
        // Apply custom text to main content areas if provided
        if (customText && 
           (layerName.includes('content') || 
            layerName.includes('description') || 
            layerName.includes('main-text'))) {
          textValue = customText;
        }
        
        // Apply text to the layer
        preparedLayers[layerName].text = textValue;
        
        // Apply branding colors based on the layer role
        if (layerName.includes('heading') || layerName.includes('title')) {
          preparedLayers[layerName].color = brandGuidelines.colors.primary;
          preparedLayers[layerName].font_family = brandGuidelines.typography.headingFont;
        } else {
          preparedLayers[layerName].color = brandGuidelines.colors.text;
          preparedLayers[layerName].font_family = brandGuidelines.typography.bodyFont;
        }
        
        // Apply content style based on voice/content type
        if (contentStyle[contentType]) {
          preparedLayers[layerName].font_size = contentStyle[contentType].fontSize;
        }
      } 
      else if (layer.type === 'image') {
        // Apply logo from brand guidelines if available and the layer is for logo
        if (layerName.includes('logo') && brandGuidelines.logo) {
          preparedLayers[layerName].image_url = brandGuidelines.logo;
        }
        // Keep default image or use asset from library if selected
        else if (selectedAsset && layerName.includes('background')) {
          preparedLayers[layerName].image_url = selectedAsset.url;
        }
      }
      else if (layer.type === 'shape' || layer.type === 'rectangle') {
        // Apply branding colors to shapes based on their role
        if (layerName.includes('background')) {
          preparedLayers[layerName].fill = brandGuidelines.colors.background;
        }
        else if (layerName.includes('accent')) {
          preparedLayers[layerName].fill = accentColor;
        }
        else {
          preparedLayers[layerName].fill = mainColor;
        }
      }
    });
    
    console.log('Prepared layer data:', preparedLayers);
    return preparedLayers;
  };

  // Check render status
  const checkRenderStatus = async () => {
    if (renderResult && renderResult.id) {
      try {
        console.log(`Manual check for render ${renderResult.id}`);
        const statusResult = await checkRenderStatus(renderResult.id);
        console.log("Render status check result:", statusResult);
        
        if (statusResult && statusResult.url) {
          console.log("Render URL found:", statusResult.url);
          setRenderResult(statusResult);
        }
      } catch (error) {
        console.error("Error checking render status:", error);
      }
    }
  };

  const handleCreateRender = async () => {
    if (!selectedTemplate) {
      setError("Please select a template first.");
      return;
    }
    
    try {
      console.log("Starting render process");
      setLoadingRender(true);
      setError(null);
      setRenderResult(null);
      
      // Clear any existing interval
      if (renderStatusInterval) {
        clearInterval(renderStatusInterval);
        setRenderStatusInterval(null);
      }
      
      const layerData = prepareLayerData();
      console.log("Prepared layer data:", JSON.stringify(layerData, null, 2));
      
      console.log("Sending API request to create render");
      const result = await createRender(selectedTemplate.id, layerData);
      console.log("Render result:", JSON.stringify(result, null, 2));
      
      if (result && result.id) {
        console.log(`Render created with ID: ${result.id}`);
        // Set initial render result with pending status
        setRenderResult({
          id: result.id,
          status: result.status || 'pending',
          url: result.url || null
        });
        
        // If we already have a URL, no need to check status
        if (result.url && (result.status === 'completed' || result.status === 'COMPLETED')) {
          console.log(`Render already completed with URL: ${result.url}`);
          setLoadingRender(false);
          return;
        }
        
        // Set up interval to check render status
        const intervalId = setInterval(async () => {
          try {
            console.log(`Checking status for render ${result.id}`);
            const statusResult = await checkRenderStatus(result.id);
            console.log("Render status check:", JSON.stringify(statusResult, null, 2));
            
            if (statusResult && statusResult.id) {
              console.log(`Setting render result with status: ${statusResult.status}, URL: ${statusResult.url}`);
              setRenderResult(statusResult);
              
              // If render is complete or failed, clear the interval
              if (statusResult.status === 'completed' || statusResult.status === 'failed') {
                console.log(`Render ${statusResult.status}: ${statusResult.url || 'No URL'}`);
                clearInterval(intervalId);
                setRenderStatusInterval(null);
              }
            }
          } catch (statusError) {
            console.error("Error checking render status:", statusError);
            setError(`Failed to check render status: ${statusError.message}`);
            clearInterval(intervalId);
            setRenderStatusInterval(null);
          }
        }, 2000); // Check every 2 seconds
        
        setRenderStatusInterval(intervalId);
      } else {
        throw new Error("Invalid render result from API");
      }
    } catch (err) {
      console.error("Error creating render:", err);
      setError(`Failed to create render: ${err.message}`);
    } finally {
      setLoadingRender(false);
    }
  };

  return (
    <div className="omu-container">
      <header className="omu-header">
        <div className="omu-logo">
          <img 
            src={process.env.PUBLIC_URL + '/images/Logo.png'} 
            alt="OMU Media Kit Logo" 
            onError={(e) => {
              e.target.onerror = null;
              console.log("Logo load error, using fallback");
              e.target.src = 'https://via.placeholder.com/50x50?text=OMU';
            }}
          />
        </div>
        <h1>OMU Media Kit</h1>
        <div className="omu-subtitle">Powered by: Qualia Solutions</div>
      </header>
      <BrandGuidelines 
        brandGuidelines={brandGuidelines}
        onBrandGuidelinesChange={handleBrandGuidelinesChange}
      />
      
      <main className="App-main">
        <div className="container-fluid px-2 px-md-4">
          <div className="row mb-3">
            <div className="col-12">
              <FolderSelector 
                onFolderSelect={handleFolderSelect}
                selectedFolderId={selectedFolderId}
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col-lg-8 col-md-7 mb-4">
              {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
              
              <div className="card mb-4">
                <div className="card-body">
                  <TemplateSelector 
                    templates={templates}
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={handleSelectTemplate}
                    isLoading={loadingTemplates}
                    error={error}
                  />
                </div>
              </div>
              
              <div className="card mb-4">
                <div className="card-body">
                  <ContentForm 
                    businessType={formData.businessType || "coffee-shop"}
                    contentType={formData.contentType || "casual"}
                    customText={formData.customText || ""}
                    onBusinessTypeChange={(e) => setFormData({...formData, businessType: e.target.value})}
                    onContentTypeChange={(e) => setFormData({...formData, contentType: e.target.value})}
                    onCustomTextChange={(e) => setFormData({...formData, customText: e.target.value})}
                    previewText={formData.customText || "Your text will appear here"}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreateRender();
                    }}
                    isGenerating={loadingRender}
                    hasTemplate={!!selectedTemplate}
                  />
                </div>
              </div>
              
              {/* Show result immediately when render status is completed */}
              {renderResult && renderResult.url && (
                <ResultDisplay 
                  renderUrl={renderResult.url}
                  onReset={() => {
                    setRenderResult(null);
                  }}
                />
              )}
            </div>
            
            <div className="col-lg-4 col-md-5">
              {assetLibraryVisible && (
                <div className="card mb-4">
                  <AssetLibrary 
                    onAssetSelect={setSelectedAsset}
                    selectedAsset={selectedAsset}
                  />
                </div>
              )}
              
              {renderHistoryVisible && (
                <div className="card">
                  <RenderHistory 
                    onRenderSelect={setSelectedRender}
                    selectedRender={selectedRender}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="omu-footer mt-4">
        <p>&copy; {new Date().getFullYear()} Qualia Solutions - OMU Media Kit</p>
      </footer>
    </div>
  );
}

export default App;