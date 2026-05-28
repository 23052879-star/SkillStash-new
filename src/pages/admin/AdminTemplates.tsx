import React, { useState, useEffect } from 'react';
import { Container } from '../../components/shared/Container';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useTemplatesStore } from '../../stores/templatesStore';
import { TemplateModal } from '../../components/admin/TemplateModal';
import type { Database } from '../../lib/database.types';

type Template = Database['public']['Tables']['templates']['Row'];

const AdminTemplates: React.FC = () => {
  const { templates, fetchTemplates, createTemplate, updateTemplate, deleteTemplate } = useTemplatesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreate = async (template: Partial<Template>) => {
    await createTemplate(template as Omit<Template, 'id' | 'created_at' | 'downloads' | 'rating'>);
    setIsModalOpen(false);
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleUpdate = async (template: Partial<Template>) => {
    if (selectedTemplate) {
      await updateTemplate(selectedTemplate.id, template);
      setSelectedTemplate(undefined);
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(id);
    }
  };

  const handleAddNew = () => {
    setSelectedTemplate(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <a href="/admin" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </a>
            <h1 className="text-2xl font-bold">Manage Templates</h1>
          </div>
          <Button
            variant="primary"
            onClick={handleAddNew}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Template</span>
          </Button>
        </div>

        <div className="grid gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={template.image_url || 'https://via.placeholder.com/64'}
                    alt={template.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{template.title}</h3>
                    <p className="text-gray-600">{template.category} • ₹{template.price}</p>
                    <p className="text-sm text-gray-500">{template.downloads} downloads</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-1"
                    onClick={() => handleEdit(template)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <TemplateModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTemplate(undefined);
          }}
          onSubmit={selectedTemplate ? handleUpdate : handleCreate}
          template={selectedTemplate}
        />
      </Container>
    </div>
  );
};

export default AdminTemplates;