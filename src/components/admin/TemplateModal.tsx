import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../shared/Button';
import type { Database } from '../../lib/database.types';

type Template = Database['public']['Tables']['templates']['Row'];

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (template: Partial<Template>) => Promise<void>;
  template?: Template;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  template
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image_url: '',
    file_url: '',
    price: 0
  });

  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title,
        description: template.description || '',
        category: template.category,
        image_url: template.image_url || '',
        file_url: template.file_url || '',
        price: template.price
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        image_url: '',
        file_url: '',
        price: 0
      });
    }
  }, [template]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {template ? 'Edit Template' : 'Add New Template'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
                required
              >
                <option value="">Select Category</option>
                <option value="Resume">Resume</option>
                <option value="CV">CV</option>
                <option value="Portfolio">Portfolio</option>
                <option value="Certificate">Certificate</option>
                <option value="Cover Letter">Cover Letter</option>
                <option value="Business Card">Business Card</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border rounded-md"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File URL (Download Link)
            </label>
            <input
              type="url"
              value={formData.file_url}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {template ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};