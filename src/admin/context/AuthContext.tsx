import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface AdminUser {
  id: string;
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AdminUser | null;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('shahid_admin_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data && response.data.success) {
          setIsAuthenticated(true);
          setUser(response.data.admin);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Session verification failed', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = (token: string, userDetails: AdminUser) => {
    localStorage.setItem('shahid_admin_token', token);
    setIsAuthenticated(true);
    setUser(userDetails);
  };

  const logout = () => {
    localStorage.removeItem('shahid_admin_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
