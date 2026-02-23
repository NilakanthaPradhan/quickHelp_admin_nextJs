'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProviders = async () => {
    try {
      const res = await api.get('/providers');
      if (res.status === 200) {
        setProviders(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch providers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  if (loading) {
    return <div className="p-8">Loading providers...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Active Service Providers</h1>

      {providers.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
          No service providers found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {providers.map((provider) => (
                  <tr key={provider.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative rounded-full overflow-hidden bg-gray-100">
                          {provider.photoData ? (
                            <img
                              src={`data:image/jpeg;base64,${provider.photoData}`}
                              alt={provider.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold bg-gray-200">
                              {provider.name?.charAt(0) || 'P'}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                          <div className="text-sm text-gray-500">ID: {provider.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{provider.phone}</div>
                      <div className="text-sm text-gray-500">{provider.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {provider.serviceType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {provider.rating ? `${provider.rating} ⭐` : 'New'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
