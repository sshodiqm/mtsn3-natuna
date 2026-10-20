import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, BookOpen, Award, Users, GraduationCap, Newspaper, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

export default async function HomePage() {
  const { data: settings } = await supabase.from('site_settings').select('*').single();
  const { data: menus } = await supabase.from('menus').select('*').order('order_index');
  const { data: featuredPosts } = await supabase.from('posts').select('*, categories(name)').order('created_at', { ascending: false }).limit(3);
  const { data: teachers } = await supabase.from('teachers').select('*').limit(4);
  const { data: galleries } = await supabase.from('galleries').select('*').limit(6);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar menus={menus || []} settings={settings} />

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-25 bg-cover bg-center" style={{ backgroundImage: `url(${settings?.hero_image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200'})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-emerald-950/80 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Selamat Datang di Website Resmi
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              {settings?.hero_title || 'Mewujudkan Generasi Islami, Cerdas, dan Berakhlaqul Karimah'}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              {settings?.hero_subtitle || 'Selamat Datang di Portal Resmi Madrasah Tsanawiyah Negeri 3 Natuna.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <Link
                href="/ppdb"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                Pendaftaran PPDB <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/profil"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition backdrop-blur-sm"
              >
                Jelajahi Profil
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
              <img
                src={settings?.hero_image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800'}
                alt="Gedung Madrasah"
                className="w-full h-80 object-cover rounded-xl shadow-inner"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Kartu Statistik Madrasah */}
      <section className="-mt-10 relative z-20 max-w-7xl mx-auto px-4 sm:px-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800">450+</p>
              <p className="text-xs text-slate-500 font-medium">Siswa Aktif</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center"><GraduationCap className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800">32</p>
              <p className="text-xs text-slate-500 font-medium">Guru & Staf</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center"><BookOpen className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800">12</p>
              <p className="text-xs text-slate-500 font-medium">Rombongan Belajar</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center"><Award className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800">A</p>
              <p className="text-xs text-slate-500 font-medium">Akreditasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sambutan Kepala Madrasah */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative">
              <div className="w-56 h-72 bg-slate-200 rounded-2xl overflow-hidden shadow-lg border-4 border-emerald-600">
                {settings?.principal_photo_url ? (
                  <img src={settings.principal_photo_url} alt={settings.principal_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-medium text-xs">Foto Kepala</div>
                )}
              </div>
              <div className="absolute -bottom-4 inset-x-0 bg-emerald-800 text-white py-2 px-4 rounded-xl text-center shadow-md">
                <p className="font-bold text-xs truncate">{settings?.principal_name || 'Kepala Madrasah'}</p>
                <p className="text-[10px] text-amber-300">NIP: {settings?.principal_nip || '-'}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Sambutan Kepala Madrasah
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              Membangun Karakter Rabbani & Berprestasi
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed italic border-l-4 border-amber-400 pl-4 bg-slate-50/50 py-3 rounded-r-lg">
              "{settings?.principal_speech || 'Assalamu’alaikum Warahmatullahi Wabarakatuh. Selamat datang di website resmi MTsN 3 Natuna...'}"
            </p>
          </div>
        </div>
      </section>

      {/* Berita & Pengumuman Terbaru */}
      <section className="py-16 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Kabar Terbaru</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">Berita & Informasi Madrasah</h2>
            </div>
            <Link href="/berita" className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
              Lihat Semua Berita <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts && featuredPosts.length > 0 ? (
              featuredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    {post.cover_image && (
                      <img src={post.cover_image} alt={post.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-6 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.created_at).toLocaleDateString('id-ID')}
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg leading-snug line-clamp-2">{post.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-3">{post.excerpt}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link href={`/berita/${post.slug}`} className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1">
                      Baca Selengkapnya <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 col-span-3 text-center py-8">Belum ada berita yang dipublikasikan.</p>
            )}
          </div>
        </div>
      </section>

      {/* Tenaga Kependidikan / Guru */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Tenaga Pendidik</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">Guru & Staf Pengajar</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {teachers && teachers.length > 0 ? (
            teachers.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-4 text-center border border-slate-200 shadow-sm hover:shadow-md transition">
                <img
                  src={t.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400'}
                  alt={t.name}
                  className="w-24 h-28 object-cover rounded-xl mx-auto mb-3 border-2 border-emerald-500"
                />
                <h4 className="font-bold text-slate-800 text-sm truncate">{t.name}</h4>
                <p className="text-xs text-emerald-700 font-medium">{t.subject}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 col-span-4 text-center py-4">Data guru belum diisi.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer settings={settings} />
    </div>
  );
}