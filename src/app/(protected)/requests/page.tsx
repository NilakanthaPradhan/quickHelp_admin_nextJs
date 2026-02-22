'use client';
import { useState, useEffect } from 'react';

export default function ProviderRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/public/provider-requests');
      if (res.ok) {
        const data = await res.json();
        // Assuming we only want to show PENDING requests, or the backend already filters them
        setRequests(data);
      }
    } catch (error) {
      console.error('Failed to fetch provider requests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/public/provider-requests/${id}/approve`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Provider approved successfully!');
        fetchRequests(); // Refresh the list
      } else {
        alert('Failed to approve provider.');
      }
    } catch (error) {
      console.error('Error approving provider', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      // Assuming you have a reject endpoint, or we just delete it
      const res = await fetch(`http://localhost:8080/api/public/provider-requests/${id}/reject`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Provider request rejected.');
        fetchRequests();
      } else {
        alert('Failed to reject provider.');
      }
    } catch (error) {
      console.error('Error rejecting provider', error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading requests...</div>;
  }

  const pendingRequests = requests.filter(r => r.status === 'PENDING');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Provider Requests</h1>

      {pendingRequests.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
          No pending provider requests.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingRequests.map((request: any) => (
            <div key={request.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
              {request.photoData && (
                <div className="h-48 w-full bg-gray-200 relative">
                  <img 
                    src={`data:image/jpeg;base64,${request.photoData}`} 
                    alt={request.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{request.name}</h3>
                    <span className="inline-block mt-1 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                      {request.serviceType}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6 flex-grow">
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold">Phone:</span> {request.phoneNumber}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold">Email:</span> {request.email || 'N/A'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold">Location:</span> {request.location}
                  </p>
                  <p className="text-gray-700 text-sm mt-3 italic line-clamp-3">
                    "{request.description}"
                  </p>
                </div>

                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleReject(request.id)}
                    className="flex-1 py-2 px-4 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
