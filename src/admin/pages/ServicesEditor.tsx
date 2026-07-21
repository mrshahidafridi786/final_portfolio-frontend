import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

interface Service {
  _id?: string;
  name: string;
  description: string;
  icon: string;
}

export default function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<Service>();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/services');
      setServices(response.data || []);
    } catch (err) {
      console.error('Error fetching services', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
    setValue('name', service.name);
    setValue('description', service.description);
    setValue('icon', service.icon);
  };

  const handleCreateNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
    reset({
      name: '',
      description: '',
      icon: 'FaCode'
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setMessage('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
      alert('Error deleting service');
    }
  };

  const onSubmit = async (data: Service) => {
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      if (editingService) {
        await api.put(`/services/${editingService._id}`, data);
      } else {
        await api.post('/services', data);
      }
      fetchServices();
      handleCloseModal();
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setMessage(err.response?.data?.message || 'Error saving service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold">Services CRUD Manager</h3>
          <p className="text-sm text-white/60 mt-1">Manage consulting services, description highlights, and icon classes.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple hover:scale-[1.02] active:scale-[0.98] px-6 py-3 font-sans text-sm font-bold text-white transition-all shadow-lg"
        >
          <Plus size={16} />
          <span>Add Service</span>
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-cyan"></div>
        </div>
      ) : services.length === 0 ? (
        <p className="text-sm text-white/40 italic">No services registered.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service._id} className="rounded-2xl border border-white/5 bg-[#050816] p-6 hover:border-white/10 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-lg">{service.name}</h4>
                  <span className="text-xs text-accent-cyan font-mono bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/20">{service.icon}</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{service.description}</p>
              </div>
              <div className="flex justify-end gap-2 border-t border-white/5 pt-4 mt-4">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors border border-white/5"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(service._id!)}
                  className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border border-white/5"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="w-full max-w-md rounded-2xl p-6 border border-white/10 bg-[#090d22] z-10 space-y-6 shadow-2xl relative">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X size={18} />
            </button>

            <div>
              <h4 className="text-xl font-bold">{editingService ? 'Edit Service Details' : 'Create New Service'}</h4>
              <p className="text-xs text-white/40 mt-1">Configure service category name, text details, and icons.</p>
            </div>

            {message && (
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Service Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan"
                  placeholder="e.g. Full-Stack MERN Development"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">React-Icon Name</label>
                <input
                  type="text"
                  {...register('icon')}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan font-mono"
                  placeholder="e.g. FaCode or FaMobileAlt"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Service Summary Description</label>
                <textarea
                  rows={4}
                  {...register('description')}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
                  placeholder="Describe your service deliverables..."
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-6 py-2.5 font-sans text-xs font-bold text-white hover:scale-105 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{isSubmitting ? 'Saving...' : 'Save Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
