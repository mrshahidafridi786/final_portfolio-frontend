import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Plus, Trash2, Edit, Save, X, ArrowLeft } from 'lucide-react';

interface Experience {
  _id?: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  _id?: string;
  institution: string;
  degree: string;
  duration: string;
  description: string;
}

export default function ExperienceEducationEditor() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'experience' | 'education'>('experience');
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<any>();

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const fetchTimelineData = async () => {
    setLoading(true);
    try {
      const [expRes, eduRes] = await Promise.all([
        api.get('/experience'),
        api.get('/education')
      ]);
      setExperiences(expRes.data || []);
      setEducations(eduRes.data || []);
    } catch (err) {
      console.error('Error fetching timeline data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);

    if (activeSubTab === 'experience') {
      setValue('company', item.company);
      setValue('position', item.position);
      setValue('duration', item.duration);
      setValue('description', item.description);
    } else {
      setValue('institution', item.institution);
      setValue('degree', item.degree);
      setValue('duration', item.duration);
      setValue('description', item.description);
    }
  };

  const handleCreateNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
    reset({
      company: '',
      position: '',
      institution: '',
      degree: '',
      duration: '',
      description: ''
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setMessage('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${activeSubTab} record?`)) return;
    try {
      if (activeSubTab === 'experience') {
        await api.delete(`/experience/${id}`);
      } else {
        await api.delete(`/education/${id}`);
      }
      fetchTimelineData();
    } catch (err) {
      console.error(err);
      alert('Error deleting record');
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      if (activeSubTab === 'experience') {
        const payload = {
          company: data.company,
          position: data.position,
          duration: data.duration,
          description: data.description
        };
        if (editingItem) {
          await api.put(`/experience/${editingItem._id}`, payload);
        } else {
          await api.post('/experience', payload);
        }
      } else {
        const payload = {
          institution: data.institution,
          degree: data.degree,
          duration: data.duration,
          description: data.description
        };
        if (editingItem) {
          await api.put(`/education/${editingItem._id}`, payload);
        } else {
          await api.post('/education', payload);
        }
      }
      fetchTimelineData();
      handleCloseModal();
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setMessage(err.response?.data?.message || 'Error saving timeline record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold">Timeline History Manager</h3>
          <p className="text-sm text-white/60 mt-1">Manage professional work history and educational milestones.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple hover:scale-[1.02] active:scale-[0.98] px-6 py-3 font-sans text-sm font-bold text-white transition-all shadow-lg"
        >
          <Plus size={16} />
          <span>Add {activeSubTab === 'experience' ? 'Work Experience' : 'Education'}</span>
        </button>
      </div>

      {/* Sub-tab selection */}
      <div className="flex border-b border-white/5 space-x-6 text-sm">
        <button
          onClick={() => setActiveSubTab('experience')}
          className={`pb-3 font-semibold transition-all ${activeSubTab === 'experience' ? 'border-b-2 border-accent-cyan text-accent-cyan' : 'text-white/40 hover:text-white/60'}`}
        >
          Professional Experience
        </button>
        <button
          onClick={() => setActiveSubTab('education')}
          className={`pb-3 font-semibold transition-all ${activeSubTab === 'education' ? 'border-b-2 border-accent-cyan text-accent-cyan' : 'text-white/40 hover:text-white/60'}`}
        >
          Academic Education
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-cyan"></div>
        </div>
      ) : activeSubTab === 'experience' ? (
        /* Experience List */
        experiences.length === 0 ? (
          <p className="text-sm text-white/40 italic">No experience records found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {experiences.map((exp) => (
              <div key={exp._id} className="rounded-2xl border border-white/5 bg-[#050816] p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-white/10 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-lg">{exp.position}</span>
                    <span className="text-xs text-accent-cyan bg-accent-blue/10 px-2.5 py-0.5 rounded-full border border-accent-blue/20">{exp.company}</span>
                  </div>
                  <div className="text-xs text-white/40 font-semibold uppercase tracking-wider">{exp.duration}</div>
                  <p className="text-sm text-white/60 leading-relaxed max-w-3xl">{exp.description}</p>
                </div>
                <div className="flex gap-2 shrink-0 justify-end">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors border border-white/5"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id!)}
                    className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border border-white/5"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Education List */
        educations.length === 0 ? (
          <p className="text-sm text-white/40 italic">No education records found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {educations.map((edu) => (
              <div key={edu._id} className="rounded-2xl border border-white/5 bg-[#050816] p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-white/10 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-lg">{edu.degree}</span>
                    <span className="text-xs text-accent-purple bg-accent-purple/10 px-2.5 py-0.5 rounded-full border border-accent-purple/20">{edu.institution}</span>
                  </div>
                  <div className="text-xs text-white/40 font-semibold uppercase tracking-wider">{edu.duration}</div>
                  <p className="text-sm text-white/60 leading-relaxed max-w-3xl">{edu.description}</p>
                </div>
                <div className="flex gap-2 shrink-0 justify-end">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors border border-white/5"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(edu._id!)}
                    className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border border-white/5"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="w-full max-w-lg rounded-2xl p-6 border border-white/10 bg-[#090d22] z-10 space-y-6 shadow-2xl relative">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X size={18} />
            </button>

            <div>
              <h4 className="text-xl font-bold">
                {editingItem ? 'Edit Timeline Record' : 'Create Timeline Record'} ({activeSubTab === 'experience' ? 'Experience' : 'Education'})
              </h4>
              <p className="text-xs text-white/40 mt-1">Configure company, credentials, duration, and detailed summary.</p>
            </div>

            {message && (
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {activeSubTab === 'experience' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Company Name</label>
                      <input
                        type="text"
                        {...register('company')}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan"
                        placeholder="e.g. Acme Corp"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Position Title</label>
                      <input
                        type="text"
                        {...register('position')}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan"
                        placeholder="e.g. MERN Developer"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Academic Institute</label>
                      <input
                        type="text"
                        {...register('institution')}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan"
                        placeholder="e.g. University of Peshawar"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Degree Earned</label>
                      <input
                        type="text"
                        {...register('degree')}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan"
                        placeholder="e.g. BS Computer Science"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Duration Period</label>
                <input
                  type="text"
                  {...register('duration')}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan"
                  placeholder="e.g. 2024 - 2028 or 2024 - Present"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Detailed Task Summary</label>
                <textarea
                  rows={4}
                  {...register('description')}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none font-sans"
                  placeholder="Summarize key tasks, achievements or courses..."
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-6 py-2.5 font-sans text-xs font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{isSubmitting ? 'Saving...' : 'Save Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
