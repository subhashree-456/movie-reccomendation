'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, email, password } = formData;
  const router = useRouter();
  const { user, register } = useAuth();

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
      await register(name, email, password);
      router.push('/');
    } catch (error) {
      setErrorMsg(error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-20 px-4 min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fox-panel w-full max-w-md p-8 relative overflow-hidden"
      >
        <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-foxAccent/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-2">Join FilmFox to discover movies personalized for you</p>
        </div>

        <form onSubmit={onSubmit} className="relative z-10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
            <input
              type="text"
              className="fox-input"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              className="fox-input"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Your email address"
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
              placeholder="Create a strong password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 flex justify-center items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Register'
            )}
          </button>
        </form>

        {errorMsg && (
          <p className="text-red-500 text-sm mt-4 text-center">{errorMsg}</p>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-foxAccent hover:text-foxAccentHover font-medium">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
