import { useState, useEffect } from 'react';
import { FaCertificate, FaCodeBranch } from 'react-icons/fa';
import axios from 'axios';

const fallbackCerts = [
  {
    title: 'MERN Stack Web Development',
    organization: 'SMIT Peshawar',
    issueDate: '2026',
    image: ''
  },
  {
    title: 'English Diploma',
    organization: 'Excel Learn Academy Peshawar',
    issueDate: '2024',
    image: ''
  }
];

export default function Achievements() {
  const [certs, setCerts] = useState<any[]>(fallbackCerts);

  useEffect(() => {
    const loadCerts = async () => {
      try {
        const response = await axios.get('/api/certificates');
        if (response.data && response.data.length > 0) {
          setCerts(response.data);
        }
      } catch (err) {
        console.log('Using local fallback certificates.');
      }
    };
    loadCerts();
  }, []);

  return (
    <section id="achievements" className="relative z-10 py-24 px-6 bg-[#050816]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-sans text-xs font-bold tracking-widest text-accent-cyan uppercase mb-3">
            Credentials
          </h2>
          <h3 className="font-sans text-3xl font-extrabold tracking-tight sm:text-5xl">
            Achievements & Code Activity
          </h3>
          <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Certifications and Course list */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-sans text-2xl font-bold text-white flex items-center gap-3">
              <FaCertificate className="text-accent-cyan" />
              <span>Certificates & Courses</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {certs.map((cert, idx) => (
                <div
                  key={idx}
                  className="glassmorphism rounded-2xl p-6 border border-white/5 hover:border-accent-cyan/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <span className="font-sans text-[10px] font-bold text-accent-cyan uppercase bg-accent-cyan/10 rounded-full px-2.5 py-1 border border-accent-cyan/25">
                      {cert.issueDate}
                    </span>
                    <h5 className="font-sans text-base font-bold text-white mt-4 mb-1">
                      {cert.title}
                    </h5>
                    <p className="font-sans text-xs text-text-secondary uppercase tracking-wider mb-3">
                      {cert.organization}
                    </p>
                  </div>
                  {cert.image && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden mt-3 border border-white/10 bg-white/5">
                      <img src={cert.image} alt={cert.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Activity Mock Panel */}
          <div className="space-y-6">
            <h4 className="font-sans text-2xl font-bold text-white flex items-center gap-3">
              <FaCodeBranch className="text-accent-purple" />
              <span>GitHub Commit Activity</span>
            </h4>
            <div className="glassmorphism rounded-3xl p-6 border border-white/10 flex flex-col justify-between h-[230px] relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center text-xs font-sans text-text-secondary">
                  <span>Username: mrshahidafridi786</span>
                  <span className="text-accent-cyan font-bold uppercase tracking-wider animate-pulse">
                    Live Syncing
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center font-sans text-sm text-white">
                    <span>Total Commits (2026)</span>
                    <span className="font-bold">640+ commits</span>
                  </div>
                  <div className="flex justify-between items-center font-sans text-sm text-white">
                    <span>Active Repositories</span>
                    <span className="font-bold">14 active repos</span>
                  </div>
                  <div className="flex justify-between items-center font-sans text-sm text-white">
                    <span>Longest Streak</span>
                    <span className="font-bold text-accent-purple">34 days straight</span>
                  </div>
                </div>
              </div>

              {/* simulated grid grid points */}
              <div className="grid grid-cols-12 gap-1 mt-6">
                {[...Array(24)].map((_, i) => {
                  const colors = ['bg-white/5', 'bg-emerald-900', 'bg-emerald-700', 'bg-emerald-500', 'bg-emerald-400'];
                  const randColor = colors[Math.floor(Math.random() * colors.length)];
                  return (
                    <div
                      key={i}
                      className={`h-3 w-3 rounded-[2px] ${randColor} transition-all hover:scale-110 hover:border hover:border-white/50`}
                      title={`${Math.floor(Math.random() * 8)} commits`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
