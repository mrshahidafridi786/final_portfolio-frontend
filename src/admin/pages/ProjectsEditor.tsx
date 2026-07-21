import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { 
  Plus, Trash2, Edit, Save, Upload, Search, X, 
  ArrowLeft
} from 'lucide-react';

interface Project {
  _id?: string;
  title: string;
  description: string;
  heroImage: string;
  category: string;
  technologies: string[];
  liveLink?: string;
  githubLink?: string;
}

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states for technology tags
  const [techList, setTechList] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  // Cover image file states
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<Project>();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get('/projects');
      setProjects(response.data || []);
    } catch (err) {
      console.error('Error fetching projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsCreating(false);

    // Populate form fields
    setValue('title', project.title);
    setValue('category', project.category);
    setValue('description', project.description);
    setValue('liveLink', project.liveLink || '');
    setValue('githubLink', project.githubLink || '');

    setTechList(project.technologies || []);
    setHeroImageFile(null);
    setHeroImagePreview(project.heroImage || '');
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingProject(null);
    reset();

    setTechList([]);
    setHeroImageFile(null);
    setHeroImagePreview('');
  };

  const handleBack = () => {
    setIsCreating(false);
    setEditingProject(null);
    setMessage('');
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHeroImageFile(file);
      setHeroImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddTech = () => {
    if (techInput.trim()) {
      setTechList(prev => [...prev, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setTechList(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Error deleting project');
    }
  };

  const onSubmit = async (data: Project) => {
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('description', data.description);
      formData.append('liveLink', data.liveLink || '');
      formData.append('githubLink', data.githubLink || '');
      formData.append('technologies', JSON.stringify(techList));

      // Append cover image if a new file was uploaded
      if (heroImageFile) {
        formData.append('heroImage', heroImageFile);
      }

      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Project updated successfully!');
      } else {
        // Require image for new project uploads
        if (!heroImageFile) {
          throw new Error('Please upload a cover image for the new project.');
        }
        await api.post('/projects', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Project created successfully!');
      }
      
      fetchProjects();
      setTimeout(handleBack, 1500);
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setMessage(err.message || err.response?.data?.message || 'Error saving project data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCreating || editingProject) {
    return (
      <div className="space-y-8 max-w-5xl">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h3 className="text-2xl font-bold">{isCreating ? 'Create New Project' : 'Edit Project'}</h3>
            <p className="text-sm text-white/60 mt-1">Configure project metadata and links for your live websites.</p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl border ${isError ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-green-500/20 bg-green-500/10 text-green-400'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="rounded-2xl border border-white/5 bg-[#050816] p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Project Title</label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-accent-cyan text-sm"
                  placeholder="e.g. LocalTalent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Category</label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#050816] text-white focus:outline-none focus:border-accent-cyan text-sm"
                  required
                >
                  <option value="Full Stack Web App">Full Stack Web App</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Realtime Systems">Realtime Systems</option>
                  <option value="E-Commerce Development">E-Commerce Development</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Brief Summary Description</label>
              <textarea
                rows={3}
                {...register('description')}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-accent-cyan text-sm resize-none"
                placeholder="A premium services marketplace connecting local professionals with clients..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Live Application Link</label>
                <input
                  type="url"
                  {...register('liveLink')}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-accent-cyan text-sm"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">GitHub Repository URL</label>
                <input
                  type="url"
                  {...register('githubLink')}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-accent-cyan text-sm"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            {/* Technologies Tag Editor */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Core Technologies Stack</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-accent-cyan text-sm flex-1"
                  placeholder="Add technology tag, e.g. React Native"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTech(); } }}
                />
                <button type="button" onClick={handleAddTech} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {techList.map((tech, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-accent-cyan">
                    <span>{tech}</span>
                    <button type="button" onClick={() => handleRemoveTech(index)}><X size={10} className="hover:text-red-400" /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-t border-white/5 pt-6">
              <div className="flex flex-col space-y-2">
                <span className="text-xs text-white/60 font-semibold uppercase tracking-wider">Main Cover Hero Image</span>
                <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer text-xs font-bold w-fit transition-all">
                  <Upload size={14} className="text-accent-cyan" />
                  <span>Upload Image Cover</span>
                  <input type="file" onChange={handleHeroImageChange} className="hidden" accept="image/*" />
                </label>
              </div>
              <div className="md:col-span-2">
                {heroImagePreview ? (
                  <div className="relative h-32 w-56 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    <img src={heroImagePreview} alt="Cover Preview" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-32 w-56 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-xs text-white/30">No Image Uploaded</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple hover:scale-[1.02] active:scale-[0.98] px-8 py-3.5 font-sans text-sm font-bold text-white transition-all shadow-lg disabled:opacity-50 disabled:scale-100"
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Saving Project...' : 'Save Project'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold">Projects</h3>
          <p className="text-sm text-white/60 mt-1">Manage, edit, create, and delete featured projects displayed on the frontend.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple hover:scale-[1.02] active:scale-[0.98] px-6 py-3 font-sans text-sm font-bold text-white transition-all shadow-lg"
        >
          <Plus size={16} />
          <span>Add Project</span>
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
          placeholder="Search by title or category..."
        />
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-cyan"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <p className="text-sm text-white/40 italic">No projects found matching the criteria.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#050816]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-xs text-white/40 font-semibold uppercase tracking-wider bg-white/5">
                <th className="p-4 pl-6">Project Cover</th>
                <th className="p-4">Project Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Technologies</th>
                <th className="p-4 pr-6 text-right font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredProjects.map((project) => (
                <tr key={project._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="h-12 w-20 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                      <img src={project.heroImage} alt={project.title} className="h-full w-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4 font-bold text-white">{project.title}</td>
                  <td className="p-4 text-white/60">{project.category}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-[240px]">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded border border-white/5 bg-white/5 text-accent-cyan">{tech}</span>
                      ))}
                      {project.technologies.length > 3 && <span className="text-[10px] text-white/40">+{project.technologies.length - 3} more</span>}
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      title="Edit Project"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id!)}
                      className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      title="Delete Project"
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
    </div>
  );
}
