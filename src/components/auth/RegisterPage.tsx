'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface RegisterPageProps {
  onSwitchToLogin?: () => void;
}

export default function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'NRI',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6EF] p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#2C3E38]/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C7A36A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#2C3E38]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg my-8"
      >
        <div className="card backdrop-blur-xl bg-white/80 p-8 md:p-10 relative z-10 border border-[#E8DFD6]/60">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-[#2C3E38] mb-2">Create Account</h1>
            <p className="text-[#4A5568]">Join us to manage your properties seamlessly</p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2C3E38] mb-1.5" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD6] focus:border-[#C7A36A] focus:ring-1 focus:ring-[#C7A36A] outline-none transition-all bg-white/50"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C3E38] mb-1.5" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD6] focus:border-[#C7A36A] focus:ring-1 focus:ring-[#C7A36A] outline-none transition-all bg-white/50"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E38] mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD6] focus:border-[#C7A36A] focus:ring-1 focus:ring-[#C7A36A] outline-none transition-all bg-white/50"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E38] mb-1.5" htmlFor="phone">
                Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD6] focus:border-[#C7A36A] focus:ring-1 focus:ring-[#C7A36A] outline-none transition-all bg-white/50"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-[#2C3E38] mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD6] focus:border-[#C7A36A] focus:ring-1 focus:ring-[#C7A36A] outline-none transition-all bg-white/50"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#2C3E38] hover:bg-[#1A2622] text-white rounded-xl font-medium transition-colors shadow-lg shadow-[#2C3E38]/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#4A5568]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#C7A36A] hover:text-[#B8956A] font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
