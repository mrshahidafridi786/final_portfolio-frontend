import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import { useAuth } from './admin/context/AuthContext';
import Login from './admin/pages/Login';
import AdminLayout from './admin/components/AdminLayout';
import DashboardHome from './admin/pages/DashboardHome';
import HeroEditor from './admin/pages/HeroEditor';
import AboutEditor from './admin/pages/AboutEditor';
import ProjectsEditor from './admin/pages/ProjectsEditor';
import SkillsEditor from './admin/pages/SkillsEditor';
import ExperienceEducationEditor from './admin/pages/ExperienceEducationEditor';
import CertificatesEditor from './admin/pages/CertificatesEditor';
import ServicesEditor from './admin/pages/ServicesEditor';
import MessagesEditor from './admin/pages/MessagesEditor';
import ResumeEditor from './admin/pages/ResumeEditor';
import SettingsEditor from './admin/pages/SettingsEditor';

// Protected Route Validation Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-cyan"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* 1. Public portfolio landing page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* 2. Admin login gate */}
      <Route path="/admin/login" element={<Login />} />

      {/* 3. Secure Admin Panel CRUD workspace */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="hero" element={<HeroEditor />} />
        <Route path="about" element={<AboutEditor />} />
        <Route path="projects" element={<ProjectsEditor />} />
        <Route path="skills" element={<SkillsEditor />} />
        <Route path="timeline" element={<ExperienceEducationEditor />} />
        <Route path="certificates" element={<CertificatesEditor />} />
        <Route path="services" element={<ServicesEditor />} />
        <Route path="messages" element={<MessagesEditor />} />
        <Route path="resume" element={<ResumeEditor />} />
        <Route path="settings" element={<SettingsEditor />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
