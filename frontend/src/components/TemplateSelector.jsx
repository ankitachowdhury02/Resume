import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

const TemplateSelector = ({ resumeData, onTemplateChange }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('classic');

  const templates = [
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional black and white layout',
      component: ClassicTemplate,
      preview: '/api/placeholder/300/400'
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Colorful gradient design with sidebar',
      component: ModernTemplate,
      preview: '/api/placeholder/300/400'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean, centered layout',
      component: MinimalTemplate,
      preview: '/api/placeholder/300/400'
    }
  ];

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    onTemplateChange(templateId);
  };

  const SelectedTemplateComponent = templates.find(t => t.id === selectedTemplate)?.component || ClassicTemplate;

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Choose Template</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Preview</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Template Preview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {templates.find(t => t.id === selectedTemplate)?.name} Template Preview
        </h3>
        <div className="border rounded-lg overflow-hidden">
          <SelectedTemplateComponent resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
