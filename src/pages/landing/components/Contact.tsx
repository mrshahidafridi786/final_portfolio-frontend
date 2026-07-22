import { useState } from 'react';
import { FaPaperPlane, FaWhatsapp, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import confetti from 'canvas-confetti';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic frontend verification
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setStatusMessage('Please complete all required fields (Name, Email, and Message).');
      return;
    }

    setStatus('loading');

    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setStatusMessage(data.message);
        
        // Trigger high-end celebration confetti explosion
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#a855f7', '#06b6d4', '#ffffff']
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setStatus('error');
        setStatusMessage(data.message || 'There was a problem submitting your message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submission failure:', err);
      setStatus('error');
      setStatusMessage('Unable to reach the server. Please verify your internet connection or email directly.');
    }
  };

  return (
    <section id="contact" className="relative z-10 py-24 px-6 bg-[#050816]">
      {/* Decorative glows */}
      <div className="glow-backdrop-cyan left-[10%] bottom-[5%]" />
      <div className="glow-backdrop-purple right-[10%] top-[5%]" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-sans text-xs font-bold tracking-widest text-accent-cyan uppercase mb-3">
            Get In Touch
          </h2>
          <h3 className="font-sans text-3xl font-extrabold tracking-tight sm:text-5xl">
            Start A Conversation
          </h3>
          <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 items-start">
          {/* Info Side panel */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h4 className="font-sans text-2xl font-extrabold text-white">
                Let's discuss your project.
              </h4>
              <p className="font-sans text-sm text-text-secondary leading-relaxed max-w-md">
                Whether you need a high-performance web application, a database optimization overhaul, or a custom REST API integration—I can help. Fill out the form or reach out directly.
              </p>
            </div>

            <div className="space-y-4 font-sans text-sm">
              {/* Location */}
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-cyan">
                  <FaMapMarkerAlt size={16} />
                </div>
                <div>
                  <div className="text-text-secondary text-xs font-semibold uppercase">Location</div>
                  <div className="text-white font-medium">Peshawar, Pakistan (GMT+5)</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-blue">
                  <FaEnvelope size={16} />
                </div>
                <div>
                  <div className="text-text-secondary text-xs font-semibold uppercase">Email Directly</div>
                  <a href="mailto:shahidullahafridi31@gmail.com" className="text-white font-medium hover:underline">
                    shahidullahafridi31@gmail.com
                  </a>
                </div>
              </div>

              {/* Availability status */}
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
                  </span>
                </div>
                <div>
                  <div className="text-text-secondary text-xs font-semibold uppercase">Current Availability</div>
                  <div className="text-emerald-400 font-bold uppercase tracking-wider text-xs">
                    Open to Freelance & Startups Contracts
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action buttons links */}
            <div className="flex space-x-4 pt-4">
              <a
                href="https://wa.me/923178533838"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:border-emerald-500 hover:text-emerald-400 px-5 py-3 font-sans text-xs font-bold text-white transition-all hover:shadow-glow-blue"
              >
                <FaWhatsapp />
                <span>WhatsApp Chat</span>
              </a>
              <a
                href="https://www.linkedin.com/in/shahid-ullahafridi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:border-accent-blue hover:text-accent-blue px-5 py-3 font-sans text-xs font-bold text-white transition-all hover:shadow-glow-blue"
              >
                <FaLinkedin />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Form Side panel */}
          <div className="lg:col-span-3 glassmorphism rounded-3xl p-8 border border-white/10 shadow-glass-md">
            <form onSubmit={handleSubmit} className="space-y-6 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-text-secondary outline-none focus:border-accent-blue focus:shadow-glow-blue transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-text-secondary outline-none focus:border-accent-blue focus:shadow-glow-blue transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-text-secondary outline-none focus:border-accent-blue focus:shadow-glow-blue transition-all"
                  placeholder="Project inquiry / Freelance request"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Message Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-text-secondary outline-none focus:border-accent-blue focus:shadow-glow-blue transition-all resize-none"
                  placeholder="Tell me about your product requirements, deadline, and stack specs..."
                  required
                />
              </div>

              {/* Submission status alerts */}
              {status === 'error' && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-medium text-red-400">
                  {statusMessage}
                </div>
              )}

              {status === 'success' && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-400">
                  {statusMessage}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-glow-blue px-6 py-4 font-bold tracking-wider uppercase text-white transition-all transform hover:scale-[1.02] disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
