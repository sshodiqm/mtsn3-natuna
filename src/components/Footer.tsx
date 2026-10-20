import Link from 'next/link';
import { Phone, Mail, MapPin, GraduationCap, ArrowUpRight } from 'lucide-react';

interface SiteSettings {
  school_name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t-4 border-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
        {/* Brand & Bio */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <span className="font-bold text-lg text-white">{settings?.school_name || 'MTsN 3 Natuna'}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Lembaga pendidikan formal tingkat menengah pertama berciri khas Agama Islam di bawah naungan Kementerian Agama Republik Indonesia.
          </p>
        </div>

        {/* Tautan Cepat */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 border-l-2 border-emerald-500 pl-3">Tautan Pintas</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/profil" className="hover:text-amber-400 transition flex items-center gap-1">Profil Madrasah <ArrowUpRight className="w-3 h-3 text-slate-500" /></Link></li>
            <li><Link href="/berita" className="hover:text-amber-400 transition flex items-center gap-1">Kabar & Berita <ArrowUpRight className="w-3 h-3 text-slate-500" /></Link></li>
            <li><Link href="/ppdb" className="hover:text-amber-400 transition flex items-center gap-1">Pendaftaran PPDB <ArrowUpRight className="w-3 h-3 text-slate-500" /></Link></li>
            <li><Link href="/kontak" className="hover:text-amber-400 transition flex items-center gap-1">Hubungi Kami <ArrowUpRight className="w-3 h-3 text-slate-500" /></Link></li>
          </ul>
        </div>

        {/* Akses Aplikasi */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 border-l-2 border-emerald-500 pl-3">Layanan Terpadu</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>Rapor Digital Madrasah (RDM)</li>
            <li>Sistem Informasi Kemenag</li>
            <li>E-Learning Madrasah</li>
            <li>Perpustakaan Digital</li>
          </ul>
        </div>

        {/* Kontak & Alamat */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm mb-4 border-l-2 border-emerald-500 pl-3">Alamat & Kontak</h4>
          <p className="text-xs flex items-start gap-2 text-slate-400 leading-relaxed">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            {settings?.address || 'Kabupaten Natuna, Kepulauan Riau'}
          </p>
          <p className="text-xs flex items-center gap-2 text-slate-400">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            {settings?.phone || '(0773) 123456'}
          </p>
          <p className="text-xs flex items-center gap-2 text-slate-400">
            <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
            {settings?.email || 'info@mtsn3natuna.sch.id'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} {settings?.school_name || 'MTsN 3 Natuna'}. Hak Cipta Dilindungi.</p>
        <p>Dikembangkan secara profesional untuk kemajuan pendidikan Islam.</p>
      </div>
    </footer>
  );
}