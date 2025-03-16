import React from 'react';
import { useTemplated } from '../context/TemplatedContext';
import { Layer, LayerData } from '../services/api';

const TemplateEditor: React.FC = () => {
  const { 
    selectedTemplate, 
    templateLayers, 
    layerValues,
    updateLayerValue,
    isLoading, 
    error,
    createRender
  } = useTemplated();

  if (!selectedTemplate) {
    return null;
  }

  if (isLoading) {
    return <div className="p-4">Loading template details...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Template: {selectedTemplate.name}</h2>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <div className="flex items-center">
          <div className="w-24 h-24 mr-4">
            <img 
              src={selectedTemplate.thumbnail} 
              alt={selectedTemplate.name} 
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div>
            <h3 className="font-semibold">{selectedTemplate.name}</h3>
            <p className="text-sm text-gray-600">{selectedTemplate.width} × {selectedTemplate.height}</p>
            {selectedTemplate.description && (
              <p className="mt-1 text-sm">{selectedTemplate.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Layer Properties</h3>
        {templateLayers.length === 0 ? (
          <p>No editable layers found</p>
        ) : (
          <div className="space-y-4">
            {templateLayers.map((layer) => (
              <LayerEditor 
                key={layer.id} 
                layer={layer} 
                value={layerValues[layer.name] || {}} 
                onChange={(data) => updateLayerValue(layer.name, data)} 
              />
            ))}
          </div>
        )}
      </div>

      <button
        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
        onClick={createRender}
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create Instagram Post'}
      </button>
    </div>
  );
};

interface LayerEditorProps {
  layer: Layer;
  value: LayerData;
  onChange: (data: LayerData) => void;
}

const LayerEditor: React.FC<LayerEditorProps> = ({ layer, value, onChange }) => {
  const handleChange = <K extends keyof LayerData>(
    key: K, 
    val: LayerData[K]
  ) => {
    onChange({ ...value, [key]: val });
  };

  // Only show relevant inputs based on layer type
  const renderInputs = () => {
    const type = layer.type.toLowerCase();
    
    if (type.includes('text')) {
      return (
        <>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Text</label>
            <input 
              type="text" 
              value={value.text || ''} 
              onChange={(e) => handleChange('text', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter text"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Text Color</label>
              <div className="flex">
                <input 
                  type="color" 
                  value={value.color || '#000000'} 
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="w-10 h-10 border rounded"
                />
                <input 
                  type="text" 
                  value={value.color || ''} 
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="flex-1 p-2 border rounded ml-2"
                  placeholder="#000000"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Background Color</label>
              <div className="flex">
                <input 
                  type="color" 
                  value={value.background || '#ffffff'} 
                  onChange={(e) => handleChange('background', e.target.value)}
                  className="w-10 h-10 border rounded"
                />
                <input 
                  type="text" 
                  value={value.background || ''} 
                  onChange={(e) => handleChange('background', e.target.value)}
                  className="flex-1 p-2 border rounded ml-2"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">Font Size</label>
              <input 
                type="text" 
                value={value.font_size || ''} 
                onChange={(e) => handleChange('font_size', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="16px"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Font Family</label>
              <input 
                type="text" 
                value={value.font_family || ''} 
                onChange={(e) => handleChange('font_family', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Arial"
              />
            </div>
          </div>
        </>
      );
    }
    
    if (type.includes('image')) {
      return (
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input 
            type="text" 
            value={value.image_url || ''} 
            onChange={(e) => handleChange('image_url', e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/image.jpg"
          />
          {value.image_url && (
            <div className="mt-2 max-w-xs">
              <img 
                src={value.image_url} 
                alt="Preview" 
                className="w-full h-auto rounded border"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
        </div>
      );
    }
    
    // For other layer types or fallback
    return (
      <div className="text-gray-500 italic">
        This layer type ({layer.type}) has limited editable properties.
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded border">
      <h4 className="font-semibold mb-2">{layer.name}</h4>
      <div className="text-xs text-gray-500 mb-3">Type: {layer.type}</div>
      
      {renderInputs()}
      
      <div className="mt-2">
        <label className="flex items-center">
          <input 
            type="checkbox" 
            checked={!!value.hide} 
            onChange={(e) => handleChange('hide', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">Hide this layer</span>
        </label>
      </div>
    </div>
  );
};

export default TemplateEditor; 