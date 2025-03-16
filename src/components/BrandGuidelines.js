import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { uploadImage } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const BrandGuidelines = ({ brandGuidelines, onBrandGuidelinesChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('colors');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleColorChange = (colorKey, value) => {
    onBrandGuidelinesChange({
      ...brandGuidelines,
      colors: {
        ...brandGuidelines.colors,
        [colorKey]: value
      }
    });
  };

  const handleTypographyChange = (typographyKey, value) => {
    onBrandGuidelinesChange({
      ...brandGuidelines,
      typography: {
        ...brandGuidelines.typography,
        [typographyKey]: value
      }
    });
  };

  const handleVoiceChange = (voice) => {
    onBrandGuidelinesChange({
      ...brandGuidelines,
      voice: voice
    });
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      setError('');
      
      const uploadData = await uploadImage(file);
      
      if (uploadData && uploadData.url) {
        onBrandGuidelinesChange({
          ...brandGuidelines,
          logo: uploadData.url
        });
      } else {
        setError('Failed to upload logo. Invalid response from server.');
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo: ' + err.message);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="omu-brand-guidelines card">
      <div className="omu-section-header" onClick={toggleExpand}>
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="omu-brand-icon">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            <line x1="4" y1="22" x2="4" y2="15"></line>
          </svg>
          Brand Guidelines
        </h3>
        <button className="omu-toggle-button">
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="card-body omu-brand-panel">
          <div className="omu-brand-tabs">
            {['colors', 'typography', 'logo', 'voice'].map((tab) => (
              <button
                key={tab}
                className={`omu-brand-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'colors' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="5"></circle>
                  </svg>
                )}
                {tab === 'typography' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 7 4 4 20 4 20 7"></polyline>
                    <line x1="9" y1="20" x2="15" y2="20"></line>
                    <line x1="12" y1="4" x2="12" y2="20"></line>
                  </svg>
                )}
                {tab === 'logo' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                )}
                {tab === 'voice' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                )}
                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              </button>
            ))}
          </div>
          
          {error && (
            <div className="omu-error-message">
              <div className="omu-error-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="omu-error-icon">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div className="omu-error-text">{error}</div>
                <button 
                  className="omu-error-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    setError('');
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          )}
          
          <div className="omu-tab-content">
            {activeTab === 'colors' && (
              <div className="omu-colors-section">
                <div className="omu-color-grid">
                  <div className="omu-color-field">
                    <label>Primary Color</label>
                    <div className="omu-color-input-group">
                      <input 
                        type="color" 
                        value={brandGuidelines.colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                      />
                      <input 
                        type="text" 
                        value={brandGuidelines.colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="omu-color-field">
                    <label>Secondary Color</label>
                    <div className="omu-color-input-group">
                      <input 
                        type="color" 
                        value={brandGuidelines.colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                      />
                      <input 
                        type="text" 
                        value={brandGuidelines.colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="omu-color-field">
                    <label>Accent Color</label>
                    <div className="omu-color-input-group">
                      <input 
                        type="color" 
                        value={brandGuidelines.colors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                      />
                      <input 
                        type="text" 
                        value={brandGuidelines.colors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="omu-color-field">
                    <label>Text Color</label>
                    <div className="omu-color-input-group">
                      <input 
                        type="color" 
                        value={brandGuidelines.colors.text}
                        onChange={(e) => handleColorChange('text', e.target.value)}
                      />
                      <input 
                        type="text" 
                        value={brandGuidelines.colors.text}
                        onChange={(e) => handleColorChange('text', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="omu-color-field">
                    <label>Background Color</label>
                    <div className="omu-color-input-group">
                      <input 
                        type="color" 
                        value={brandGuidelines.colors.background}
                        onChange={(e) => handleColorChange('background', e.target.value)}
                      />
                      <input 
                        type="text" 
                        value={brandGuidelines.colors.background}
                        onChange={(e) => handleColorChange('background', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="omu-colors-preview">
                  <div className="omu-color-preview-item" style={{ backgroundColor: brandGuidelines.colors.primary }}>
                    Primary
                  </div>
                  <div className="omu-color-preview-item" style={{ backgroundColor: brandGuidelines.colors.secondary }}>
                    Secondary
                  </div>
                  <div className="omu-color-preview-item" style={{ backgroundColor: brandGuidelines.colors.accent }}>
                    Accent
                  </div>
                  <div className="omu-color-preview-item" style={{ 
                    backgroundColor: brandGuidelines.colors.background,
                    color: brandGuidelines.colors.text,
                    border: '1px solid #e0e0e0'
                  }}>
                    Text
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'typography' && (
              <div className="omu-typography-section">
                <div className="omu-typography-grid">
                  <div className="omu-typography-field">
                    <label>Heading Font</label>
                    <select 
                      value={brandGuidelines.typography.headingFont}
                      onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
                    >
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
                      <option value="'Times New Roman', Times, serif">Times New Roman</option>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="'Courier New', Courier, monospace">Courier New</option>
                      <option value="Verdana, sans-serif">Verdana</option>
                      <option value="Tahoma, sans-serif">Tahoma</option>
                      <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                      <option value="Impact, sans-serif">Impact</option>
                      <option value="'Open Sans', sans-serif">Open Sans</option>
                      <option value="'Roboto', sans-serif">Roboto</option>
                      <option value="'Montserrat', sans-serif">Montserrat</option>
                      <option value="'Lato', sans-serif">Lato</option>
                      <option value="'Poppins', sans-serif">Poppins</option>
                    </select>
                  </div>
                  
                  <div className="omu-typography-field">
                    <label>Body Font</label>
                    <select 
                      value={brandGuidelines.typography.bodyFont}
                      onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
                    >
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
                      <option value="'Times New Roman', Times, serif">Times New Roman</option>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="'Courier New', Courier, monospace">Courier New</option>
                      <option value="Verdana, sans-serif">Verdana</option>
                      <option value="Tahoma, sans-serif">Tahoma</option>
                      <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                      <option value="'Open Sans', sans-serif">Open Sans</option>
                      <option value="'Roboto', sans-serif">Roboto</option>
                      <option value="'Lora', serif">Lora</option>
                      <option value="'Source Sans Pro', sans-serif">Source Sans Pro</option>
                      <option value="'PT Sans', sans-serif">PT Sans</option>
                    </select>
                  </div>
                  
                  <div className="omu-typography-field">
                    <label>Heading Weight</label>
                    <select 
                      value={brandGuidelines.typography.headingWeight}
                      onChange={(e) => handleTypographyChange('headingWeight', e.target.value)}
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="bolder">Bolder</option>
                      <option value="lighter">Lighter</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="300">300</option>
                      <option value="400">400</option>
                      <option value="500">500</option>
                      <option value="600">600</option>
                      <option value="700">700</option>
                      <option value="800">800</option>
                      <option value="900">900</option>
                    </select>
                  </div>
                  
                  <div className="omu-typography-field">
                    <label>Body Weight</label>
                    <select 
                      value={brandGuidelines.typography.bodyWeight}
                      onChange={(e) => handleTypographyChange('bodyWeight', e.target.value)}
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="bolder">Bolder</option>
                      <option value="lighter">Lighter</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="300">300</option>
                      <option value="400">400</option>
                      <option value="500">500</option>
                      <option value="600">600</option>
                      <option value="700">700</option>
                      <option value="800">800</option>
                      <option value="900">900</option>
                    </select>
                  </div>
                </div>
                
                <div className="omu-typography-preview">
                  <h4 style={{ 
                    fontFamily: brandGuidelines.typography.headingFont,
                    fontWeight: brandGuidelines.typography.headingWeight,
                    color: brandGuidelines.colors.primary
                  }}>
                    This is a heading preview
                  </h4>
                  <p style={{ 
                    fontFamily: brandGuidelines.typography.bodyFont,
                    fontWeight: brandGuidelines.typography.bodyWeight,
                    color: brandGuidelines.colors.text
                  }}>
                    This is a body text preview. It demonstrates how your typography settings will look in your designs.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'logo' && (
              <div className="omu-logo-section">
                <div className="omu-logo-upload-container">
                  <input 
                    type="file" 
                    id="logo-upload" 
                    accept="image/*" 
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                    className="omu-file-input"
                  />
                  <label htmlFor="logo-upload" className="omu-upload-button">
                    {isUploading ? (
                      <span className="omu-button-content">
                        <span className="omu-button-spinner"></span>
                        Uploading...
                      </span>
                    ) : (
                      <span className="omu-button-content">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Upload Logo
                      </span>
                    )}
                  </label>
                </div>
                
                <div className="omu-logo-preview">
                  {brandGuidelines.logo ? (
                    <div className="omu-logo-preview-container">
                      <img 
                        src={brandGuidelines.logo} 
                        alt="Brand Logo" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/200x100?text=Logo+Failed+to+Load';
                        }}
                      />
                      <button 
                        className="omu-logo-remove" 
                        onClick={() => onBrandGuidelinesChange({
                          ...brandGuidelines,
                          logo: null
                        })}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Remove Logo
                      </button>
                    </div>
                  ) : (
                    <div className="omu-logo-placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <span>No logo uploaded</span>
                    </div>
                  )}
                </div>
                
                <div className="omu-logo-tips">
                  <h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    Logo Tips
                  </h4>
                  <ul>
                    <li>Use a transparent PNG for best results</li>
                    <li>Keep file size under 1MB</li>
                    <li>Optimal dimensions: 500px x 200px</li>
                    <li>SVG format works best for scalable logos</li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'voice' && (
              <div className="omu-voice-section">
                <h4>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                  Brand Voice
                </h4>
                <p>Select the tone that best represents your brand:</p>
                
                <div className="omu-voice-options">
                  <div 
                    className={`omu-voice-option ${brandGuidelines.voice === 'professional' ? 'selected' : ''}`}
                    onClick={() => handleVoiceChange('professional')}
                  >
                    <h5>Professional</h5>
                    <p>Authoritative, trustworthy, and expert-oriented communication style</p>
                  </div>
                  
                  <div 
                    className={`omu-voice-option ${brandGuidelines.voice === 'casual' ? 'selected' : ''}`}
                    onClick={() => handleVoiceChange('casual')}
                  >
                    <h5>Casual</h5>
                    <p>Friendly, approachable, and conversational tone</p>
                  </div>
                  
                  <div 
                    className={`omu-voice-option ${brandGuidelines.voice === 'energetic' ? 'selected' : ''}`}
                    onClick={() => handleVoiceChange('energetic')}
                  >
                    <h5>Energetic</h5>
                    <p>Dynamic, enthusiastic, and action-oriented messaging</p>
                  </div>
                  
                  <div 
                    className={`omu-voice-option ${brandGuidelines.voice === 'luxurious' ? 'selected' : ''}`}
                    onClick={() => handleVoiceChange('luxurious')}
                  >
                    <h5>Luxurious</h5>
                    <p>Sophisticated, exclusive, and premium communication style</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="omu-guidelines-footer">
            <button 
              className="omu-save-button"
              onClick={() => {
                localStorage.setItem('omu-brand-guidelines', JSON.stringify(brandGuidelines));
                setIsExpanded(false);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

BrandGuidelines.propTypes = {
  brandGuidelines: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      secondary: PropTypes.string.isRequired,
      accent: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      background: PropTypes.string.isRequired
    }).isRequired,
    typography: PropTypes.shape({
      headingFont: PropTypes.string.isRequired,
      bodyFont: PropTypes.string.isRequired,
      headingWeight: PropTypes.string.isRequired,
      bodyWeight: PropTypes.string.isRequired
    }).isRequired,
    logo: PropTypes.string,
    voice: PropTypes.string.isRequired
  }).isRequired,
  onBrandGuidelinesChange: PropTypes.func.isRequired
};

export default BrandGuidelines; 