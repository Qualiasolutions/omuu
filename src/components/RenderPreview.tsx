import React from 'react';
import { useTemplated } from '../context/TemplatedContext';

const RenderPreview: React.FC = () => {
  const { render, isLoading, error } = useTemplated();

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-center">Generating your Instagram post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <p className="font-semibold">Error generating image</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!render) {
    return null;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = render.url;
    link.download = `instagram-post-${render.id}.${render.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(render.url)
      .then(() => {
        alert('Image URL copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy URL:', err);
        alert('Failed to copy URL to clipboard');
      });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Your Instagram Post</h2>
      
      <div className="mb-4 border rounded overflow-hidden">
        <img 
          src={render.url} 
          alt="Instagram Post" 
          className="w-full h-auto"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition"
          onClick={handleDownload}
        >
          Download Image
        </button>
        
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
          onClick={handleCopyLink}
        >
          Copy Image URL
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Image ID: {render.id}</p>
        <p>Dimensions: {render.width} × {render.height}</p>
        <p>Format: {render.format.toUpperCase()}</p>
        <p>Created: {new Date(render.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default RenderPreview; 