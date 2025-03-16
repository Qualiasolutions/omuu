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
    <div className="omu-brand-guidelines">
      <div className="omu-panel-header" onClick={toggleExpand}>
        <h3>Brand Guidelines</h3>
        <span className="omu-toggle-icon">{isExpanded ? '−' : '+'}</span>
      </div>
      
      {isExpanded && (
        <div className="omu-panel-content">
          <div className="omu-tabs">
            <div 
              className={`omu-tab ${activeTab === 'colors' ? 'active' : ''}`}
              onClick={() => setActiveTab('colors')}
            >
              Colors
            </div>
            <div 
              className={`omu-tab ${activeTab === 'typography' ? 'active' : ''}`}
              onClick={() => setActiveTab('typography')}
            >
              Typography
            </div>
            <div 
              className={`omu-tab ${activeTab === 'logo' ? 'active' : ''}`}
              onClick={() => setActiveTab('logo')}
            >
              Logo
            </div>
            <div 
              className={`omu-tab ${activeTab === 'voice' ? 'active' : ''}`}
              onClick={() => setActiveTab('voice')}
            >
              Voice
            </div>
          </div>
          
          {error && <p className="omu-error-message">{error}</p>}
          
          <div className="omu-tab-content">
            {activeTab === 'colors' && (
              <div className="omu-colors-section">
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
                <div className="omu-logo-upload">
                  <input 
                    type="file" 
                    id="logo-upload" 
                    accept="image/*" 
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                  />
                  <label htmlFor="logo-upload" className={`omu-upload-button ${isUploading ? 'disabled' : ''}`}>
                    {isUploading ? 'Uploading...' : 'Upload Logo'}
                  </label>
                  
                  {isUploading && <LoadingSpinner size="small" />}
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
                        Remove Logo
                      </button>
                    </div>
                  ) : (
                    <div className="omu-logo-placeholder">
                      <span>No logo uploaded</span>
                    </div>
                  )}
                </div>
                
                <div className="omu-logo-tips">
                  <h4>Logo Tips:</h4>
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
                <h4>Brand Voice</h4>
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