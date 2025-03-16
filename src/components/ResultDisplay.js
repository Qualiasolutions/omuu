import React, { useState } from 'react';
import { exportContent } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const ResultDisplay = ({ content }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [exportFormat, setExportFormat] = useState('pdf');

  if (!content) {
    return null;
  }

  // Handle export button click
  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportError(null);
      
      // Call the export API
      const exportResult = await exportContent(content.id, exportFormat);
      
      // If we have a download URL, open it in a new tab
      if (exportResult.downloadUrl) {
        window.open(exportResult.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error("Export error:", err);
      setExportError(`Failed to export as ${exportFormat.toUpperCase()}: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Function to render HTML content safely
  const renderContent = () => {
    if (content.format === 'html' && content.html) {
      return (
        <div 
          className="generated-content border rounded-lg p-4 bg-white"
          dangerouslySetInnerHTML={{ __html: content.html }} 
        />
      );
    } else if (content.text) {
      return (
        <pre className="generated-content border rounded-lg p-4 bg-white overflow-x-auto">
          {content.text}
        </pre>
      );
    } else if (content.url) {
      return (
        <div className="generated-content text-center">
          <img 
            src={content.url} 
            alt="Generated content" 
            className="max-w-full h-auto rounded-lg shadow-md mx-auto"
          />
        </div>
      );
    } else {
      // Fallback for JSON content
      return (
        <pre className="generated-content border rounded-lg p-4 bg-white overflow-x-auto">
          {JSON.stringify(content, null, 2)}
        </pre>
      );
    }
  };

  return (
    <div className="result-display">
      <h2 className="text-2xl font-bold mb-4">Generated Result</h2>
      
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-medium text-lg mb-2">Template: {content.templateName || 'Custom Template'}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {content.format?.toUpperCase() || 'HTML'}
          </span>
          {content.tags && content.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Export options */}
        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm font-medium">Export as:</label>
          <select
            className="px-3 py-1 border rounded text-sm"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            disabled={isExporting}
          >
            <option value="pdf">PDF</option>
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="svg">SVG</option>
          </select>
          
          <button
            className={`ml-2 px-4 py-1 rounded text-sm font-medium ${
              isExporting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <span className="flex items-center">
                <LoadingSpinner size="tiny" />
                <span className="ml-2">Exporting...</span>
              </span>
            ) : (
              `Export as ${exportFormat.toUpperCase()}`
            )}
          </button>
        </div>
        
        {exportError && (
          <div className="mt-2 text-red-600 text-sm">
            {exportError}
          </div>
        )}
      </div>
      
      {/* Render the content */}
      <div className="content-preview mb-6">
        {renderContent()}
      </div>
      
      {/* Metadata and properties */}
      {content.metadata && (
        <div className="metadata mt-6 border-t pt-4">
          <h3 className="font-medium text-lg mb-2">Metadata</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(content.metadata).map(([key, value]) => (
              <div key={key} className="metadata-item">
                <span className="text-sm font-medium text-gray-600">{key}: </span>
                <span className="text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;