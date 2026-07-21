import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Plus, Trash2, Save, Upload, User } from 'lucide-react';

interface CtaButton {
  label: string;
  action: string;
  primary: boolean;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface HeroFormInputs {
  name: string;
  title: string;
  subtitle: string;
}

export default function HeroEditor() {
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [ctaButtons, setCtaButtons] = useState<CtaButton[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { register, handleSubmit, setValue } = useForm<HeroFormInputs>();

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await api.get('/hero');
        if (response.data) {
          const { name, title, subtitle, profileImage, ctaButtons: ctas, socialLinks: socials } = response.data;
          setValue('name', name);
          setValue('title', title);
          setValue('subtitle', subtitle);
          setImagePreview(profileImage);
          setCtaButtons(ctas || []);
          setSocialLinks(socials || []);
        }
      } catch (err) {
        console.error('Error fetching hero data', err);
      }
    };
    fetchHeroData();
  }, [setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddCta = () => {
    setCtaButtons(prev => [...prev, { label: 'New CTA', action: '#', primary: false }]);
  };

  const handleRemoveCta = (index: number) => {
    setCtaButtons(prev => prev.filter((_, i) => i !== index));
  };

  const handleCtaChange = (index: number, field: keyof CtaButton, value: any) => {
    setCtaButtons(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  const handleAddSocial = () => {
    setSocialLinks(prev => [...prev, { platform: 'github', url: '' }]);
  };

  const handleRemoveSocial = (index: number) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSocialChange = (index: number, field: keyof SocialLink, value: string) => {
    setSocialLinks(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const onSubmit = async (data: HeroFormInputs) => {
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('title', data.title);
      formData.append('subtitle', data.subtitle);
      formData.append('ctaButtons', JSON.stringify(ctaButtons));
      formData.append('socialLinks', JSON.stringify(socialLinks));

      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }

      await api.put('/hero', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Hero section successfully updated!');
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setMessage(err.response?.data?.message || 'Error updating hero data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h3 className="text-2xl font-bold">Hero Section Editor</h3>
        <p className="text-sm text-white/60 mt-1">Manage the hero profile image, titles, call to actions, and social profiles links.</p>
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
              <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Profile Image</span>
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
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Developer Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan transition-colors"
                  placeholder="e.g. Shahid Afridi"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Main Subtitle / Profession</label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan transition-colors"
                  placeholder="e.g. MERN Stack & React Native Developer"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Detailed Narrative Biography Pitch</label>
            <textarea
              rows={4}
              {...register('subtitle')}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan transition-colors resize-none"
              placeholder="Provide a short marketing pitch describing your key focus..."
            />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="rounded-2xl border border-white/5 bg-[#050816] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h4 className="font-bold text-lg">Call to Action Buttons</h4>
            <button
              type="button"
              onClick={handleAddCta}
              className="flex items-center gap-2 rounded-xl bg-accent-blue/20 hover:bg-accent-blue/30 px-4 py-2 font-sans text-xs font-bold text-accent-blue transition-all"
            >
              <Plus size={14} />
              <span>Add Button</span>
            </button>
          </div>

          {ctaButtons.length === 0 ? (
            <p className="text-sm text-white/40 italic">No buttons configured.</p>
          ) : (
            <div className="space-y-4">
              {ctaButtons.map((cta, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border border-white/5 p-4 rounded-xl bg-white/5">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-white/40 mb-1">Button Label</label>
                    <input
                      type="text"
                      value={cta.label}
                      onChange={(e) => handleCtaChange(index, 'label', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-white/40 mb-1">Target Action Link</label>
                    <input
                      type="text"
                      value={cta.action}
                      onChange={(e) => handleCtaChange(index, 'action', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-4">
                    <input
                      type="checkbox"
                      checked={cta.primary}
                      onChange={(e) => handleCtaChange(index, 'primary', e.target.checked)}
                      id={`cta-prim-${index}`}
                      className="rounded bg-white/5 border-white/10 text-accent-blue focus:ring-0"
                    />
                    <label htmlFor={`cta-prim-${index}`} className="text-xs text-white/60">Primary Style</label>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveCta(index)}
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

        {/* Social Links */}
        <div className="rounded-2xl border border-white/5 bg-[#050816] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h4 className="font-bold text-lg">Social Profile Handles</h4>
            <button
              type="button"
              onClick={handleAddSocial}
              className="flex items-center gap-2 rounded-xl bg-accent-purple/20 hover:bg-accent-purple/30 px-4 py-2 font-sans text-xs font-bold text-accent-purple transition-all"
            >
              <Plus size={14} />
              <span>Add Social Profile</span>
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
                    <label className="block text-[10px] uppercase font-semibold text-white/40 mb-1">Complete URL Address</label>
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
            <span>{isSubmitting ? 'Saving Changes...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
