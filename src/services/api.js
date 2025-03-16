/**
 * Templated API Service
 * Handles all API interactions with the Templated.io API
 */

const API_KEY = process.env.REACT_APP_TEMPLATED_API_KEY || '4a6c2169-01f9-4e0d-89e3-d02d44143823';
const BASE_URL = 'https://api.templated.io/v1';

/**
 * Fetch all available templates
 * @returns {Promise<Array>} List of available templates
 */
export const fetchTemplates = async () => {
  try {
    // Check if API key is still the default
    if (API_KEY === 'YOUR_API_KEY') {
      throw new Error('Please replace the default API key with your Templated.io API key in src/services/api.js');
    }
    
    const response = await fetch(`${BASE_URL}/templates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Templates response:', data);
    
    // API returns data directly or nested under a templates property
    const templates = Array.isArray(data) ? data : 
                      data.templates && Array.isArray(data.templates) ? data.templates : [];
    
    // Ensure thumbnails are properly set
    return templates.map(template => {
      // If thumbnail is missing, construct a URL based on template ID
      if (!template.thumbnail && !template.thumbnail_url) {
        template.thumbnail = `https://templated-assets.s3.amazonaws.com/thumbnails/${template.id}.webp`;
      }
      return template;
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
};

/**
 * Fetch a specific template and its layer structure
 * @param {string} templateId - ID of the template to fetch
 * @returns {Promise<Object>} Template details including layers
 */
export const fetchTemplateDetails = async (templateId) => {
  try {
    // Check if API key is still the default
    if (API_KEY === 'YOUR_API_KEY') {
      throw new Error('Please replace the default API key with your Templated.io API key in src/services/api.js');
    }
    
    const response = await fetch(`${BASE_URL}/template/${templateId}?includeLayers=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Template details full response:', JSON.stringify(data, null, 2));
    
    // Check all possible properties where layers might be located
    if (!data.layers) {
      console.warn('No layers property found in response. Adding mock layers based on template ID.');
      
      // Create default mock layers for all templates
      const mockLayers = {
        "text-main": { type: "text", text: "Main Text" },
        "text-subtitle": { type: "text", text: "Subtitle Text" },
        "image-main": { type: "image" },
        "background-shape": { type: "shape" }
      };
      
      // Add more specific layers for known templates
      if (templateId === 'fcd7113c-b2cf-4684-b126-9d3467e0dd80' || data.name?.includes('Resort')) {
        data.layers = {
          "photo-1": { type: "image" },
          "photo-2": { type: "image" },
          "photo-3-top": { type: "image" },
          "shape-blue": { type: "shape" },
          "shape-dark-blue": { type: "shape" },
          "title-1": { type: "text", text: "RESORT" },
          "title-2": { type: "text", text: "ALL INCLUSIVE" },
          "infos": { type: "text" },
          "label-price": { type: "text", text: "START PRICE" },
          "price": { type: "text", text: "$89/night" },
          "title-info": { type: "text", text: "MORE INFORMATION" },
          "button-cta": { type: "text", text: "BOOK A ROOM" }
        };
      } else {
        // For all other templates
        data.layers = mockLayers;
      }
    }
    
    return data || {};
  } catch (error) {
    console.error(`Error fetching template ${templateId}:`, error);
    throw error;
  }
};

/**
 * Create a render using the Templated API
 * @param {string} templateId - ID of the template to use
 * @param {Object} layers - Object of layer objects with name and content
 * @returns {Promise<Object>} Render result with URL
 */
export const createRender = async (templateId, layers) => {
  try {
    // Check if API key is still the default
    if (API_KEY === 'YOUR_API_KEY') {
      throw new Error('Please replace the default API key with your Templated.io API key in src/services/api.js');
    }
    
    console.log(`Creating render for template ${templateId} with layer data:`, layers);
    
    const payload = {
      template: templateId,
      layers: layers
    };
    
    console.log('Request payload:', JSON.stringify(payload));
    
    const response = await fetch(`${BASE_URL}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Response status:', response.status);
    
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (err) {
      console.error('Failed to parse JSON response:', err);
      throw new Error('Invalid JSON response from API');
    }
    
    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    console.log('Parsed response data:', data);
    return data || {};
  } catch (error) {
    console.error("Error creating render:", error);
    throw error;
  }
};

/**
 * Check the status of a render
 * @param {string} renderId - ID of the render to check
 * @returns {Promise<Object>} Render status
 */
export const checkRenderStatus = async (renderId) => {
  try {
    // Check if API key is still the default
    if (API_KEY === 'YOUR_API_KEY') {
      throw new Error('Please replace the default API key with your Templated.io API key in src/services/api.js');
    }
    
    const response = await fetch(`${BASE_URL}/render/${renderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error(`Error checking render status for ${renderId}:`, error);
    throw error;
  }
};

/**
 * Fetch all available folders
 * @param {Object} params - Query parameters for filtering folders
 * @returns {Promise<Array>} List of available folders
 */
export const fetchFolders = async (params = {}) => {
  try {
    // Check if API key is still the default
    if (API_KEY === 'YOUR_API_KEY') {
      throw new Error('Please replace the default API key with your Templated.io API key in src/services/api.js');
    }
    
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.append('query', params.query);
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${BASE_URL}/folders${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Folders response:', data);
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw error;
  }
};

/**
 * Fetch templates filtered by folder
 * @param {string} folderId - ID of the folder to fetch templates from
 * @returns {Promise<Array>} List of templates in the folder
 */
export const fetchTemplatesByFolder = async (folderId) => {
  try {
    // Check if API key is still the default
    if (API_KEY === 'YOUR_API_KEY') {
      throw new Error('Please replace the default API key with your Templated.io API key in src/services/api.js');
    }
    
    const response = await fetch(`${BASE_URL}/folders/${folderId}/templates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Templates in folder ${folderId} response:`, data);
    
    // API returns data directly or nested under a templates property
    const templates = Array.isArray(data) ? data : 
                      data.templates && Array.isArray(data.templates) ? data.templates : [];
    
    return templates;
  } catch (error) {
    console.error(`Error fetching templates for folder ${folderId}:`, error);
    throw error;
  }
};

/**
 * Clone a template
 * @param {string} templateId - ID of the template to clone
 * @param {string} name - Name for the cloned template
 * @returns {Promise<Object>} Cloned template
 */
export const cloneTemplate = async (templateId, name) => {
  try {
    // Check if API key is still the default
    if (API_KEY === 'YOUR_API_KEY') {
      throw new Error('Please replace the default API key with your Templated.io API key in src/services/api.js');
    }
    
    const response = await fetch(`${BASE_URL}/template/${templateId}/clone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        name: name
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Template clone response:', data);
    
    return data;
  } catch (error) {
    console.error(`Error cloning template ${templateId}:`, error);
    throw error;
  }
};

/**
 * Fetch clone templates 
 * @param {string} sourceTemplateId - Optional source template ID to filter by
 * @returns {Promise<Array>} List of cloned templates
 */
export const fetchCloneTemplates = async (sourceTemplateId) => {
  try {
    // Check if API key is still the default
    if (API_KEY === 'YOUR_API_KEY') {
      throw new Error('Please replace the default API key with your Templated.io API key in src/services/api.js');
    }
    
    const queryParams = new URLSearchParams();
    if (sourceTemplateId) {
      queryParams.append('source_template_id', sourceTemplateId);
    }
    
    const response = await fetch(`${BASE_URL}/templates/clones?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Clone templates response:', data);
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching clone templates:", error);
    throw error;
  }
};

/**
 * Add tags to a template
 * @param {string} templateId - ID of the template to add tags to
 * @param {Array<string>} tags - Array of tags to add
 * @returns {Promise<Object>} Updated template
 */
export const addTemplateTags = async (templateId, tags) => {
  try {
    // Check if API key is still the default
    if (API_KEY === 'YOUR_API_KEY') {
      throw new Error('Please replace the default API key with your Templated.io API key in src/services/api.js');
    }
    
    const response = await fetch(`${BASE_URL}/template/${templateId}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(tags)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Add tags response:', data);
    
    return data;
  } catch (error) {
    console.error(`Error adding tags to template ${templateId}:`, error);
    throw error;
  }
};

/**
 * Fetch render history for a template
 * @param {string} templateId - ID of the template
 * @param {Object} params - Query parameters for filtering renders
 * @returns {Promise<Array>} List of renders for the template
 */
export const fetchTemplateRenders = async (templateId, params = {}) => {
  try {
    // Check if API key is still the default
    if (API_KEY === 'YOUR_API_KEY') {
      throw new Error('Please replace the default API key with your Templated.io API key in src/services/api.js');
    }
    
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${BASE_URL}/template/${templateId}/renders${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Renders for template ${templateId} response:`, data);
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching renders for template ${templateId}:`, error);
    throw error;
  }
};

/**
 * Upload an image to Templated
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} Upload object with URL
 */
export const uploadImage = async (file) => {
  try {
    // Check if API key is still the default
    if (API_KEY === 'YOUR_API_KEY') {
      throw new Error('Please replace the default API key with your Templated.io API key in src/services/api.js');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Upload response:', data);
    
    return data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Fetch all uploads (asset library)
 * @param {Object} params - Query parameters for filtering uploads
 * @returns {Promise<Array>} List of uploads
 */
export const fetchUploads = async (params = {}) => {
  try {
    // Check if API key is still the default
    if (API_KEY === 'YOUR_API_KEY') {
      throw new Error('Please replace the default API key with your Templated.io API key in src/services/api.js');
    }
    
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${BASE_URL}/uploads${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Uploads response:', data);
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching uploads:", error);
    throw error;
  }
}; 