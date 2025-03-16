import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchFolders } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const FolderSelector = ({ onFolderSelect, selectedFolderId }) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFolders = async () => {
      try {
        setLoading(true);
        setError('');
        
        const foldersData = await fetchFolders();
        setFolders(foldersData);
      } catch (err) {
        console.error('Error loading folders:', err);
        setError('Failed to load folders');
      } finally {
        setLoading(false);
      }
    };
    
    loadFolders();
  }, []);

  return (
    <div className="omu-folder-selector">
      <div className="omu-folder-header">
        <h3>Folder Organization</h3>
        {loading && <LoadingSpinner size="small" />}
      </div>
      
      {error && <p className="omu-error-message">{error}</p>}
      
      <div className="omu-folder-list">
        <div 
          className={`omu-folder-item ${!selectedFolderId ? 'selected' : ''}`}
          onClick={() => onFolderSelect(null)}
        >
          <i className="omu-folder-icon">📁</i>
          <span className="omu-folder-name">All Templates</span>
        </div>
        
        {folders.map(folder => (
          <div 
            key={folder.id}
            className={`omu-folder-item ${selectedFolderId === folder.id ? 'selected' : ''}`}
            onClick={() => onFolderSelect(folder.id)}
          >
            <i className="omu-folder-icon">📁</i>
            <span className="omu-folder-name">{folder.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

FolderSelector.propTypes = {
  onFolderSelect: PropTypes.func.isRequired,
  selectedFolderId: PropTypes.string
};

export default FolderSelector; 