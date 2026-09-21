'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { email, password } = formData;
  const router = useRouter();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setErrorMsg('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await login(email, password);
      router.push('/');
    } catch (error) {
      setErrorMsg(error.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 pt-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="fox-panel w-full max-w-md p-8 relative overflow-hidden"
      >
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-foxAccent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-foxAccent/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Sign in to uncover amazing movies</p>
        </div>

        <form onSubmit={onSubmit} className="relative z-10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              className="fox-input"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              className="fox-input"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-4 flex justify-center items-center py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {errorMsg && (
          <p className="text-red-500 text-sm mt-4 text-center">{errorMsg}</p>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-foxAccent hover:text-foxAccentHover font-medium">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
