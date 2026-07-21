import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Plus, Trash2, Edit, Save, Search, X } from 'lucide-react';

interface Skill {
  _id?: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'other';
  level: number;
  iconName: string;
}

export default function SkillsEditor() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<Skill>();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await api.get('/skills');
      setSkills(response.data || []);
    } catch (err) {
      console.error('Error fetching skills', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
    setValue('name', skill.name);
    setValue('category', skill.category);
    setValue('level', skill.level);
    setValue('iconName', skill.iconName);
  };

  const handleCreateNew = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
    reset({
      name: '',
      category: 'frontend',
      level: 90,
      iconName: ''
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setMessage('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      fetchSkills();
    } catch (err) {
      console.error(err);
      alert('Error deleting skill');
    }
  };

  const onSubmit = async (data: Skill) => {
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      if (editingSkill) {
        await api.put(`/skills/${editingSkill._id}`, data);
      } else {
        await api.post('/skills', data);
      }
      fetchSkills();
      handleCloseModal();
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setMessage(err.response?.data?.message || 'Error saving skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSkills = skills.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold">Skills Catalog CRUD</h3>
          <p className="text-sm text-white/60 mt-1">Manage core competencies, category classifications, level bars, and icons.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple hover:scale-[1.02] active:scale-[0.98] px-6 py-3 font-sans text-sm font-bold text-white transition-all shadow-lg"
        >
          <Plus size={16} />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 rounded-xl max-w-md">
        <Search size={18} className="text-white/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent focus:outline-none text-sm placeholder-white/30 text-white"
          placeholder="Search skills by name..."
        />
      </div>

      {/* Table view */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-cyan"></div>
        </div>
      ) : filteredSkills.length === 0 ? (
        <p className="text-sm text-white/40 italic">No skills registered.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#050816]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-xs text-white/40 font-semibold uppercase tracking-wider bg-white/5">
                <th className="p-4 pl-6">Skill Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Proficiency Level</th>
                <th className="p-4">React-Icon Name</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredSkills.map((skill) => (
                <tr key={skill._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 pl-6 font-bold text-white">{skill.name}</td>
                  <td className="p-4 text-white/60 capitalize">{skill.category}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-white/10 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-accent-blue to-accent-cyan h-full rounded-full" style={{ width: `${skill.level}%` }}></div>
                      </div>
                      <span className="text-xs text-white/80 font-mono">{skill.level}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-white/60 font-mono text-xs">{skill.iconName}</td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      title="Edit Skill"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id!)}
                      className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      title="Delete Skill"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <h4 className="text-xl font-bold">{editingSkill ? 'Edit Skill Element' : 'Add New Skill Element'}</h4>
              <p className="text-xs text-white/40 mt-1">Configure skill title and proficiency percentages.</p>
            </div>

            {message && (
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Skill Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan"
                  placeholder="e.g. React Native"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Category Group</label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan"
                  >
                    <option value="frontend" className="bg-[#090d22]">Frontend UI</option>
                    <option value="backend" className="bg-[#090d22]">Backend API</option>
                    <option value="database" className="bg-[#090d22]">Databases</option>
                    <option value="tools" className="bg-[#090d22]">DevOps & Tools</option>
                    <option value="other" className="bg-[#090d22]">Other Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Level (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    {...register('level', { valueAsNumber: true })}
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">React-Icon Name (exact mapping)</label>
                <input
                  type="text"
                  {...register('iconName')}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-accent-cyan font-mono"
                  placeholder="e.g. TbBrandReactNative"
                  required
                />
                <p className="text-[10px] text-white/40 mt-1">Accepts standard Lucide, FontAwesome, or Feather mapped strings.</p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-6 py-2.5 font-sans text-xs font-bold text-white hover:scale-105 active:scale-98 transition-all disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{isSubmitting ? 'Saving...' : 'Save Skill'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
