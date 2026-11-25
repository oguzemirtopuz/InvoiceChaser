'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import {
  LayoutDashboard,
  Receipt,
  Sliders,
  Sparkles,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    {
      href: '/dashboard',
      label: t.dashboard.sidebar.overview,
      icon: <LayoutDashboard className="w-5 h-5" />,
      exact: true,
    },
    {
      href: '/dashboard/invoices',
      label: t.dashboard.sidebar.invoices,
      icon: <Receipt className="w-5 h-5" />,
      exact: false,
    },
    {
      href: '/dashboard/rules',
      label: t.dashboard.sidebar.rules,
      icon: <Sliders className="w-5 h-5" />,
      exact: false,
    },
    {
      href: '/dashboard/simulator',
      label: t.dashboard.sidebar.simulator,
      icon: <Sparkles className="w-5 h-5" />,
      exact: false,
    },
    {
      href: '/dashboard/settings',
      label: t.dashboard.sidebar.settings,
      icon: <Settings className="w-5 h-5" />,
      exact: false,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900/60 border-r border-slate-800 flex flex-col justify-between p-4 min-h-screen">
      <div className="space-y-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white tracking-tight leading-none">
              Invoice<span className="text-indigo-400">Chaser</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Auto B2B Collection</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-slate-800">
        <Link
          href="/login"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>{t.dashboard.sidebar.logout}</span>
        </Link>
      </div>
    </aside>
  );
}
