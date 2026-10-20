import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, Clock } from 'lucide-react';

export default async function AkademikPage() {
  const { data: settings } = await supabase.from('site_settings').select('*').single();
  const { data: menus } = await supabase.from('menus').select('*').order('order_index');

  const ekstrakulikuler = [
    { name: 'Pramuka Penggalang', desc: 'Membentuk kedisiplinan, kemandirian, dan kepemimpinan siswa.', icon: '🏕️' },
    { name: 'PMR / UKS', desc: 'Pelatihan pertolongan pertama dan kepedulian sosial kemanusiaan.', icon: '🩺' },
    { name: 'Tahfidz Al-Qur\'an', desc: 'Program bimbingan keagamaan dan penambahan hafalan juz Al-Qur\'an.', icon: '📖' },
    { name: 'KSM (Klub Sains)', desc: 'Persiapan kompetisi Matematika, IPA, dan IPS tingkat kabupaten hingga nasional.', icon: '🧪' },
    { name: 'Seni Hadroh & Tilawah', desc: 'Pengembangan seni budaya Islam dan keindahan membaca Al-Qur\'an.', icon: '🥁' },
    { name: 'Olahraga & Beladiri', desc: 'Latihan Futsal, Voli, Bulutangkis, dan Pencak Silat.', icon: '⚽' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar menus={menus || []} settings={settings} />

      {/* Banner Header */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 opacity-90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-4">
          <div className="inline-block mb-4">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30">
              Sistem Pembelajaran
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Akademik & Kesiswaan</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Kurikulum terpadu yang memadukan keunggulan sains, teknologi, dan nilai-nilai Islam.
          </p>
        </div>
      </section>

      {/* Kurikulum Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
              Kurikulum Terpadu
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              Penerapan Kurikulum Merdeka & Ciri Khas Keagamaan
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              MTsN 3 Natuna menerapkan Kurikulum Merdeka yang diperkaya dengan mata pelajaran keagamaan seperti Akidah Akhlak, Al-Qur'an Hadis, Fikih, Sejarah Kebudayaan Islam (SKI), dan Bahasa Arab.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">Pembelajaran Berbasis Proyek (P5 & PPRA)</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">Penguatan Literasi Sains dan Keagamaan</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-amber-300 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Pembiasaan Harian Siswa
              </h3>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-200 border-l-2 border-emerald-700 pl-4">
                <li>
                  <p className="font-bold text-white">07.00 - 07.30 WIB</p>
                  <p className="text-slate-300">Sholat Dhuha Berjamaah & Tadarus Al-Qur'an</p>
                </li>
                <li>
                  <p className="font-bold text-white">07.30 - 14.00 WIB</p>
                  <p className="text-slate-300">Kegiatan Belajar Mengajar (KBM) Efektif</p>
                </li>
                <li>
                  <p className="font-bold text-white">12.15 - 13.00 WIB</p>
                  <p className="text-slate-300">Sholat Dzuhur Berjamaah & Kultum Siswa</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ekstrakulikuler */}
      <section className="py-16 bg-slate-100/80 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Pengembangan Diri</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">Program Ekstrakurikuler</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ekstrakulikuler.map((ekskul, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-2">
                <div className="text-3xl mb-2">{ekskul.icon}</div>
                <h4 className="font-bold text-slate-800 text-base">{ekskul.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{ekskul.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}