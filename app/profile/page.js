'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      const fetchProfile = async () => {
        try {
          const res = await fetch('/api/auth/profile', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setProfileData(data);
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="p-24 text-center text-slate-400 animate-pulse">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fox-panel max-w-3xl mx-auto p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-foxAccent/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-10 border-b border-foxBorder pb-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-4xl text-white font-bold">
                {profileData?.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {profileData?.name || user?.name}
              </h1>
              <p className="text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 border border-green-400/50"></span>
                {profileData?.email || user?.email}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
              <span className="w-1.5 h-6 rounded-full bg-foxAccent block"></span>
              Account Activity
            </h2>
            <div className="bg-[#111827] rounded-xl p-6 border border-foxBorder">
              <p className="text-slate-400 text-center">
                {profileData?.favorites?.length > 0
                  ? `${profileData.favorites.length} favorite movies saved`
                  : 'No recent activity to show.'}
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-foxBorder">
            <h3 className="text-xl font-bold mb-4 text-white">Account Settings</h3>
            <p className="text-slate-400">
              Personal preferences, watchlists, and algorithmic recommendation filters are stored securely.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
