'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { MapPin, User, Phone, Home, FileText, CheckCircle, Image as ImageIcon, X, Plus } from 'lucide-react';


export default function AddRentalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [category, setCategory] = useState<'BACHELOR' | 'FAMILY'>('BACHELOR');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    lat: '',
    lng: '',
    ownerName: '',
    ownerPhone: '',
    amenities: '' // comma separated
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Extract purely the base64 part if needed, but usually src="data:..." works. 
          // However, our backend might expect just base64. 
          // Let's split if it contains comma.
          const base64 = base64String.split(',')[1]; 
          setPhotos(prev => [...prev, base64]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tenantType: category,
        amenities: formData.amenities.split(',').map(s => s.trim()).filter(s => s),
        photos: photos,
        lat: parseFloat(formData.lat) || 0.0,
        lng: parseFloat(formData.lng) || 0.0
      };

      const response = await api.post('/rentals', payload);
      if (response.status === 200) {
        alert('Rental added successfully!');
        router.push('/rentals');
      }
    } catch (error) {
      console.error('Error adding rental:', error);
      alert('Failed to add rental');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          List New Rental
        </h2>
        <p className="text-slate-400 mt-2">Add a new property for rent.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-500" /> Property Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Title</label>
                <input 
                  name="title" required value={formData.title} onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Spacious 2BHK in Indiranagar"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1">Price</label>
                  <input 
                    name="price" required value={formData.price} onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. ₹15,000/mo"
                  />
                </div>
                <div>
                   <label className="text-sm font-medium text-slate-300 block mb-1">Tenant Type</label>
                   <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                     <button
                       type="button"
                       onClick={() => setCategory('BACHELOR')}
                       className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${category === 'BACHELOR' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                     >
                       Bachelor
                     </button>
                     <button
                       type="button"
                       onClick={() => setCategory('FAMILY')}
                       className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${category === 'FAMILY' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                     >
                       Family
                     </button>
                   </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Description</label>
                <textarea 
                  name="description" required value={formData.description} onChange={handleChange} rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the property..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Amenities</label>
                <input 
                  name="amenities" value={formData.amenities} onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="WiFi, Parking, AC (comma separated)"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" /> Location
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Address/Area</label>
                <input 
                  name="location" required value={formData.location} onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Koramangala 4th Block"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1">Latitude</label>
                  <input 
                    name="lat" type="number" step="any" value={formData.lat} onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12.9716"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1">Longitude</label>
                  <input 
                    name="lng" type="number" step="any" value={formData.lng} onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="77.5946"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Owner & Photos */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-purple-500" /> Owner Info
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Name</label>
                <input 
                  name="ownerName" required value={formData.ownerName} onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Owner Name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Phone</label>
                <input 
                  name="ownerPhone" required value={formData.ownerPhone} onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contact Number"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6">
             <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-yellow-500" /> Photos
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {photos.map((p, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={`data:image/jpeg;base64,${p}`} alt="" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-colors">
                <Plus className="h-6 w-6 mb-1" />
                <span className="text-xs">Add</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <p className="text-xs text-slate-500">Supported types: JPG, PNG. Max 5MB.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? 'Publishing...' : <><CheckCircle className="h-5 w-5" /> Publish Rental</>}
          </button>
        </div>
      </form>
    </div>
  );
}
