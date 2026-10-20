import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Newspaper, ArrowRight, Tag } from 'lucide-react';

// Tambahkan baris ini agar Vercel merender data Supabase secara dinamis
export const dynamic = 'force-dynamic';

export default async function BeritaPage() {
  const { data: settings } = await supabase.from('site_settings').select('*').single();
  const { data: menus } = await supabase.from('menus').select('*').order('order_index');
  
  // Mengambil berita dari database
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
  }

  const featuredPost = posts?.find((p) => p.is_featured) || posts?.[0];
  const regularPosts = posts?.filter((p) => p.id !== featuredPost?.id) || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar menus={menus || []} settings={settings} />

      {/* Banner Header */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 opacity-90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-4">
          <div className="inline-block mb-4">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30">
              Kabar & Informasi
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Berita & Pengumuman</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Informasi terbaru seputar kegiatan, prestasi, dan pengumuman resmi MTsN 3 Natuna.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-16 w-full space-y-16">
        {!posts || posts.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border text-center space-y-3">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-semibold">Belum ada berita yang ditampilkan.</p>
            <p className="text-xs text-slate-400">Pastikan Anda telah menjalankan skrip SQL RLS di Supabase dan menambahkan berita di admin.</p>
          </div>
        ) : (
          <>
            {/* Highlight Berita Utama */}
            {featuredPost && (
              <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 bg-slate-200 min-h-[280px] lg:min-h-[380px] relative">
                  {featuredPost.cover_image ? (
                    <img
                      src={featuredPost.cover_image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Newspaper className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs font-semibold text-emerald-700">
                      <span className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {featuredPost.categories?.name || 'Berita Utama'}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(featuredPost.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 leading-snug hover:text-emerald-700 transition">
                      <Link href={`/berita/${featuredPost.slug}`}>{featuredPost.title}</Link>
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">{featuredPost.excerpt}</p>
                  </div>
                  <div>
                    <Link
                      href={`/berita/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                    >
                      Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* Daftar Berita Lainnya */}
            {regularPosts.length > 0 && (
              <section className="space-y-8">
                <h3 className="text-2xl font-extrabold text-slate-800 border-b pb-4">Artikel & Informasi Lainnya</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                    >
                      <div>
                        <div className="h-48 bg-slate-100 relative overflow-hidden">
                          {post.cover_image ? (
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Newspaper className="w-12 h-12" />
                            </div>
                          )}
                        </div>
                        <div className="p-6 space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-semibold text-emerald-700">{post.categories?.name || 'Umum'}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.created_at).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition">
                            <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{post.excerpt}</p>
                        </div>
                      </div>
                      <div className="p-6 pt-0">
                        <Link
                          href={`/berita/${post.slug}`}
                          className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                        >
                          Baca Artikel <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  );
}