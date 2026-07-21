import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Plus, Trash2, Edit, Save, Upload, X, Award } from 'lucide-react';

interface Certificate {
  _id?: string;
  title: string;
  organization: string;
  issueDate: string;
  image: string;
}

export default function CertificatesEditor() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // File uploads
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<Certificate>();

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/certificates');
      setCerts(response.data || []);
    } catch (err) {
      console.error('Error fetching certificates', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cert: Certificate) => {
    setEditingCert(cert);
    setIsModalOpen(true);
    setValue('title', cert.title);
    setValue('organization', cert.organization);
    setValue('issueDate', cert.issueDate);
    setImagePreview(cert.image || '');
    setImageFile(null);
  };

  const handleCreateNew = () => {
    setEditingCert(null);
    setIsModalOpen(true);
    reset({
      title: '',
      organization: '',
      issueDate: ''
    });
    setImagePreview('');
    setImageFile(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCert(null);
    setMessage('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await api.delete(`/certificates/${id}`);
      fetchCerts();
    } catch (err) {
      console.error(err);
      alert('Error deleting certificate');
    }
  };

  const onSubmit = async (data: Certificate) => {
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('organization', data.organization);
      formData.append('issueDate', data.issueDate);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingCert) {
        await api.put(`/certificates/${editingCert._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/certificates', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      fetchCerts();
      handleCloseModal();
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setMessage(err.response?.data?.message || 'Error saving certificate');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold">Certificates & Achievements</h3>
          <p className="text-sm text-white/60 mt-1">Manage certifications, awarding organizations, and credential cover photos.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple hover:scale-[1.02] active:scale-[0.98] px-6 py-3 font-sans text-sm font-bold text-white transition-all shadow-lg"
        >
          <Plus size={16} />
          <span>Add Certificate</span>
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-cyan"></div>
        </div>
      ) : certs.length === 0 ? (
        <p className="text-sm text-white/40 italic">No certificates found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div key={cert._id} className="rounded-2xl border border-white/5 bg-[#050816] p-4 space-y-4 hover:border-white/10 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 relative">
                  {cert.image ? (
                    <img src={cert.image} alt={cert.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-white/5 text-white/10">
                      <Award size={48} />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white leading-snug">{cert.title}</h4>
                  <p className="text-xs text-accent-cyan mt-1">{cert.organization}</p>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">{cert.issueDate}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-white/5 pt-3">
                <button
                  onClick={() => handleEdit(cert)}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors border border-white/5"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(cert._id!)}
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
              <h4 className="text-xl font-bold">{editingCert ? 'Edit Certificate Details' : 'Add New Certificate'}</h4>
              <p className="text-xs text-white/40 mt-1">Configure title, awarding organization, and credential file.</p>
            </div>

            {message && (
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Certificate Title</label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan"
                  placeholder="e.g. Headless E-Commerce Specialist"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Awarding Organization</label>
                <input
                  type="text"
                  {...register('organization')}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan"
                  placeholder="e.g. Stripe Academy"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Issue Date</label>
                <input
                  type="text"
                  {...register('issueDate')}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan"
                  placeholder="e.g. Jan 2026"
                  required
                />
              </div>

              {/* Upload image */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <span className="block text-xs font-semibold uppercase tracking-wider text-white/60">Credential Certificate Image</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer text-xs font-bold transition-all">
                    <Upload size={14} className="text-accent-cyan" />
                    <span>Upload Photo</span>
                    <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                  </label>
                  {imagePreview && (
                    <div className="h-16 w-28 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-6 py-2.5 font-sans text-xs font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{isSubmitting ? 'Saving...' : 'Save Certificate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
