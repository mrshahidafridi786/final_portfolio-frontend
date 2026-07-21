import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Mail, FolderGit2, Code2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    projectsCount: 0,
    skillsCount: 0,
    messagesTotal: 0,
    messagesUnread: 0,
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projRes, skillRes, msgRes] = await Promise.all([
          api.get('/projects'),
          api.get('/skills'),
          api.get('/messages')
        ]);

        const totalMessages = msgRes.data.length;
        const unreadMessages = msgRes.data.filter((m: any) => !m.isRead).length;

        setStats({
          projectsCount: projRes.data.length,
          skillsCount: skillRes.data.length,
          messagesTotal: totalMessages,
          messagesUnread: unreadMessages,
          loading: false
        });
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-cyan"></div>
      </div>
    );
  }

  const statCards = [
    { name: 'Projects Uploaded', value: stats.projectsCount, icon: FolderGit2, href: '/admin/projects', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
    { name: 'Total Skills', value: stats.skillsCount, icon: Code2, href: '/admin/skills', color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
    { name: 'Total Contact Messages', value: stats.messagesTotal, icon: Mail, href: '/admin/messages', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
    { name: 'Unread Messages', value: stats.messagesUnread, icon: Clock, href: '/admin/messages', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold">Welcome back, Administrator</h3>
        <p className="text-sm text-white/60 mt-1">Here is a quick overview of your portfolio website statistics.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.name}
            to={card.href}
            className="rounded-2xl border border-white/5 bg-[#050816] p-6 hover:border-white/10 transition-all flex items-center justify-between group"
          >
            <div className="space-y-2">
              <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">{card.name}</span>
              <div className="text-3xl font-extrabold text-white group-hover:text-accent-cyan transition-colors">{card.value}</div>
            </div>
            <div className={`p-4 rounded-xl ${card.bg} ${card.color}`}>
              <card.icon size={24} />
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-white/5 bg-[#050816] p-6 space-y-4">
        <h4 className="font-bold text-lg">Quick Setup Guide</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-white/60 leading-relaxed">
          <div className="space-y-2 p-4 rounded-xl border border-white/5 bg-white/5">
            <span className="font-bold text-white block">1. Populate Database</span>
            <p>Ensure your MongoDB database is started. If your database seeder fails, make sure your connection URI is valid.</p>
          </div>
          <div className="space-y-2 p-4 rounded-xl border border-white/5 bg-white/5">
            <span className="font-bold text-white block">2. Image Uploads</span>
            <p>Add Cloudinary credentials inside <code>backend/.env</code> to automatically route file uploads. Otherwise, the app falls back to local disk storage.</p>
          </div>
          <div className="space-y-2 p-4 rounded-xl border border-white/5 bg-white/5">
            <span className="font-bold text-white block">3. CV/Resume Document</span>
            <p>Upload your latest CV in the Resume section of the Admin Panel to update the download link on the main page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
