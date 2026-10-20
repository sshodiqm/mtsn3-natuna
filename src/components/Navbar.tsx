'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Menu, X, ChevronDown, GraduationCap } from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  url: string;
  parent_id: string | null;
  order_index: number;
}

interface SiteSettings {
  school_name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export default function Navbar({ menus, settings }: { menus: MenuItem[]; settings: SiteSettings | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const mainMenus = menus.filter((m) => !m.parent_id || m.parent_id === '');
  const getSubmenus = (parentId: string) => menus.filter((m) => m.parent_id === parentId);

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* TopBar Informasi Sekolah */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 sm:px-8 border-b border-emerald-800/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> {settings?.phone || '(0773) 123456'}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" /> {settings?.email || 'info@mtsn3natuna.sch.id'}
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> {settings?.address || 'Kabupaten Natuna'}
            </span>
          </div>
          <div className="flex items-center gap-3 font-medium text-[11px] text-amber-300">
            <span>Portal Resmi Madrasah Tsanawiyah Negeri 3 Natuna</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-emerald-700 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-700/20 group-hover:scale-105 transition">
              <GraduationCap className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <span className="block font-black text-slate-800 text-lg leading-tight tracking-tight">
                {settings?.school_name || 'MTsN 3 NATUNA'}
              </span>
              <span className="block text-xs font-semibold text-emerald-700 tracking-wider uppercase">
                Ikhlas Beramal • Unggul • Islami
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {mainMenus.map((menu) => {
              const submenus = getSubmenus(menu.id);
              const hasSub = submenus.length > 0;

              return (
                <div key={menu.id} className="relative group">
                  <Link
                    href={menu.url}
                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 rounded-lg hover:bg-emerald-50/60 transition flex items-center gap-1"
                  >
                    {menu.title}
                    {hasSub && <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition" />}
                  </Link>

                  {/* Dropdown Menu */}
                  {hasSub && (
                    <div className="absolute top-full left-0 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                      {submenus.map((sub) => (
                        <Link
                          key={sub.id}
                          href={sub.url}
                          className="block px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 transition"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/ppdb"
              className="ml-4 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              INFO PPDB
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 text-slate-700 hover:bg-slate-100 rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-2 shadow-xl">
            {mainMenus.map((menu) => {
              const submenus = getSubmenus(menu.id);
              const hasSub = submenus.length > 0;

              return (
                <div key={menu.id}>
                  <div className="flex justify-between items-center">
                    <Link
                      href={menu.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm font-semibold text-slate-800"
                    >
                      {menu.title}
                    </Link>
                    {hasSub && (
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === menu.id ? null : menu.id)}
                        className="p-1"
                      >
                        <ChevronDown className={`w-4 h-4 transition ${activeDropdown === menu.id ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {hasSub && activeDropdown === menu.id && (
                    <div className="pl-4 py-1 space-y-1 bg-slate-50 rounded-lg">
                      {submenus.map((sub) => (
                        <Link
                          key={sub.id}
                          href={sub.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 text-xs text-slate-600 font-medium"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}