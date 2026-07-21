import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, User, Briefcase, FolderGit2, Award, 
  Settings, Mail, FileText, LogOut, Globe, Menu, X, 
  PlusCircle, Code2
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Hero Section', href: '/admin/hero', icon: User },
    { name: 'About Bio', href: '/admin/about', icon: FileText },
    { name: 'Projects CRUD', href: '/admin/projects', icon: FolderGit2 },
    { name: 'Skills CRUD', href: '/admin/skills', icon: Code2 },
    { name: 'Experience & Edu', href: '/admin/timeline', icon: Briefcase },
    { name: 'Certificates', href: '/admin/certificates', icon: Award },
    { name: 'Services', href: '/admin/services', icon: PlusCircle },
    { name: 'Messages Inbox', href: '/admin/messages', icon: Mail },
    { name: 'Resume CV', href: '/admin/resume', icon: FileText },
    { name: 'Global Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#090d22] text-white font-sans flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#050816] shrink-0 p-6 justify-between">
        <div className="space-y-8">
          <div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">Shahid Afridi</h1>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Admin Dashboard</p>
          </div>
          
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-accent-blue/20 to-accent-purple/10 text-white border-l-4 border-accent-blue pl-3' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-accent-cyan' : ''} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/5 pt-4 space-y-3">
          <div className="text-xs px-4 text-white/40">Logged in as: <span className="font-semibold text-white">{user?.username}</span></div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-[#050816] p-6 justify-between z-10">
            <button className="absolute top-6 right-6 text-white" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
            <div className="space-y-8">
              <div>
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">Shahid Afridi</h1>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Admin Dashboard</p>
              </div>
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-accent-blue/20 to-accent-purple/10 text-white border-l-4 border-accent-blue pl-3' 
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon size={18} className={isActive ? 'text-accent-cyan' : ''} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="border-t border-white/5 pt-4 space-y-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#050816] px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold tracking-tight text-white hidden md:block">
              {navigation.find(n => n.href === location.pathname)?.name || 'Admin Panel'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 font-sans text-xs font-bold text-white transition-all"
            >
              <Globe size={14} className="text-accent-cyan" />
              <span>View Website</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
