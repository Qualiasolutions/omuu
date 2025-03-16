import React, { useState } from 'react';
import PropTypes from 'prop-types';

const LayerEditor = ({ layers, onLayerUpdate, brandGuidelines }) => {
  const [expandedLayer, setExpandedLayer] = useState(null);

  const toggleLayerExpand = (layerName) => {
    setExpandedLayer(expandedLayer === layerName ? null : layerName);
  };

  const updateLayerProperty = (layerName, property, value) => {
    const updatedLayer = {
      ...layers[layerName],
      [property]: value
    };
    
    onLayerUpdate(layerName, updatedLayer);
  };

  const applyBrandToLayer = (layerName) => {
    const layer = layers[layerName];
    let updatedLayer = { ...layer };
    
    // Apply different properties based on layer type
    if (layer.type === 'text') {
      if (layerName.includes('title') || layerName.includes('heading')) {
        updatedLayer = {
          ...updatedLayer,
          color: brandGuidelines.brandColors.primary,
          font_family: brandGuidelines.typography.headingFont,
          font_size: brandGuidelines.typography.headingSize,
          font_weight: brandGuidelines.typography.fontWeight
        };
      } else {
        updatedLayer = {
          ...updatedLayer,
          color: brandGuidelines.brandColors.text,
          font_family: brandGuidelines.typography.bodyFont,
          font_size: brandGuidelines.typography.bodySize
        };
      }
    } else if (layer.type === 'shape') {
      updatedLayer = {
        ...updatedLayer,
        fill: layerName.includes('background') 
          ? brandGuidelines.brandColors.background 
          : brandGuidelines.brandColors.secondary
      };
    }
    
    onLayerUpdate(layerName, updatedLayer);
  };

  const getEditorForLayerType = (layerName, layer) => {
    switch (layer.type) {
      case 'text':
        return (
          <div className="omu-layer-editor-fields">
            <div className="omu-editor-field">
              <label>Text</label>
              <input
                type="text"
                value={layer.text || ''}
                onChange={(e) => updateLayerProperty(layerName, 'text', e.target.value)}
              />
            </div>

            <div className="omu-editor-field">
              <label>Color</label>
              <div className="omu-color-picker">
                <input
                  type="color"
                  value={layer.color || '#000000'}
                  onChange={(e) => updateLayerProperty(layerName, 'color', e.target.value)}
                />
                <input
                  type="text"
                  value={layer.color || '#000000'}
                  onChange={(e) => updateLayerProperty(layerName, 'color', e.target.value)}
                />
              </div>
            </div>

            <div className="omu-editor-field">
              <label>Font Family</label>
              <select
                value={layer.font_family || ''}
                onChange={(e) => updateLayerProperty(layerName, 'font_family', e.target.value)}
              >
                <option value="">Default</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Helvetica, sans-serif">Helvetica</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Tahoma, sans-serif">Tahoma</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="Times New Roman, serif">Times New Roman</option>
                <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
                <option value="Courier New, monospace">Courier New</option>
                <option value="Segoe UI, sans-serif">Segoe UI</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Open Sans, sans-serif">Open Sans</option>
                <option value="Montserrat, sans-serif">Montserrat</option>
              </select>
            </div>

            <div className="omu-editor-field">
              <label>Font Size</label>
              <select
                value={layer.font_size || ''}
                onChange={(e) => updateLayerProperty(layerName, 'font_size', e.target.value)}
              >
                <option value="">Default</option>
                {Array.from({ length: 17 }, (_, i) => i + 8).map(size => (
                  <option key={size} value={`${size}px`}>{size}px</option>
                ))}
              </select>
            </div>

            <div className="omu-editor-field">
              <label>Font Weight</label>
              <select
                value={layer.font_weight || ''}
                onChange={(e) => updateLayerProperty(layerName, 'font_weight', e.target.value)}
              >
                <option value="">Default</option>
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi-Bold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>

            <div className="omu-editor-field">
              <label>Background</label>
              <div className="omu-color-picker">
                <input
                  type="color"
                  value={layer.background || '#ffffff'}
                  onChange={(e) => updateLayerProperty(layerName, 'background', e.target.value)}
                />
                <input
                  type="text"
                  value={layer.background || '#ffffff'}
                  onChange={(e) => updateLayerProperty(layerName, 'background', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="omu-layer-editor-fields">
            <div className="omu-editor-field">
              <label>Image URL</label>
              <input
                type="text"
                value={layer.image_url || ''}
                onChange={(e) => updateLayerProperty(layerName, 'image_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="omu-editor-field">
              <label>Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      updateLayerProperty(layerName, 'image_url', event.target.result);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
        );

      case 'shape':
        return (
          <div className="omu-layer-editor-fields">
            <div className="omu-editor-field">
              <label>Fill Color</label>
              <div className="omu-color-picker">
                <input
                  type="color"
                  value={layer.fill || '#000000'}
                  onChange={(e) => updateLayerProperty(layerName, 'fill', e.target.value)}
                />
                <input
                  type="text"
                  value={layer.fill || '#000000'}
                  onChange={(e) => updateLayerProperty(layerName, 'fill', e.target.value)}
                />
              </div>
            </div>
            <div className="omu-editor-field">
              <label>Border Color</label>
              <div className="omu-color-picker">
                <input
                  type="color"
                  value={layer.stroke || '#000000'}
                  onChange={(e) => updateLayerProperty(layerName, 'stroke', e.target.value)}
                />
                <input
                  type="text"
                  value={layer.stroke || '#000000'}
                  onChange={(e) => updateLayerProperty(layerName, 'stroke', e.target.value)}
                />
              </div>
            </div>
            <div className="omu-editor-field">
              <label>Border Width</label>
              <input
                type="number"
                min="0"
                max="20"
                value={layer.stroke_width || 0}
                onChange={(e) => updateLayerProperty(layerName, 'stroke_width', parseInt(e.target.value, 10))}
              />
            </div>
            <div className="omu-editor-field">
              <label>Border Radius</label>
              <input
                type="number"
                min="0"
                max="100"
                value={layer.border_radius || 0}
                onChange={(e) => updateLayerProperty(layerName, 'border_radius', parseInt(e.target.value, 10))}
              />
            </div>
          </div>
        );

      default:
        return <div>No editor available for this layer type</div>;
    }
  };

  return (
    <div className="omu-layer-editor">
      <h3>Edit Template Layers</h3>
      <div className="omu-layers-list">
        {Object.entries(layers).map(([layerName, layer]) => (
          <div key={layerName} className="omu-layer-item">
            <div 
              className="omu-layer-header"
              onClick={() => toggleLayerExpand(layerName)}
            >
              <span className="omu-layer-name">
                {layerName} ({layer.type})
              </span>
              <div className="omu-layer-controls">
                <button 
                  className="omu-apply-brand" 
                  onClick={(e) => {
                    e.stopPropagation();
                    applyBrandToLayer(layerName);
                  }}
                  title="Apply brand guidelines to this layer"
                >
                  Apply Brand
                </button>
                <span className="omu-toggle-icon">
                  {expandedLayer === layerName ? '−' : '+'}
                </span>
              </div>
            </div>
            
            {expandedLayer === layerName && (
              <div className="omu-layer-editor-content">
                {getEditorForLayerType(layerName, layer)}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="omu-editor-actions">
        <button 
          className="omu-apply-all-button"
          onClick={() => {
            Object.keys(layers).forEach(layerName => {
              applyBrandToLayer(layerName);
            });
          }}
        >
          Apply Brand Guidelines to All Layers
        </button>
      </div>
    </div>
  );
};

LayerEditor.propTypes = {
  layers: PropTypes.object.isRequired,
  onLayerUpdate: PropTypes.func.isRequired,
  brandGuidelines: PropTypes.object.isRequired
};

export default LayerEditor; 