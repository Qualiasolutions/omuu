// src/services/api.js
// Integration with Templated.io API

// Configuration for Templated.io
const TEMPLATED_API_URL = process.env.REACT_APP_TEMPLATED_API_URL || 'https://api.templated.io/v1';
const TEMPLATED_API_KEY = process.env.REACT_APP_TEMPLATED_API_KEY;

/**
 * Make authenticated requests to Templated.io API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<any>} Response data
 */
const templatedRequest = async (endpoint, options = {}) => {
  try {
    const url = `${TEMPLATED_API_URL}${endpoint}`;
    
    // Prepare headers with authentication
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': TEMPLATED_API_KEY,
      ...options.headers,
    };

    console.log(`Making request to Templated.io: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

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
  return response.templates || [];
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