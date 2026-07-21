import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Plus, Trash2, Save, Upload, User } from 'lucide-react';

interface Statistic {
  label: string;
  value: string;
}

interface AboutFormInputs {
  description: string;
}

export default function AboutEditor() {
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { register, handleSubmit, setValue } = useForm<AboutFormInputs>();

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await api.get('/about');
        if (response.data) {
          const { description, profileImage, statistics: stats } = response.data;
          setValue('description', description);
          setImagePreview(profileImage);
          setStatistics(stats || []);
        }
      } catch (err) {
        console.error('Error fetching about data', err);
      }
    };
    fetchAboutData();
  }, [setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddStat = () => {
    setStatistics(prev => [...prev, { label: 'Metric Name', value: 'Value' }]);
  };

  const handleRemoveStat = (index: number) => {
    setStatistics(prev => prev.filter((_, i) => i !== index));
  };

  const handleStatChange = (index: number, field: keyof Statistic, value: string) => {
    setStatistics(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const onSubmit = async (data: AboutFormInputs) => {
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      const formData = new FormData();
      formData.append('description', data.description);
      formData.append('statistics', JSON.stringify(statistics));

      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }

      await api.put('/about', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('About section successfully updated!');
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setMessage(err.response?.data?.message || 'Error updating about data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h3 className="text-2xl font-bold">About Section Editor</h3>
        <p className="text-sm text-white/60 mt-1">Manage the close-up profile photo, biography description, and quick numeric metrics.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border ${isError ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-green-500/20 bg-green-500/10 text-green-400'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-2xl border border-white/5 bg-[#050816] p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Image Preview & Upload */}
            <div className="md:col-span-1 flex flex-col items-center space-y-4">
              <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Close-Up Portrait</span>
              <div className="relative h-44 w-44 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <User size={48} className="text-white/20" />
                )}
              </div>
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer text-xs font-bold transition-all">
                <Upload size={14} className="text-accent-cyan" />
                <span>Upload Photo</span>
                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
              </label>
            </div>

            {/* Core Info */}
            <div className="md:col-span-2 space-y-4 h-full">
              <div className="h-full flex flex-col justify-center">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Detailed Biography Narrative</label>
                <textarea
                  rows={6}
                  {...register('description')}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan transition-colors resize-none"
                  placeholder="Tell your professional story..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="rounded-2xl border border-white/5 bg-[#050816] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h4 className="font-bold text-lg">Key Numeric Highlights / Metrics</h4>
            <button
              type="button"
              onClick={handleAddStat}
              className="flex items-center gap-2 rounded-xl bg-accent-blue/20 hover:bg-accent-blue/30 px-4 py-2 font-sans text-xs font-bold text-accent-blue transition-all"
            >
              <Plus size={14} />
              <span>Add Metric</span>
            </button>
          </div>

          {statistics.length === 0 ? (
            <p className="text-sm text-white/40 italic">No metrics configured.</p>
          ) : (
            <div className="space-y-4">
              {statistics.map((stat, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border border-white/5 p-4 rounded-xl bg-white/5">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-white/40 mb-1">Metric Title</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm"
                      placeholder="e.g. Projects Completed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-white/40 mb-1">Metric Value</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm"
                      placeholder="e.g. 10+"
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveStat(index)}
                      className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple hover:scale-[1.02] active:scale-[0.98] px-8 py-3.5 font-sans text-sm font-bold text-white transition-all shadow-lg disabled:opacity-50 disabled:scale-100"
          >
            <Save size={16} />
            <span>{isSubmitting ? 'Saving Changes...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
