import React, { useEffect } from 'react';
import { useTemplated } from '../context/TemplatedContext';
import { Template } from '../services/api';

const TemplateList: React.FC = () => {
  const { templates, isLoading, error, loadTemplates, selectTemplate } = useTemplated();

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  if (isLoading && templates.length === 0) {
    return <div className="flex justify-center p-8">Loading templates...</div>;
  }

  if (error && templates.length === 0) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Error: {error}
        <button 
          className="ml-4 px-3 py-1 bg-red-600 text-white rounded" 
          onClick={loadTemplates}
        >
          Retry
        </button>
      </div>
    );
  }

  if (templates.length === 0) {
    return <div className="p-4">No templates found</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Select a Template</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <TemplateCard 
            key={template.id} 
            template={template} 
            onClick={() => selectTemplate(template.id)} 
          />
        ))}
      </div>
    </div>
  );
};

interface TemplateCardProps {
  template: Template;
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick }) => {
  return (
    <div 
      className="bg-white rounded shadow hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
        <img 
          src={template.thumbnail} 
          alt={template.name} 
          className="absolute inset-0 w-full h-full object-cover rounded-t"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold truncate">{template.name}</h3>
        <div className="text-sm text-gray-500 mt-1">
          {template.width} × {template.height}
        </div>
      </div>
    </div>
  );
};

export default TemplateList; 