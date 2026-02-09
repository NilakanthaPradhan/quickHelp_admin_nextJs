'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Check, X, Clock, MapPin } from 'lucide-react';

interface RequestData {
  id: number;
  name: string;
  serviceType: string;
  description: string;
  location: string;
  phoneNumber: string;
  lat: number;
  lng: number;
  status: string; // PENDING, APPROVED, REJECTED
  photoData?: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/provider-requests');
      if (response.status === 200) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    if(!confirm('Approve this provider?')) return;
    try {
      await api.post(`/provider-requests/${id}/approve`);
      fetchRequests(); // Refresh
    } catch (error) {
      console.error('Error approving:', error);
      alert('Failed to approve request');
    }
  };

  const handleReject = async (id: number) => {
    if(!confirm('Reject this provider?')) return;
    try {
      await api.post(`/provider-requests/${id}/reject`);
      fetchRequests(); // Refresh
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Failed to reject request');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
        Provider Requests
      </h2>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800">
           <Clock className="mx-auto h-12 w-12 text-slate-600 mb-4" />
           <p className="text-slate-400 text-lg">No pending requests</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {requests.map(req => (
            <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
              <div className="relative h-48 bg-slate-800">
                {req.photoData ? (
                  <img src={`data:image/jpeg;base64,${req.photoData}`} alt={req.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                    No Photo
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                  {req.serviceType}
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">{req.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{req.location}</span>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm line-clamp-3">
                  {req.description}
                </p>
                
                <div className="pt-4 flex gap-3 border-t border-slate-800">
                  <button 
                    onClick={() => handleApprove(req.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button 
                    onClick={() => handleReject(req.id)}
                    className="flex-1 bg-slate-800 hover:bg-red-900/30 hover:text-red-400 text-slate-300 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" /> Reject
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
