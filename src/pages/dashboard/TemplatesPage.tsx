import React, { useEffect } from 'react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Download, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useDashboardStore } from '../../stores/dashboardStore';

const TemplatesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { downloads, loading, error, fetchUserDownloads } = useDashboardStore();

  useEffect(() => {
    if (user) {
      fetchUserDownloads(user.id);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-100">My Templates</h1>
      
      <div className="grid gap-6">
        {downloads.map((download) => (
          <Card key={download.download_id} className="p-6 bg-gray-800">
            <div className="flex items-start space-x-4">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold mb-2 text-gray-100">{download.title}</h3>
                <p className="text-sm text-gray-300 mb-3">Category: {download.category}</p>
                <p className="text-sm text-gray-400">
                  Downloaded: {new Date(download.downloaded_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="primary"
                  className="flex items-center bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                  onClick={() => download.file_url && window.open(download.file_url, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  className="px-3 border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => download.file_url && window.open(download.file_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {downloads.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>You haven't downloaded any templates yet.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.href = '/templates'}
            >
              Browse Templates
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage