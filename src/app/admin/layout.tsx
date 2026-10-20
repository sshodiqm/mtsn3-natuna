'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  LogOut,
  LayoutDashboard,
  Menu as MenuIcon,
  Building,
  Newspaper,
  Users,
  Image as ImageIcon,
  X,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Kelola Navbar', href: '/admin/menu', icon: MenuIcon },
    { label: 'Kelola Beranda', href: '/admin/settings', icon: Building },
    { label: 'Kelola Berita', href: '/admin/posts', icon: Newspaper },
    { label: 'Data Guru', href: '/admin/teachers', icon: Users },
    { label: 'Galeri Foto', href: '/admin/gallery', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans">
      {/* TopBar Khusus Layar HP / Mobile */}
      <header className="lg:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-40 border-b border-slate-800">
        <h2 className="text-lg font-bold text-emerald-400">Admin CMS</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </header>

      {/* Latar Belakang Redup Saat Drawer Mobile Terbuka */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Responsif (Drawer pada Mobile, Fixed pada Desktop) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen w-64 bg-slate-900 text-white p-6 flex flex-col justify-between shrink-0 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-emerald-400">Admin CMS</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950/50 rounded-xl transition font-medium text-sm w-full mt-6"
        >
          <LogOut className="w-5 h-5" /> Keluar
        </button>
      </aside>

      {/* Area Utama Konten Admin */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">{children}</main>
    </div>
  );
}