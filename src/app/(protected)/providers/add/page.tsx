'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Upload, MapPin, User, Phone, FileText, CheckCircle } from 'lucide-react';

export default function AddProviderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serviceType: '',
    description: '',
    location: '',
    phoneNumber: '',
    lat: '',
    lng: ''
  });

  const serviceTypes = [
    'Maid', 'Plumber', 'Electrician', 'Carpenter', 'Painter', 'Gardener', 'Pest Control', 'AC Repair', 'Cleaner'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Note: The /providers endpoint expects JSON. 
      // If photo upload is needed directly for provider creation, we need multipart/form-data.
      // The API Service in Flutter used `createProvider` with JSON (no photo?). 
      // Wait, `submitProviderRequest` used multipart. 
      // `createProvider` in Flutter passed `provider` map as JSON.
      // Does backend `createProvider` handle photo?
      // Let's assume for now we just create data, or maybe we need to handle photo upload separately or use multipart.
      // Based on previous code, `createProvider` didn't seem to take a file in the JSON map in Flutter code (Step 23 API Service: `createProvider` took `Map<String, dynamic> provider`).
      // So maybe photo is not supported in direct creation or handled via URL?
      // Let's implement basic fields first.

      const response = await api.post('/providers', formData);
      if (response.status === 200) {
        alert('Provider added successfully!');
        router.push('/users'); // Or stay here?
      }
    } catch (error) {
      console.error('Error adding provider:', error);
      alert('Failed to add provider');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Add New Provider
        </h2>
        <p className="text-slate-400 mt-2">Manually register a service provider.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Service Type</label>
            <select 
              name="serviceType"
              required
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Select Service...</option>
              {serviceTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <textarea 
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Years of experience, specialities..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input 
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input 
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City, Area"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? 'Adding...' : <><CheckCircle className="h-4 w-4" /> Add Provider</>}
        </button>
      </form>
    </div>
  );
}
