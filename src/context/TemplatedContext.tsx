import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import templatedApi, { Template, Layer, RenderRequest, Render, LayerData } from '../services/api';

interface TemplatedContextType {
  templates: Template[];
  selectedTemplate: Template | null;
  templateLayers: Layer[];
  isLoading: boolean;
  error: string | null;
  render: Render | null;
  layerValues: Record<string, LayerData>;
  loadTemplates: () => Promise<void>;
  selectTemplate: (templateId: string) => Promise<void>;
  updateLayerValue: (layerId: string, data: LayerData) => void;
  createRender: () => Promise<void>;
}

const TemplatedContext = createContext<TemplatedContextType | undefined>(undefined);

export const useTemplated = (): TemplatedContextType => {
  const context = useContext(TemplatedContext);
  if (!context) {
    throw new Error('useTemplated must be used within a TemplatedProvider');
  }
  return context;
};

interface TemplatedProviderProps {
  children: ReactNode;
}

export const TemplatedProvider: React.FC<TemplatedProviderProps> = ({ children }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateLayers, setTemplateLayers] = useState<Layer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [render, setRender] = useState<Render | null>(null);
  const [layerValues, setLayerValues] = useState<Record<string, LayerData>>({});

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const templates = await templatedApi.listTemplates();
      setTemplates(templates);
    } catch (error) {
      setError('Failed to load templates');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectTemplate = useCallback(async (templateId: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedTemplate(null);
    setTemplateLayers([]);
    setLayerValues({});
    
    try {
      const [template, layers] = await Promise.all([
        templatedApi.getTemplate(templateId),
        templatedApi.getTemplateLayers(templateId)
      ]);
      
      setSelectedTemplate(template);
      setTemplateLayers(layers);
      
      // Initialize layer values with empty objects
      const initialLayerValues: Record<string, LayerData> = {};
      layers.forEach(layer => {
        initialLayerValues[layer.name] = {};
      });
      
      setLayerValues(initialLayerValues);
    } catch (error) {
      setError(`Failed to load template ${templateId}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLayerValue = useCallback((layerId: string, data: LayerData) => {
    setLayerValues(prev => ({
      ...prev,
      [layerId]: {
        ...prev[layerId],
        ...data
      }
    }));
  }, []);

  const createRender = useCallback(async () => {
    if (!selectedTemplate) {
      setError('No template selected');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setRender(null);
    
    try {
      const renderRequest: RenderRequest = {
        template: selectedTemplate.id,
        layers: layerValues
      };
      
      const renderResponse = await templatedApi.createRender(renderRequest);
      
      // Poll for render completion
      const completedRender = await templatedApi.pollRenderCompletion(renderResponse.id);
      setRender(completedRender);
    } catch (error) {
      setError('Failed to create render');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTemplate, layerValues]);

  const value: TemplatedContextType = {
    templates,
    selectedTemplate,
    templateLayers,
    isLoading,
    error,
    render,
    layerValues,
    loadTemplates,
    selectTemplate,
    updateLayerValue,
    createRender
  };

  return (
    <TemplatedContext.Provider value={value}>
      {children}
    </TemplatedContext.Provider>
  );
};

export default TemplatedProvider; 