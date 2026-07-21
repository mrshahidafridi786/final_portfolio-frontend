import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      const response = await axios.post('/api/auth/login', data);
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
              Email Address
            </label>
            <input
              type="email"
              {...register('username')}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan transition-colors"
              placeholder="Enter email address"
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan transition-colors"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold tracking-wider uppercase text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
          >
            {isLoading ? 'Verifying Session...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
