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
      
      let templatesData;
      if (selectedFolderId) {
        templatesData = await fetchTemplatesByFolder(selectedFolderId);
      } else {
        templatesData = await fetchTemplates();
      }
      
      setTemplates(templatesData);
    } catch (err) {
      console.error("Error loading templates:", err);
      setError("Failed to load templates. Please try again later.");
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

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setRenderHistoryVisible(false);
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
    
    Object.keys(templateDetails.layers).forEach(layerName => {
      const layer = templateDetails.layers[layerName];
      
      if (layer.type === 'text') {
        preparedLayers[layerName] = {
          text: formData[layerName] || layer.text || ''
        };
        
        // Apply brand guidelines to text layers
        if (brandGuidelines) {
          // Apply different styling based on the layer name or content
          if (layerName.includes('title') || layerName.includes('heading')) {
            preparedLayers[layerName].font = brandGuidelines.typography.headingFont;
            preparedLayers[layerName].color = brandGuidelines.colors.primary;
            preparedLayers[layerName].font_weight = brandGuidelines.typography.headingWeight;
          } else if (layerName.includes('button') || layerName.includes('cta')) {
            preparedLayers[layerName].color = brandGuidelines.colors.accent;
            preparedLayers[layerName].font_weight = 'bold';
          } else {
            preparedLayers[layerName].font = brandGuidelines.typography.bodyFont;
            preparedLayers[layerName].color = brandGuidelines.colors.text;
            preparedLayers[layerName].font_weight = brandGuidelines.typography.bodyWeight;
          }
        }
      } else if (layer.type === 'image') {
        if (formData[layerName]) {
          preparedLayers[layerName] = {
            image: formData[layerName]
          };
        }
        
        // Use logo from brand guidelines for logo layers
        if (layerName.includes('logo') && brandGuidelines.logo) {
          preparedLayers[layerName] = {
            image: brandGuidelines.logo
          };
        }
      } else if (layer.type === 'shape') {
        // Apply brand colors to shape layers
        if (brandGuidelines) {
          if (layerName.includes('primary') || layerName.includes('main')) {
            preparedLayers[layerName] = {
              color: brandGuidelines.colors.primary
            };
          } else if (layerName.includes('secondary')) {
            preparedLayers[layerName] = {
              color: brandGuidelines.colors.secondary
            };
          } else if (layerName.includes('accent')) {
            preparedLayers[layerName] = {
              color: brandGuidelines.colors.accent
            };
          } else if (layerName.includes('background')) {
            preparedLayers[layerName] = {
              color: brandGuidelines.colors.background
            };
          }
        }
      }
    });
    
    return preparedLayers;
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
        
        // Set up interval to check render status
        const intervalId = setInterval(async () => {
          try {
            console.log(`Checking status for render ${result.id}`);
            const statusResult = await checkRenderStatus(result.id);
            console.log("Render status check:", JSON.stringify(statusResult, null, 2));
            
            if (statusResult && statusResult.id) {
              setRenderResult(statusResult);
              
              // If render is complete or failed, clear the interval
              if (statusResult.status === 'completed' || statusResult.status === 'failed') {
                console.log(`Render ${statusResult.status}: ${statusResult.url || 'No URL'}`);
                clearInterval(intervalId);
                setRenderStatusInterval(null);
              }
            } else {
              console.error("Invalid status response", statusResult);
              throw new Error("Invalid status response");
            }
          } catch (err) {
            console.error("Error checking render status:", err);
            clearInterval(intervalId);
            setRenderStatusInterval(null);
            setError("Failed to check render status. " + err.message);
          }
        }, 2000);
        
        setRenderStatusInterval(intervalId);
      } else {
        console.error("Invalid render result", result);
        setError("Failed to create render. Invalid response from API.");
      }
    } catch (err) {
      console.error("Error creating render:", err);
      setError("Failed to create render. " + (err.message || "Unknown error"));
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
        <div className="container">
          <div className="row">
            <div className="col col-md-12">
              <FolderSelector 
                onFolderSelect={handleFolderSelect}
                selectedFolderId={selectedFolderId}
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col col-md-8">
              {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
              
              <div className="card">
                <div className="card-body">
                  <TemplateSelector 
                    templates={templates}
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={setSelectedTemplate}
                    isLoading={loadingTemplates}
                    templateLayers={templateDetails?.layers || {}}
                    isLoadingLayers={loadingTemplates}
                  />
                
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
              
              {renderResult && renderResult.status === 'completed' && renderResult.url && (
                <ResultDisplay 
                  renderUrl={renderResult.url}
                  onReset={() => {
                    setRenderResult(null);
                    // Optionally reset other state if needed
                  }}
                />
              )}
            </div>
            
            <div className="col col-md-4">
              {assetLibraryVisible && (
                <AssetLibrary 
                  onAssetSelect={setSelectedAsset}
                  selectedAsset={selectedAsset}
                />
              )}
              
              {renderHistoryVisible && (
                <RenderHistory 
                  onRenderSelect={setSelectedRender}
                  selectedRender={selectedRender}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="omu-footer">
        <p>&copy; {new Date().getFullYear()} Qualia Solutions - OMU Media Kit</p>
      </footer>
    </div>
  );
}

export default App;