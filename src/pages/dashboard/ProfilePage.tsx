import React, { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ full_name: fullName })
        .eq('id', user?.id);

      if (error) throw error;
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-100">Profile Settings</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user?.email}
            disabled
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300"
                placeholder="Enter your full name"
              />
              <Button variant="primary" onClick={handleUpdateProfile}>
                Save
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">
                {fullName || 'Not set'}
              </span>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;