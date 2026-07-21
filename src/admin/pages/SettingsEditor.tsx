import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Save, Plus, Trash2 } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
}

interface SettingsFormInputs {
  email: string;
  phone: string;
  location: string;
}

export default function SettingsEditor() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { register, handleSubmit, setValue } = useForm<SettingsFormInputs>();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data) {
          const { email, phone, location, socialLinks: socials } = response.data;
          setValue('email', email);
          setValue('phone', phone);
          setValue('location', location);
          setSocialLinks(socials || []);
        }
      } catch (err) {
        console.error('Error fetching settings', err);
      }
    };
    fetchSettings();
  }, [setValue]);

  const handleAddSocial = () => {
    setSocialLinks(prev => [...prev, { platform: 'github', url: '' }]);
  };

  const handleRemoveSocial = (index: number) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSocialChange = (index: number, field: keyof SocialLink, value: string) => {
    setSocialLinks(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const onSubmit = async (data: SettingsFormInputs) => {
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      const payload = {
        ...data,
        socialLinks
      };
      await api.put('/settings', payload);
      setMessage('Global website settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setMessage(err.response?.data?.message || 'Error saving settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h3 className="text-2xl font-bold">Global Website Settings</h3>
        <p className="text-sm text-white/60 mt-1">Manage global contact channels (email, phone, location) and social footer link cards.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border ${isError ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-green-500/20 bg-green-500/10 text-green-400'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-2xl border border-white/5 bg-[#050816] p-6 space-y-4">
          <h4 className="font-bold text-lg border-b border-white/5 pb-3">Contact Channels</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Primary Email Address</label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan text-sm"
                placeholder="e.g. shahidullahafridi31@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Phone / WhatsApp Number</label>
              <input
                type="text"
                {...register('phone')}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan text-sm"
                placeholder="e.g. 03178533838"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Physical Location</label>
              <input
                type="text"
                {...register('location')}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan text-sm"
                placeholder="e.g. Peshawar, Pakistan"
                required
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-2xl border border-white/5 bg-[#050816] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h4 className="font-bold text-lg">Global Footer Social Links</h4>
            <button
              type="button"
              onClick={handleAddSocial}
              className="flex items-center gap-2 rounded-xl bg-accent-purple/20 hover:bg-accent-purple/30 px-4 py-2 font-sans text-xs font-bold text-accent-purple transition-all"
            >
              <Plus size={14} />
              <span>Add Social Handle</span>
            </button>
          </div>

          {socialLinks.length === 0 ? (
            <p className="text-sm text-white/40 italic">No social links configured.</p>
          ) : (
            <div className="space-y-4">
              {socialLinks.map((social, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border border-white/5 p-4 rounded-xl bg-white/5">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-white/40 mb-1">Platform</label>
                    <select
                      value={social.platform}
                      onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none"
                    >
                      <option value="github" className="bg-[#090d22]">GitHub</option>
                      <option value="linkedin" className="bg-[#090d22]">LinkedIn</option>
                      <option value="whatsapp" className="bg-[#090d22]">WhatsApp</option>
                      <option value="email" className="bg-[#090d22]">Email</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-white/40 mb-1">Profile Link</label>
                    <input
                      type="text"
                      value={social.url}
                      onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveSocial(index)}
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
            <span>{isSubmitting ? 'Saving Settings...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
