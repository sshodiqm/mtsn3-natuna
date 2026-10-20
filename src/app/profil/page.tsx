import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Eye, Target, History } from 'lucide-react';

export default async function ProfilPage() {
  const { data: settings } = await supabase.from('site_settings').select('*').single();
  const { data: menus } = await supabase.from('menus').select('*').order('order_index');
  const { data: teachers } = await supabase.from('teachers').select('*').order('created_at');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar menus={menus || []} settings={settings} />

      {/* Banner Header */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 opacity-90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-4">
          <div className="inline-block mb-4">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30">
              Mengenal Lebih Dekat
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Profil MTsN 3 Natuna</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Lembaga pendidikan Islam berkualitas yang membentuk karakter unggul, cerdas, dan berakhlaqul karimah di Kabupaten Natuna.
          </p>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Visi & Misi Madrasah</h2>
          <p className="text-slate-500 text-sm mt-2">Komitmen kami dalam memajukan pendidikan Islam bermutu tinggi.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visi */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Visi Utama</h3>
            <p className="text-slate-600 text-sm leading-relaxed italic border-l-4 border-emerald-500 pl-4 py-1">
              "Terwujudnya Lulusan Madrasah yang Islami, Cerdas, Berilmu, Berakhlaqul Karimah, dan Berwawasan Lingkungan."
            </p>
          </div>

          {/* Misi */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Misi Madrasah</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                <span>Menyelenggarakan pendidikan berbasis ajaran Islam dan nilai-nilai Al-Qur'an.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                <span>Meningkatkan prestasi akademik dan non-akademik secara berkelanjutan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                <span>Membina pembiasaan akhlak mulia dan kedisiplinan seluruh warga madrasah.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                <span>Mewujudkan lingkungan belajar yang bersih, asri, dan ramah anak.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sejarah Singkat */}
      <section className="py-16 bg-slate-100/80 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl space-y-4">
              <div className="w-10 h-10 bg-amber-400 text-slate-900 rounded-xl flex items-center justify-center font-bold">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Sejarah Singkat</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                MTsN 3 Natuna berdiri sebagai bagian dari komitmen Kementerian Agama dalam menyediakan pendidikan menengah pertama berbasis keagamaan di kawasan perbatasan Natuna. Sejak berdirinya, madrasah ini terus berkembang menghasilkan alumni yang berkontribusi positif bagi masyarakat.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-2xl font-extrabold text-slate-800">Identitas & Status Akreditasi</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Dengan dukungan tenaga pengajar profesional dan sarana pendukung yang memadai, MTsN 3 Natuna siap mendidik generasi penerus bangsa yang unggul secara intelektual dan spiritual.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-400 font-medium">Status Akreditasi</p>
                <p className="text-xl font-black text-emerald-700 mt-0.5">Terakreditasi A</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-400 font-medium">Naungan Resmi</p>
                <p className="text-sm font-bold text-slate-800 mt-1">Kementerian Agama RI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direktori Lengkap Guru & Staf */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Sumber Daya Manusia</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">Direktori Guru & Tenaga Kependidikan</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teachers && teachers.length > 0 ? (
            teachers.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-5 text-center border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <img
                  src={t.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400'}
                  alt={t.name}
                  className="w-24 h-28 object-cover rounded-xl mx-auto mb-3 border-2 border-emerald-500"
                />
                <h4 className="font-bold text-slate-800 text-sm truncate">{t.name}</h4>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5">{t.subject}</p>
                <p className="text-[11px] text-slate-400 mt-1">NIP: {t.nip || '-'}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 col-span-4 text-center py-8">Belum ada data guru yang dimasukkan di panel admin.</p>
          )}
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}