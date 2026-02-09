'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Plus, MapPin, Home, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Rental {
  id: number;
  title: string;
  price: string;
  location: string;
  tenantType: string;
  photos: string[];
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await api.get('/rentals');
      if (response.status === 200) {
        setRentals(response.data);
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm('Delete this rental?')) return;
    try {
      await api.delete(`/rentals/${id}`);
      setRentals(rentals.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting rental:', error);
      alert('Failed to delete rental');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Rentals
        </h2>
        <Link 
          href="/rentals/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Rental
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading rentals...</div>
      ) : rentals.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800">
           <Home className="mx-auto h-12 w-12 text-slate-600 mb-4" />
           <p className="text-slate-400 text-lg">No rentals listed yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rentals.map(rental => (
            <div key={rental.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors group">
              <div className="relative h-48 bg-slate-800">
                {rental.photos && rental.photos.length > 0 ? (
                  <img src={`data:image/jpeg;base64,${rental.photos[0]}`} alt={rental.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                    <Home className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                  {rental.tenantType}
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-100 line-clamp-1">{rental.title}</h3>
                  <button 
                    onClick={() => handleDelete(rental.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{rental.location}</span>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <span className="text-blue-400 font-bold text-lg">{rental.price}</span>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                    {rental.photos?.length || 0} Photos
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
