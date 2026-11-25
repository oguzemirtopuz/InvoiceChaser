'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Zap, Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success(language === 'tr' ? 'Giriş başarılı! Yönlendiriliyorsunuz...' : 'Login successful! Redirecting...');
      router.push('/dashboard');
    }, 400);
  };

  const handleDemoLogin = () => {
    toast.success(language === 'tr' ? 'Demo hesabı ile giriş yapıldı.' : 'Logged in with Demo Account.');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-6">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-base text-white tracking-tight">
            Invoice<span className="text-indigo-400">Chaser</span>
          </span>
        </Link>
        <LanguageToggle />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto my-12 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-3 text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {language === 'tr' ? 'Hesabınıza Giriş Yapın' : 'Sign In to Your Account'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'tr'
              ? 'Faturalarınızı ve AI hatırlatma akışlarınızı yönetin'
              : 'Manage your invoices and AI reminder sequences'}
          </p>
        </div>

        {/* 1-Click Demo Bypass Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full mb-6 py-3 px-4 rounded-xl font-bold text-sm text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{language === 'tr' ? '1-Tıkla Demo Modu ile Giriş Yap' : '1-Click Instant Demo Login'}</span>
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold absolute">
            {language === 'tr' ? 'veya e-posta ile' : 'or with email'}
          </span>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              {language === 'tr' ? 'E-posta Adresi' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="muhasebe@sirketiniz.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              {language === 'tr' ? 'Şifre' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? '...' : language === 'tr' ? 'Giriş Yap' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-600">
        © 2026 InvoiceChaser. Oğuz Emir Topuz
      </div>
    </div>
  );
}
