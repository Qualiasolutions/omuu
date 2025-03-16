// src/services/api.js

/**
 * Base API request handler with error management
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
const apiRequest = async (endpoint, options = {}) => {
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // Prepare the full request URL
    const baseUrl = process.env.REACT_APP_API_URL || '';
    const url = `${baseUrl}${endpoint}`;
    
    // Log outgoing requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      if (options.body) {
        console.log('Request payload:', JSON.parse(options.body));
      }
    }

    // Execute the request
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle different response types
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType && contentType.includes('text/')) {
      data = await response.text();
    } else {
      data = await response.blob();
    }

    // Check if response was successful
    if (!response.ok) {
      // Create a structured error with status, message, and any details from the response
      const error = new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Add context to the error
    if (!error.status) {
      error.message = `Network Error: ${error.message}`;
    }
    
    // Log all API errors
    console.error('API Error:', error);
    
    // Special handling for auth errors
    if (error.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('auth_token');
      // Potentially redirect to login
      window.location.href = '/login';
    }
    
    throw error;
  }
};

/**
 * Fetch all available templates with filtering options
 * @param {Object} options - Filter and pagination options
 * @param {string} options.category - Filter by template category
 * @param {string} options.search - Search term for templates
 * @param {number} options.page - Page number for pagination
 * @param {number} options.limit - Number of templates per page
 * @returns {Promise<{templates: Array, total: number, page: number, pages: number}>} Templates and pagination info
 */
export const fetchTemplates = async (options = {}) => {
  // Build query parameters from options
  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value);
    }
  });

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/api/templates${queryString}`);
};

/**
 * Fetch a single template by ID
 * @param {string} templateId - The template ID
 * @returns {Promise<Object>} Template details
 */
export const fetchTemplateById = async (templateId) => {
  if (!templateId) {
    throw new Error('Template ID is required');
  }
  
  return apiRequest(`/api/templates/${templateId}`);
};

/**
 * Generate content from a selected template
 * @param {string} templateId - The ID of the selected template
 * @param {Object} parameters - Generation parameters
 * @param {Object} parameters.values - Values to be injected into the template
 * @param {Object} parameters.options - Generation options (format, quality, etc.)
 * @param {AbortSignal} signal - Optional AbortController signal for cancellation
 * @returns {Promise<Object>} The generated content
 */
export const generateFromTemplate = async (templateId, parameters = {}, signal = null) => {
  if (!templateId) {
    throw new Error('Template ID is required for generation');
  }

  return apiRequest('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ templateId, ...parameters }),
    signal,
  });
};

/**
 * Save generated content to user's library
 * @param {Object} content - The generated content to save
 * @param {Object} options - Save options
 * @param {string} options.name - Name for saved content
 * @param {string} options.format - Format to save as (pdf, png, etc)
 * @param {string} options.folderId - Optional folder ID to save to
 * @returns {Promise<Object>} Information about the saved content
 */
export const saveGeneratedContent = async (content, options = {}) => {
  if (!content) {
    throw new Error('Content is required for saving');
  }

  return apiRequest('/api/library/save', {
    method: 'POST',
    body: JSON.stringify({ content, ...options }),
  });
};

/**
 * Get generation history with filtering and pagination
 * @param {Object} options - Filter and pagination options
 * @returns {Promise<{history: Array, total: number, page: number, pages: number}>} History items and pagination info
 */
export const getGenerationHistory = async (options = {}) => {
  // Build query parameters from options
  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value);
    }
  });

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/api/history${queryString}`);
};

/**
 * Delete a generated item from history
 * @param {string} itemId - ID of the history item to delete
 * @returns {Promise<{success: boolean}>} Success status
 */
export const deleteHistoryItem = async (itemId) => {
  if (!itemId) {
    throw new Error('Item ID is required for deletion');
  }

  return apiRequest(`/api/history/${itemId}`, {
    method: 'DELETE',
  });
};

/**
 * Upload a custom asset (image, logo, etc) for use in templates
 * @param {File} file - The file to upload
 * @param {Object} metadata - Additional metadata for the asset
 * @returns {Promise<Object>} Information about the uploaded asset
 */
export const uploadAsset = async (file, metadata = {}) => {
  if (!file) {
    throw new Error('File is required for upload');
  }

  // Use FormData for file uploads
  const formData = new FormData();
  formData.append('file', file);
  
  // Add any metadata as additional form fields
  Object.entries(metadata).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return apiRequest('/api/assets/upload', {
    method: 'POST',
    headers: {
      // Let the browser set the correct Content-Type for FormData
      // which includes the boundary for multipart/form-data
    },
    body: formData,
  });
};

/**
 * Fetch user's assets library
 * @param {Object} options - Filter and pagination options
 * @returns {Promise<{assets: Array, total: number, page: number, pages: number}>} Assets and pagination info
 */
export const fetchAssets = async (options = {}) => {
  // Build query parameters from options
  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value);
    }
  });

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/api/assets${queryString}`);
};

/**
 * User authentication
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{token: string, user: Object}>} Auth token and user info
 */
export const login = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Store the token in localStorage
  if (data.token) {
    localStorage.setItem('auth_token', data.token);
  }

  return data;
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<{success: boolean, user: Object}>} Registration result
 */
export const register = async (userData) => {
  if (!userData.email || !userData.password) {
    throw new Error('Email and password are required');
  }

  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * Log out the current user
 * @returns {Promise<{success: boolean}>} Logout result
 */
export const logout = async () => {
  // Remove the token from localStorage
  localStorage.removeItem('auth_token');
  
  // Optionally notify the server
  return apiRequest('/api/auth/logout', {
    method: 'POST',
  }).catch(() => ({ success: true })); // Ensure we consider logout successful even if API fails
};

/**
 * Get the current user's info
 * @returns {Promise<Object>} User information
 */
export const getCurrentUser = async () => {
  return apiRequest('/api/user/me');
};

/**
 * Update user profile information
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated user information
 */
export const updateUserProfile = async (profileData) => {
  return apiRequest('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

/**
 * Create a custom template
 * @param {Object} templateData - Template definition data
 * @returns {Promise<Object>} Created template information
 */
export const createTemplate = async (templateData) => {
  return apiRequest('/api/templates', {
    method: 'POST',
    body: JSON.stringify(templateData),
  });
};

/**
 * Get API status and health check
 * @returns {Promise<{status: string, version: string}>} API status information
 */
export const getApiStatus = async () => {
  return apiRequest('/api/status');
};