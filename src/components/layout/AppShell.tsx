'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, Users, Ruler, Package,
  Truck, Bell, UserCog, UserCheck, LogOut, Scissors,
  Menu, X, User, ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavBadges } from '@/hooks/useNavBadges';
import type { Role } from '@/lib/types';

interface NavItem { href: string; icon: React.ElementType; label: string; }

const NAV: Record<Role, NavItem[]> = {
  admin: [
    { href: '/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/orders',          icon: ShoppingBag,     label: 'Orders' },
    { href: '/customers',       icon: Users,           label: 'Customers' },
    { href: '/measurements',    icon: Ruler,           label: 'Measurements' },
    { href: '/inventory',       icon: Package,         label: 'Inventory' },
    { href: '/deliveries',      icon: Truck,           label: 'Deliveries' },
    { href: '/notifications',   icon: Bell,            label: 'Notifications' },
    { href: '/admin/users',     icon: UserCog,         label: 'Manage Users' },
    { href: '/admin/approvals', icon: UserCheck,       label: 'Approvals' },
  ],
  tailor: [
    { href: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/orders',        icon: ShoppingBag,     label: 'Orders' },
    { href: '/customers',     icon: Users,           label: 'Customers' },
    { href: '/measurements',  icon: Ruler,           label: 'Measurements' },
    { href: '/inventory',     icon: Package,         label: 'Inventory' },
    { href: '/notifications', icon: Bell,            label: 'Notifications' },
  ],
  customer: [
    { href: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/orders',        icon: ShoppingBag,     label: 'My Orders' },
    { href: '/measurements',  icon: Ruler,           label: 'Measurements' },
    { href: '/notifications', icon: Bell,            label: 'Notifications' },
  ],
  delivery: [
    { href: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/deliveries',    icon: Truck,           label: 'My Deliveries' },
    { href: '/notifications', icon: Bell,            label: 'Notifications' },
  ],
};

const ROLE_BADGE: Record<Role, string> = {
  admin:    'bg-rose-100 text-rose-700',
  tailor:   'bg-violet-100 text-violet-700',
  customer: 'bg-sky-100 text-sky-700',
  delivery: 'bg-emerald-100 text-emerald-700',
};

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { appUser, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const badges = useNavBadges();

  const role = appUser?.role ?? 'customer';
  const links = NAV[role];

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-800">
        <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Scissors className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-display font-black">TailorHub</span>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          const count = badges[href] ?? 0;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {count > 0 && (
                <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                  active ? 'bg-white/25 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-800 p-3">
        <button
          onClick={() => setUserMenuOpen(v => !v)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {appUser?.displayName?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{appUser?.displayName}</p>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${ROLE_BADGE[role]}`}>
              {role}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${userMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {userMenuOpen && (
          <div className="mt-1 rounded-xl bg-slate-800 overflow-hidden">
            <Link
              href="/profile"
              onClick={() => { setUserMenuOpen(false); onClose?.(); }}
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <User className="w-4 h-4" /> Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:bg-slate-700 hover:text-rose-300 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 w-64 h-full">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <Scissors className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-black text-slate-900">TailorHub</span>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
