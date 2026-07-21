import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Upload, Trash2, FileText, Download, Save } from 'lucide-react';

export default function ResumeEditor() {
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    setLoading(true);
    try {
      const response = await api.get('/resume');
      if (response.data) {
        setResumeUrl(response.data.resumeUrl || '');
      }
    } catch (err) {
      console.error('Error fetching resume', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete the active CV document?')) return;
    setIsSubmitting(true);
    try {
      await api.delete('/resume');
      setResumeUrl('');
      setResumeFile(null);
      setMessage('CV Document successfully deleted.');
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error deleting CV');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return;

    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const response = await api.post('/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data) {
        setResumeUrl(response.data.resumeUrl || '');
        setResumeFile(null);
        setMessage('CV Document successfully uploaded and integrated!');
      }
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setMessage(err.response?.data?.message || 'Error uploading CV document');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h3 className="text-2xl font-bold">Resume CV Manager</h3>
        <p className="text-sm text-white/60 mt-1">Upload, replace, and manage your downloadable professional curriculum vitae document (PDF format).</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border ${isError ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-green-500/20 bg-green-500/10 text-green-400'}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-cyan"></div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-[#050816] p-6 space-y-6">
          <div className="flex items-center gap-4 border border-white/10 p-4 rounded-xl bg-white/5">
            <div className="p-3 bg-accent-blue/10 rounded-xl text-accent-blue">
              <FileText size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-white/40 uppercase tracking-wider block font-semibold">Active CV Document</span>
              {resumeUrl ? (
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent-cyan hover:underline truncate block max-w-md font-mono"
                  >
                    {resumeUrl.split('/').pop() || 'resume.pdf'}
                  </a>
                </div>
              ) : (
                <span className="text-sm text-white/40 italic block mt-0.5">No document uploaded yet. Falls back to default.</span>
              )}
            </div>
            {resumeUrl && (
              <div className="flex gap-2">
                <a
                  href={resumeUrl}
                  download
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 border border-white/5"
                  title="Download File"
                >
                  <Download size={16} />
                </a>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-white/5"
                  title="Delete Document"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-wider text-white/60">Upload New Resume File (PDF Only)</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer text-xs font-bold transition-all">
                  <Upload size={14} className="text-accent-cyan" />
                  <span>Choose PDF Document</span>
                  <input type="file" onChange={handleFileChange} className="hidden" accept="application/pdf" />
                </label>
                {resumeFile && (
                  <span className="text-xs text-white/60 font-mono truncate max-w-xs">{resumeFile.name}</span>
                )}
              </div>
            </div>

            {resumeFile && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple hover:scale-[1.02] active:scale-[0.98] px-6 py-2.5 font-sans text-xs font-bold text-white transition-all shadow-lg"
                >
                  <Save size={14} />
                  <span>Upload & Integrate</span>
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
