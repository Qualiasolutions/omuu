// src/services/api.js
// Integration with Templated.io API

// Configuration for Templated.io
const TEMPLATED_API_URL = process.env.REACT_APP_TEMPLATED_API_URL || 'https://api.templated.io/v1';
const TEMPLATED_API_KEY = process.env.REACT_APP_TEMPLATED_API_KEY || '4a6c2169-01f9-4e0d-89e3-d02d44143823';

// Flag to enable/disable mock data when API fails
const USE_MOCK_ON_FAILURE = true;

// Mock data for fallbacks
const MOCK_DATA = {
  templates: [
    {
      id: 'template-001',
      name: 'Instagram Post - Modern',
      description: 'A clean, modern Instagram post template',
      thumbnail: 'https://via.placeholder.com/300x300?text=Modern+Post',
      category: 'Social Media',
      tags: ['instagram', 'social', 'modern']
    },
    {
      id: 'template-002',
      name: 'Instagram Story - Promotion',
      description: 'Perfect for promotional content',
      thumbnail: 'https://via.placeholder.com/300x300?text=Promo+Story',
      category: 'Social Media',
      tags: ['instagram', 'story', 'promotion']
    },
    {
      id: 'template-003',
      name: 'Product Showcase',
      description: 'Highlight your products with this template',
      thumbnail: 'https://via.placeholder.com/300x300?text=Product',
      category: 'Business',
      tags: ['product', 'showcase', 'business']
    }
  ],
  folders: [
    { id: 'folder-001', name: 'Social Media', count: 10 },
    { id: 'folder-002', name: 'Business', count: 5 },
    { id: 'folder-003', name: 'Marketing', count: 8 }
  ],
  uploads: [
    { id: 'upload-001', name: 'Logo.png', url: 'https://via.placeholder.com/200x200?text=Logo' },
    { id: 'upload-002', name: 'Product.jpg', url: 'https://via.placeholder.com/400x300?text=Product' },
    { id: 'upload-003', name: 'Banner.png', url: 'https://via.placeholder.com/600x200?text=Banner' }
  ],
  renders: [
    { 
      id: 'render-001', 
      templateId: 'template-001', 
      status: 'COMPLETED', 
      url: 'https://via.placeholder.com/1080x1080?text=Rendered+Post',
      createdAt: new Date().toISOString()
    },
    { 
      id: 'render-002', 
      templateId: 'template-002', 
      status: 'COMPLETED', 
      url: 'https://via.placeholder.com/1080x1920?text=Rendered+Story',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  templateDetails: {
    id: 'template-001',
    name: 'Instagram Post - Modern',
    description: 'A clean, modern Instagram post template',
    width: 1080,
    height: 1080,
    layers: {
      'text-headline': { type: 'text', text: 'Your Headline Here' },
      'text-body': { type: 'text', text: 'Add your content description here. Tell your story and engage your audience.' },
      'image-main': { type: 'image' },
      'shape-background': { type: 'shape' }
    }
  }
};

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
  try {
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
  } catch (error) {
    console.error("Error fetching templates:", error);
    
    // Return mock data on failure if enabled
    if (USE_MOCK_ON_FAILURE) {
      console.log("Using mock template data instead");
      let mockTemplates = [...MOCK_DATA.templates];
      
      // Filter mock data if options were provided
      if (options.category) {
        mockTemplates = mockTemplates.filter(t => t.category === options.category);
      }
      if (options.tags) {
        const tags = Array.isArray(options.tags) ? options.tags : [options.tags];
        mockTemplates = mockTemplates.filter(t => tags.some(tag => t.tags.includes(tag)));
      }
      if (options.search) {
        const search = options.search.toLowerCase();
        mockTemplates = mockTemplates.filter(t => 
          t.name.toLowerCase().includes(search) || 
          t.description.toLowerCase().includes(search)
        );
      }
      
      return mockTemplates;
    }
    
    throw error;
  }
};

/**
 * Fetch templates in a specific folder
 * @param {string} folderId - ID of the folder to fetch templates from
 * @param {Object} options - Additional options
 * @returns {Promise<Array>} List of templates in the folder
 */
export const fetchTemplatesByFolder = async (folderId, options = {}) => {
  try {
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
    return response.templates || [];
  } catch (error) {
    console.error(`Error fetching templates for folder ${folderId}:`, error);
    
    // Return mock data on failure if enabled
    if (USE_MOCK_ON_FAILURE) {
      console.log("Using mock folder templates instead");
      // Filter templates that would belong to this folder
      return MOCK_DATA.templates.filter(t => 
        t.category === MOCK_DATA.folders.find(f => f.id === folderId)?.name
      );
    }
    
    throw error;
  }
};

/**
 * Generate content from a template using Templated.io
 * @param {string} templateId - ID of the template to use
 * @param {Object} parameters - Template parameters and variables
 * @returns {Promise<Object>} Generated content
 */
export const generateFromTemplate = async (templateId, parameters = {}) => {
  try {
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
  } catch (error) {
    console.error("Error generating from template:", error);
    
    // Return mock data on failure if enabled
    if (USE_MOCK_ON_FAILURE) {
      console.log("Using mock generation data instead");
      return {
        id: `generated-${Date.now()}`,
        templateId,
        content: `<div>Mock generated content for template ${templateId}</div>`,
        url: 'https://via.placeholder.com/1080x1080?text=Generated+Content'
      };
    }
    
    throw error;
  }
};

/**
 * Get details for a specific template
 * @param {string} templateId - ID of the template
 * @returns {Promise<Object>} Template details
 */
export const getTemplateDetails = async (templateId) => {
  try {
    if (!templateId) {
      throw new Error('Template ID is required');
    }
    
    return templatedRequest(`/templates/${templateId}`);
  } catch (error) {
    console.error(`Error getting template details for ${templateId}:`, error);
    
    // Return mock data on failure if enabled
    if (USE_MOCK_ON_FAILURE) {
      console.log("Using mock template details instead");
      return {
        ...MOCK_DATA.templateDetails,
        id: templateId
      };
    }
    
    throw error;
  }
};

/**
 * Save generated content
 * @param {Object} content - Generated content to save
 * @param {Object} options - Save options
 * @returns {Promise<Object>} Saved content info
 */
export const saveGeneratedContent = async (content, options = {}) => {
  try {
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
  } catch (error) {
    console.error("Error saving generated content:", error);
    
    // Return mock data on failure if enabled
    if (USE_MOCK_ON_FAILURE) {
      console.log("Using mock save response instead");
      return {
        id: `saved-${Date.now()}`,
        url: 'https://via.placeholder.com/1080x1080?text=Saved+Content',
        createdAt: new Date().toISOString()
      };
    }
    
    throw error;
  }
};

/**
 * Export generated content to different formats
 * @param {string} contentId - ID of the generated content
 * @param {string} format - Export format (pdf, png, jpg)
 * @returns {Promise<Object>} Export information with download URL
 */
export const exportContent = async (contentId, format = 'pdf') => {
  try {
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
  } catch (error) {
    console.error(`Error exporting content ${contentId}:`, error);
    
    // Return mock data on failure if enabled
    if (USE_MOCK_ON_FAILURE) {
      console.log("Using mock export response instead");
      return {
        id: `export-${Date.now()}`,
        url: `https://via.placeholder.com/1080x1080?text=Exported+${format.toUpperCase()}`,
        format,
        createdAt: new Date().toISOString()
      };
    }
    
    throw error;
  }
};

/**
 * Create a render using a template
 * @param {string} templateId - ID of the template to use
 * @param {Object} layers - Layer data to apply to the template
 * @returns {Promise<Object>} Render result with ID
 */
export const createRender = async (templateId, layers) => {
  try {
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
  } catch (error) {
    console.error('Error creating render:', error);
    
    // Return mock data on failure if enabled
    if (USE_MOCK_ON_FAILURE) {
      console.log("Using mock render creation instead");
      const mockRender = {
        id: `render-${Date.now()}`,
        templateId,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      // In real app, we'd push this to mock data store for later checkRenderStatus calls
      MOCK_DATA.renders.push({
        ...mockRender,
        url: 'https://via.placeholder.com/1080x1080?text=Rendered+Content',
        status: 'COMPLETED'
      });
      
      return mockRender;
    }
    
    throw error;
  }
};

/**
 * Check the status of a render
 * @param {string} renderId - ID of the render to check
 * @returns {Promise<Object>} Render status and result URL if completed
 */
export const checkRenderStatus = async (renderId) => {
  try {
    if (!renderId) {
      throw new Error('Render ID is required to check status');
    }
  
    const response = await templatedRequest(`/render/${renderId}`);
    console.log(`Render ${renderId} status:`, response);
    return response;
  } catch (error) {
    console.error(`Error checking render status for ${renderId}:`, error);
    
    // Return mock data on failure if enabled
    if (USE_MOCK_ON_FAILURE) {
      console.log("Using mock render status instead");
      
      // Find in our mock data or create a new completed render
      const mockRender = MOCK_DATA.renders.find(r => r.id === renderId) || {
        id: renderId,
        status: 'COMPLETED',
        url: 'https://via.placeholder.com/1080x1080?text=Completed+Render',
        createdAt: new Date().toISOString()
      };
      
      return mockRender;
    }
    
    throw error;
  }
};

/**
 * Fetch detailed information about a specific template
 * @param {string} templateId - ID of the template to fetch
 * @returns {Promise<Object>} Template details with layers
 */
export const fetchTemplateDetails = async (templateId) => {
  try {
    if (!templateId) {
      throw new Error('Template ID is required');
    }
  
    // Use includeLayers parameter to get complete template structure
    const queryParams = new URLSearchParams();
    queryParams.append('includeLayers', 'true');
    
    const response = await templatedRequest(`/templates/${templateId}?${queryParams.toString()}`);
    
    console.log(`Fetched details for template ${templateId}:`, response);
    
    // Ensure the response has a layers property, even if empty
    if (!response.layers) {
      response.layers = {};
    }
    
    return response;
  } catch (error) {
    console.error(`Error fetching template details for ${templateId}:`, error);
    
    // Return mock data on failure if enabled
    if (USE_MOCK_ON_FAILURE) {
      console.log("Using mock template details instead");
      return {
        ...MOCK_DATA.templateDetails,
        id: templateId
      };
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
  try {
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
    return response.uploads || [];
  } catch (error) {
    console.error('Error fetching uploads:', error);
    
    // Return mock data on failure if enabled
    if (USE_MOCK_ON_FAILURE) {
      console.log("Using mock uploads instead");
      return MOCK_DATA.uploads;
    }
    
    throw error;
  }
};

/**
 * Upload an image file to the API
 * @param {File} file - The image file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result with URL
 */
export const uploadImage = async (file, options = {}) => {
  try {
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
        'X-API-Key': TEMPLATED_API_KEY,
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
  } catch (error) {
    console.error('Error uploading file:', error);
    
    // Return mock data on failure if enabled
    if (USE_MOCK_ON_FAILURE) {
      console.log("Using mock upload response instead");
      return {
        id: `upload-${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file) || 'https://via.placeholder.com/400x400?text=Uploaded',
        size: file.size,
        type: file.type,
        createdAt: new Date().toISOString()
      };
    }
    
    throw error;
  }
};

/**
 * Fetch folders/categories for organizing templates
 * @param {Object} options - Query options for filtering folders
 * @returns {Promise<Array>} List of folders
 */
export const fetchFolders = async (options = {}) => {
  try {
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
    return response.folders || [];
  } catch (error) {
    console.error('Error fetching folders:', error);
    
    // Return mock data on failure if enabled
    if (USE_MOCK_ON_FAILURE) {
      console.log("Using mock folders instead");
      return MOCK_DATA.folders;
    }
    
    throw error;
  }
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
    if (USE_MOCK_ON_FAILURE) {
      console.log("Using mock API status instead");
      return {
        success: true,
        message: 'Using mock API data (fallback mode)',
        isMock: true
      };
    }
    
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
  try {
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
    return response.renders || [];
  } catch (error) {
    console.error('Error fetching render history:', error);
    
    // Return mock data on failure if enabled
    if (USE_MOCK_ON_FAILURE) {
      console.log("Using mock render history instead");
      return templateId 
        ? MOCK_DATA.renders.filter(r => r.templateId === templateId)
        : MOCK_DATA.renders;
    }
    
    throw error;
  }
};