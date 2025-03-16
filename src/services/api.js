// src/services/api.js
// Integration with Templated.io API

// Configuration for Templated.io
const TEMPLATED_API_URL = process.env.REACT_APP_TEMPLATED_API_URL || 'https://api.templated.io/v1';
const TEMPLATED_API_KEY = process.env.REACT_APP_TEMPLATED_API_KEY || '4a6c2169-01f9-4e0d-89e3-d02d44143823';

/**
 * Make authenticated requests to Templated.io API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<any>} Response data
 */
const templatedRequest = async (endpoint, options = {}) => {
  try {
    const url = `${TEMPLATED_API_URL}${endpoint}`;
    
    // Prepare headers with authentication - using Bearer token format
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TEMPLATED_API_KEY}`,
      ...options.headers,
    };

    console.log(`Making request to Templated.io: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // For non-JSON responses
    if (response.status === 204) {
      return { success: true };
    }

    // Parse the response
    const data = await response.json();
    
    // Check if response was successful
    if (!response.ok) {
      const error = new Error(data.message || `Templated.io API Error: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Templated.io API Error:', error);
    throw error;
  }
};

/**
 * Fetch all available templates from Templated.io
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} List of templates
 */
export const fetchTemplates = async (options = {}) => {
  // Build query string from options
  const queryParams = new URLSearchParams();
  
  if (options.category) {
    queryParams.append('category', options.category);
  }
  
  if (options.tags) {
    queryParams.append('tags', Array.isArray(options.tags) ? options.tags.join(',') : options.tags);
  }
  
  if (options.search) {
    queryParams.append('search', options.search);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  // Make the API request
  const response = await templatedRequest(`/templates${queryString}`);
  
  // Return the templates array from the response
  return Array.isArray(response) ? response : (response.templates || []);
};

/**
 * Fetch templates in a specific folder
 * @param {string} folderId - ID of the folder to fetch templates from
 * @param {Object} options - Additional options
 * @returns {Promise<Array>} List of templates in the folder
 */
export const fetchTemplatesByFolder = async (folderId, options = {}) => {
  if (!folderId) {
    throw new Error('Folder ID is required');
  }

  // Build query string from options
  const queryParams = new URLSearchParams();
  
  if (options.page) {
    queryParams.append('page', options.page);
  }
  
  if (options.limit) {
    queryParams.append('limit', options.limit);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  // Make the API request
  const response = await templatedRequest(`/folders/${folderId}/templates${queryString}`);
  
  console.log(`Fetched templates for folder ${folderId}:`, response);
  
  // Return the templates array from the response
  return Array.isArray(response) ? response : (response.templates || []);
};

/**
 * Generate content from a template using Templated.io
 * @param {string} templateId - ID of the template to use
 * @param {Object} parameters - Template parameters and variables
 * @returns {Promise<Object>} Generated content
 */
export const generateFromTemplate = async (templateId, parameters = {}) => {
  if (!templateId) {
    throw new Error('Template ID is required for generation');
  }

  // Prepare the request body according to Templated.io docs
  const requestBody = {
    templateId,
    parameters: parameters.values || parameters || {},
    options: {
      format: parameters.format || 'html',
      ...parameters.options
    }
  };

  // Make the API request to generate content
  const response = await templatedRequest('/generate', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  // Add some tracking/logging for debugging
  console.log('Generation successful for template:', templateId);
  
  return response;
};

/**
 * Get details for a specific template
 * @param {string} templateId - ID of the template
 * @returns {Promise<Object>} Template details
 */
export const getTemplateDetails = async (templateId) => {
  if (!templateId) {
    throw new Error('Template ID is required');
  }
  
  return templatedRequest(`/templates/${templateId}`);
};

/**
 * Save generated content
 * @param {Object} content - Generated content to save
 * @param {Object} options - Save options
 * @returns {Promise<Object>} Saved content info
 */
export const saveGeneratedContent = async (content, options = {}) => {
  if (!content) {
    throw new Error('Content is required for saving');
  }

  const requestBody = {
    content,
    ...options
  };

  return templatedRequest('/save', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
};

/**
 * Export generated content to different formats
 * @param {string} contentId - ID of the generated content
 * @param {string} format - Export format (pdf, png, jpg)
 * @returns {Promise<Object>} Export information with download URL
 */
export const exportContent = async (contentId, format = 'pdf') => {
  if (!contentId) {
    throw new Error('Content ID is required for export');
  }
  
  return templatedRequest('/export', {
    method: 'POST',
    body: JSON.stringify({
      contentId,
      format
    }),
  });
};

/**
 * Create a render using a template and layer data
 * @param {string} templateId - ID of the template to use
 * @param {Object} layers - Layer data to apply to the template
 * @returns {Promise<Object>} Render result with ID
 */
export const createRender = async (templateId, layers) => {
  if (!templateId) {
    throw new Error('Template ID is required for rendering');
  }

  const requestBody = {
    template: templateId,
    layers: layers || {}
  };

  console.log('Creating render with data:', requestBody);

  const response = await templatedRequest('/render', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  console.log('Render creation successful:', response);
  return response;
};

/**
 * Check the status of a render
 * @param {string} renderId - ID of the render to check
 * @returns {Promise<Object>} Render status and result URL if completed
 */
export const checkRenderStatus = async (renderId) => {
  if (!renderId) {
    throw new Error('Render ID is required to check status');
  }

  const response = await templatedRequest(`/render/${renderId}`);
  console.log(`Render ${renderId} status:`, response);
  
  // Make sure to normalize status values from the API
  if (response) {
    if (response.status === 'COMPLETED') {
      response.status = 'completed';
    } else if (response.status === 'FAILED') {
      response.status = 'failed';
    } else if (response.status === 'PENDING') {
      response.status = 'pending';
    }
  }
  
  return response;
};

/**
 * Fetch detailed information about a specific template
 * @param {string} templateId - ID of the template to fetch
 * @returns {Promise<Object>} Template details with layers
 */
export const fetchTemplateDetails = async (templateId) => {
  if (!templateId) {
    throw new Error('Template ID is required');
  }

  try {
    // Use includeLayers parameter to get complete template structure
    const queryParams = new URLSearchParams();
    queryParams.append('include_layers', 'true');
    
    const response = await templatedRequest(`/templates/${templateId}?${queryParams.toString()}`);
    
    console.log(`Fetched details for template ${templateId}:`, response);
    
    // Ensure the response has a layers property, even if empty
    if (!response.layers) {
      response.layers = {};
    }
    
    return response;
  } catch (error) {
    console.error(`Error fetching template details for ${templateId}:`, error);
    
    // If we get a 404, try the alternative endpoint format
    if (error.status === 404) {
      try {
        const altResponse = await templatedRequest(`/template/${templateId}`);
        
        console.log(`Fetched details using alternate endpoint for template ${templateId}:`, altResponse);
        
        if (!altResponse.layers) {
          altResponse.layers = {};
        }
        
        return altResponse;
      } catch (altError) {
        console.error(`Error with alternate endpoint for ${templateId}:`, altError);
        throw altError;
      }
    }
    
    throw error;
  }
};

/**
 * Fetch uploaded assets/images from the API
 * @param {Object} options - Pagination and filter options
 * @returns {Promise<Array>} List of uploaded assets
 */
export const fetchUploads = async (options = {}) => {
  // Build query string from options
  const queryParams = new URLSearchParams();
  
  if (options.page) {
    queryParams.append('page', options.page);
  }
  
  if (options.limit) {
    queryParams.append('limit', options.limit);
  }
  
  if (options.type) {
    queryParams.append('type', options.type);
  }
  
  if (options.query) {
    queryParams.append('query', options.query);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  const response = await templatedRequest(`/uploads${queryString}`);
  console.log('Fetched uploads:', response);
  
  // Return the uploads array from the response
  return Array.isArray(response) ? response : (response.uploads || []);
};

/**
 * Upload an image file to the API
 * @param {File} file - The image file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result with URL
 */
export const uploadImage = async (file, options = {}) => {
  if (!file) {
    throw new Error('File is required for upload');
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('file', file);
  
  // Add any additional options as form fields
  Object.keys(options).forEach(key => {
    formData.append(key, options[key]);
  });
  
  // Custom fetch for multipart/form-data instead of using templatedRequest
  const url = `${TEMPLATED_API_URL}/upload`;
  
  console.log(`Uploading file ${file.name} to ${url}`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TEMPLATED_API_KEY}`,
      // Do not set Content-Type here; browser will set it with boundary for FormData
    },
    body: formData
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.message || `Upload Error: ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  console.log('File upload successful:', data);
  return data;
};

/**
 * Fetch folders/categories for organizing templates
 * @param {Object} options - Query options for filtering folders
 * @returns {Promise<Array>} List of folders
 */
export const fetchFolders = async (options = {}) => {
  // Build query string from options
  const queryParams = new URLSearchParams();
  
  if (options.page) {
    queryParams.append('page', options.page);
  }
  
  if (options.limit) {
    queryParams.append('limit', options.limit);
  }
  
  if (options.query) {
    queryParams.append('query', options.query);
  }
  
  if (options.parentId) {
    queryParams.append('parentId', options.parentId);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  const response = await templatedRequest(`/folders${queryString}`);
  console.log('Fetched folders:', response);
  
  // Return the folders array from the response
  return Array.isArray(response) ? response : (response.folders || []);
};

// Export a check function to verify API access
export const checkApiAccess = async () => {
  try {
    const response = await templatedRequest('/status');
    return {
      success: true,
      message: 'Successfully connected to Templated.io API',
      status: response
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to connect to Templated.io API',
      error: error.message
    };
  }
};

/**
 * Fetch render history for a specific template
 * @param {string} templateId - ID of the template (optional)
 * @param {Object} options - Pagination and filter options
 * @returns {Promise<Array>} List of render results
 */
export const fetchTemplateRenders = async (templateId, options = {}) => {
  // Build query string from options
  const queryParams = new URLSearchParams();
  
  if (templateId) {
    queryParams.append('templateId', templateId);
  }
  
  if (options.page) {
    queryParams.append('page', options.page);
  }
  
  if (options.limit) {
    queryParams.append('limit', options.limit);
  }
  
  if (options.status) {
    queryParams.append('status', options.status);
  }
  
  if (options.startDate) {
    queryParams.append('startDate', options.startDate);
  }
  
  if (options.endDate) {
    queryParams.append('endDate', options.endDate);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  // Since this is a render history endpoint, we'll use /renders
  const response = await templatedRequest(`/renders${queryString}`);
  console.log('Fetched render history:', response);
  
  // Return the renders array from the response
  return Array.isArray(response) ? response : (response.renders || []);
};