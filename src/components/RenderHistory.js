import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchTemplateRenders } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const RenderHistory = ({ templateId, isVisible, onToggleVisibility, onSelectRender }) => {
  const [renders, setRenders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (isVisible && templateId) {
      loadRenderHistory();
    }
  }, [isVisible, templateId]);

  const loadRenderHistory = async (reset = false) => {
    if (!templateId) return;
    
    try {
      setLoading(true);
      setError('');
      
      const currentPage = reset ? 0 : page;
      const rendersData = await fetchTemplateRenders(templateId, { 
        page: currentPage, 
        limit: 12 
      });
      
      if (reset) {
        setRenders(rendersData);
      } else {
        setRenders(prev => [...prev, ...rendersData]);
      }
      
      setHasMore(rendersData.length === 12);
      setPage(currentPage + 1);
    } catch (err) {
      console.error('Error loading render history:', err);
      setError('Failed to load render history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className={`omu-render-history ${isVisible ? 'expanded' : 'collapsed'}`}>
      <div className="omu-panel-header" onClick={onToggleVisibility}>
        <h3>Render History</h3>
        <span className="omu-toggle-icon">{isVisible ? '−' : '+'}</span>
      </div>
      
      {isVisible && (
        <div className="omu-panel-content">
          {!templateId && (
            <p className="omu-empty-message">Select a template to view its render history.</p>
          )}
          
          {templateId && (
            <>
              <div className="omu-history-actions">
                <button 
                  className="omu-refresh-button"
                  onClick={() => loadRenderHistory(true)}
                  disabled={loading}
                >
                  Refresh History
                </button>
              </div>
              
              {error && <p className="omu-error-message">{error}</p>}
              
              {renders.length > 0 ? (
                <div className="omu-renders-grid">
                  {renders.map(render => (
                    <div 
                      key={render.id}
                      className="omu-render-item"
                      onClick={() => onSelectRender(render)}
                    >
                      <div className="omu-render-preview">
                        <img 
                          src={render.url} 
                          alt={`Render ${render.id}`} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/200x200?text=No+Preview';
                          }}
                        />
                      </div>
                      <div className="omu-render-info">
                        <span className="omu-render-date">
                          {render.createdAt ? formatDate(render.createdAt) : 'Unknown date'}
                        </span>
                        <span className="omu-render-status">
                          {render.status === 'completed' ? 
                            <span className="omu-status-success">✓</span> : 
                            render.status === 'failed' ? 
                              <span className="omu-status-error">✗</span> : 
                              <span className="omu-status-pending">⧗</span>
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loading && <p className="omu-empty-message">No render history found for this template.</p>
              )}
              
              {loading && <LoadingSpinner message="Loading render history..." />}
              
              {hasMore && renders.length > 0 && !loading && (
                <button 
                  className="omu-load-more" 
                  onClick={() => loadRenderHistory()}
                >
                  Load More History
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

RenderHistory.propTypes = {
  templateId: PropTypes.string,
  isVisible: PropTypes.bool.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
  onSelectRender: PropTypes.func.isRequired
};

RenderHistory.defaultProps = {
  isVisible: false
};

export default RenderHistory; 