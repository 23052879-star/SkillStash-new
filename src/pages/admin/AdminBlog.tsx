import React, { useState, useEffect } from 'react';
import { Container } from '../../components/shared/Container';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useBlogStore } from '../../stores/blogStore';
import { BlogPostModal } from '../../components/admin/BlogPostModal';
import type { Database } from '../../lib/database.types';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

const AdminBlog: React.FC = () => {
  const { posts, fetchPosts, createPost, updatePost, deletePost } = useBlogStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | undefined>();

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async (post: Partial<BlogPost>) => {
    await createPost(post as Omit<BlogPost, 'id' | 'created_at'>);
    setIsModalOpen(false);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleUpdate = async (post: Partial<BlogPost>) => {
    if (selectedPost) {
      await updatePost(selectedPost.id, post);
      setSelectedPost(undefined);
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
    }
  };

  const handleAddNew = () => {
    setSelectedPost(undefined);
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
            <h1 className="text-2xl font-bold">Manage Blog Posts</h1>
          </div>
          <Button
            variant="primary"
            onClick={handleAddNew}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Post</span>
          </Button>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={post.image_url || 'https://via.placeholder.com/64'}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <p className="text-gray-600">{post.category}</p>
                    <p className="text-sm text-gray-500">{post.read_time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-1"
                    onClick={() => handleEdit(post)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <BlogPostModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPost(undefined);
          }}
          onSubmit={selectedPost ? handleUpdate : handleCreate}
          post={selectedPost}
        />
      </Container>
    </div>
  );
};

export default AdminBlog;