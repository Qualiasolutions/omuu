import axios, { AxiosResponse } from 'axios';

// API key from user
const API_KEY = '4a6c2169-01f9-4e0d-89e3-d02d44143823';

// Base URL for Templated API
const BASE_URL = 'https://api.templated.io/v1';

// Axios instance with common configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
});

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

// Types
export interface Template {
  id: string;
  name: string;
  description?: string;
  width: number;
  height: number;
  thumbnail: string;
  layersCount: number;
  user?: {
    id: string;
    name: string;
  };
  folderId?: string;
}

export interface Layer {
  id: string;
  name: string;
  type: string; // 'text' | 'image' | 'shape', etc.
  properties: Record<string, any>;
}

export interface RenderRequest {
  template: string;
  format?: 'jpg' | 'png' | 'webp' | 'pdf';
  transparent?: boolean;
  background?: string;
  width?: number;
  height?: number;
  async?: boolean;
  webhook_url?: string;
  layers: Record<string, LayerData>;
}

export interface LayerData {
  text?: string;
  image_url?: string;
  color?: string;
  color_2?: string;
  background?: string;
  font_family?: string;
  font_family_2?: string;
  font_size?: string;
  autofit?: 'width' | 'height';
  border_width?: number;
  border_color?: string;
  border_radius?: string;
  fill?: string;
  stroke?: string;
  hide?: boolean;
  link?: string;
  x?: number;
  y?: number;
  rotation?: number;
  width?: number;
  height?: number;
}

export interface Render {
  id: string;
  url: string;
  width: number;
  height: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  format: string;
  templateId: string;
  templateName: string;
  createdAt: string;
}

// API functions
export const templatedApi = {
  // List all templates
  listTemplates: async (): Promise<Template[]> => {
    try {
      const response: AxiosResponse<{ templates: Template[] }> = await api.get('/templates');
      return response.data.templates || [];
    } catch (error) {
      console.error('Error listing templates:', error);
      throw error;
    }
  },

  // Get template details
  getTemplate: async (templateId: string): Promise<Template> => {
    try {
      const response: AxiosResponse<Template> = await api.get(`/templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting template ${templateId}:`, error);
      throw error;
    }
  },

  // Get template layers
  getTemplateLayers: async (templateId: string): Promise<Layer[]> => {
    try {
      const response: AxiosResponse<{ layers: Layer[] }> = await api.get(`/templates/${templateId}/layers`);
      return response.data.layers || [];
    } catch (error) {
      console.error(`Error getting layers for template ${templateId}:`, error);
      throw error;
    }
  },

  // Create a render
  createRender: async (renderRequest: RenderRequest): Promise<Render> => {
    try {
      const response: AxiosResponse<Render> = await api.post('/render', renderRequest);
      return response.data;
    } catch (error) {
      console.error('Error creating render:', error);
      throw error;
    }
  },

  // Get render status
  getRender: async (renderId: string): Promise<Render> => {
    try {
      const response: AxiosResponse<Render> = await api.get(`/render/${renderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting render ${renderId}:`, error);
      throw error;
    }
  },

  // Poll for render completion
  pollRenderCompletion: async (renderId: string, interval = 2000, maxAttempts = 30): Promise<Render> => {
    return new Promise(async (resolve, reject) => {
      let attempts = 0;
      
      const checkStatus = async () => {
        try {
          const render = await templatedApi.getRender(renderId);
          
          if (render.status === 'COMPLETED') {
            return resolve(render);
          }
          
          if (render.status === 'FAILED') {
            return reject(new Error('Render failed'));
          }
          
          attempts++;
          if (attempts >= maxAttempts) {
            return reject(new Error('Maximum polling attempts reached'));
          }
          
          setTimeout(checkStatus, interval);
        } catch (error) {
          reject(error);
        }
      };
      
      checkStatus();
    });
  }
};

export default templatedApi; 