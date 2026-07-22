import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const loginSchema = z.object({
  username: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await api.post('/auth/login', data);
      if (response.data && response.data.success) {
        login(response.data.token, response.data.admin);
        navigate('/admin');
      }
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.message || 'Login failed. Please check credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 font-sans">
      <div className="absolute h-96 w-96 rounded-full bg-accent-blue/10 blur-3xl top-1/4 left-1/4" />
      <div className="absolute h-96 w-96 rounded-full bg-accent-purple/10 blur-3xl bottom-1/4 right-1/4" />

      <div className="w-full max-w-md rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Admin Portal
          </h2>
          <p className="text-xs text-text-secondary uppercase tracking-widest">
            Shahid Afridi Portfolio
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              {...register('username')}
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-accent-cyan focus:outline-none transition"
            />
            {errors.username && (
              <p className="mt-1.5 text-xs text-red-400">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-accent-cyan focus:outline-none transition"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 rounded-xl bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-purple px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Authenticating...' : 'Sign In To Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
