'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { User, Shield, Briefcase, Calculator, Scale, Building2 } from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister?: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginPage({ onSwitchToRegister, onLoginSuccess }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role: string, demoEmail: string) => {
    setError('');
    setIsLoading(true);
    // Overwrite the local storage mock role for the quick login
    if (typeof window !== 'undefined') {
      localStorage.setItem('sb_mock_email', demoEmail);
      localStorage.setItem('sb_mock_role', role);
      localStorage.setItem('sb_mock_fname', 'Demo');
      localStorage.setItem('sb_mock_lname', role);
    }
    
    try {
      await login(demoEmail, 'password123');
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const demoProfiles = [
    { id: 'admin', label: 'Admin', icon: Shield, email: 'admin@sitebank.com', role: 'admin' },
    { id: 'nri', label: 'NRI', icon: User, email: 'nri@sitebank.com', role: 'nri' },
    { id: 'rm', label: 'RM', icon: Briefcase, email: 'rm@sitebank.com', role: 'rm' },
    { id: 'agent', label: 'Agent', icon: Building2, email: 'agent@sitebank.com', role: 'agent' },
    { id: 'lawyer', label: 'Lawyer', icon: Scale, email: 'lawyer@sitebank.com', role: 'lawyer' },
    { id: 'ca', label: 'CA', icon: Calculator, email: 'ca@sitebank.com', role: 'ca' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6EF] p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#2C3E38]/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C7A36A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#2C3E38]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Demo Profile Switcher - Top Left */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-[#E8DFD6]">
          <h3 className="text-xs font-bold text-[#4A5568] mb-2 uppercase tracking-wider px-1">Quick Login Profiles</h3>
          <div className="flex flex-col gap-1.5">
            {demoProfiles.map((profile) => {
              const Icon = profile.icon;
              return (
                <button
                  key={profile.id}
                  onClick={() => handleQuickLogin(profile.role, profile.email)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#FAF6EF] text-[#2C3E38] transition-colors text-sm font-medium disabled:opacity-50 text-left"
                >
                  <div className="p-1.5 bg-white rounded-lg border border-[#E8DFD6] shadow-sm">
                    <Icon size={14} className="text-[#C7A36A]" />
                  </div>
                  {profile.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 relative mt-32 md:mt-0"
      >
        <div className="card backdrop-blur-xl bg-white/80 p-8 md:p-10 border border-[#E8DFD6]/60 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-[#2C3E38] mb-2">Welcome Back</h1>
            <p className="text-[#4A5568]">Sign in to your account</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2C3E38] mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD6] focus:border-[#C7A36A] focus:ring-1 focus:ring-[#C7A36A] outline-none transition-all bg-white/50"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E38] mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD6] focus:border-[#C7A36A] focus:ring-1 focus:ring-[#C7A36A] outline-none transition-all bg-white/50"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#2C3E38] hover:bg-[#1A2622] text-white rounded-xl font-medium transition-colors shadow-lg shadow-[#2C3E38]/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#4A5568]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-[#C7A36A] hover:text-[#B8956A] font-medium transition-colors"
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
