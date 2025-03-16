import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchUploads, uploadImage } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const AssetLibrary = ({ onSelectAsset, isVisible, onToggleVisibility }) => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (isVisible) {
      loadAssets(true);
    }
  }, [isVisible]);

  const loadAssets = async (reset = false) => {
    try {
      setLoading(true);
      setError('');
      
      const currentPage = reset ? 0 : page;
      const uploadsData = await fetchUploads({ page: currentPage, limit: 24 });
      
      if (reset) {
        setUploads(uploadsData || []);
      } else {
        setUploads(prev => [...prev, ...(uploadsData || [])]);
      }
      
      setHasMore(uploadsData && uploadsData.length === 24);
      setPage(currentPage + 1);
    } catch (err) {
      console.error('Error loading assets:', err);
      setError('Failed to load assets library');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setUploading(true);
      setError('');
      
      const uploadData = await uploadImage(file);
      if (uploadData) {
        setUploads(prev => [uploadData, ...prev]);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(`Failed to upload image: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (e) {
      return dateString;
    }
  };
  
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/200x200?text=No+Preview';
  };

  return (
    <div className={`omu-asset-library ${isVisible ? 'expanded' : 'collapsed'}`}>
      <div className="omu-panel-header" onClick={onToggleVisibility}>
        <h3>Asset Library</h3>
        <span className="omu-toggle-icon">{isVisible ? '−' : '+'}</span>
      </div>
      
      {isVisible && (
        <div className="omu-panel-content">
          <div className="omu-asset-actions">
            <div className="omu-asset-upload">
              <input 
                type="file" 
                id="asset-upload" 
                accept="image/*" 
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <label htmlFor="asset-upload" className={`omu-upload-button ${uploading ? 'disabled' : ''}`}>
                {uploading ? 'Uploading...' : 'Upload New Image'}
              </label>
            </div>
            
            <button 
              className="omu-refresh-button"
              onClick={() => loadAssets(true)}
              disabled={loading}
            >
              Refresh Assets
            </button>
          </div>
          
          {error && <p className="omu-error-message">{error}</p>}
          
          {uploads && uploads.length > 0 ? (
            <div className="omu-assets-grid">
              {uploads.map((upload, index) => (
                <div 
                  key={upload?.id || index}
                  className="omu-asset-item"
                  onClick={() => onSelectAsset(upload)}
                >
                  <div className="omu-asset-preview">
                    <img 
                      src={upload?.url} 
                      alt={upload?.name || 'Asset'} 
                      onError={handleImageError}
                    />
                  </div>
                  <div className="omu-asset-info">
                    <span className="omu-asset-name" title={upload?.name}>
                      {upload?.name?.length > 18 ? upload.name.substring(0, 15) + '...' : upload?.name || 'Unnamed Asset'}
                    </span>
                    <span className="omu-asset-meta">
                      {upload?.size && formatFileSize(upload.size)}
                      {upload?.createdAt && <span title={formatDate(upload.createdAt)}>
                        {' • '}{new Date(upload.createdAt).toLocaleDateString()}
                      </span>}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && <p className="omu-empty-message">No assets found. Upload images to see them here.</p>
          )}
          
          {loading && <LoadingSpinner message="Loading assets..." />}
          
          {hasMore && uploads && uploads.length > 0 && !loading && (
            <button 
              className="omu-load-more" 
              onClick={() => loadAssets()}
            >
              Load More Assets
            </button>
          )}
        </div>
      )}
    </div>
  );
};

AssetLibrary.propTypes = {
  onSelectAsset: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onToggleVisibility: PropTypes.func.isRequired
};

AssetLibrary.defaultProps = {
  isVisible: true
};

export default AssetLibrary; 