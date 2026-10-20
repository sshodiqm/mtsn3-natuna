import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, ArrowLeft, Tag, Share2 } from 'lucide-react';

export default async function DetailBeritaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: settings } = await supabase.from('site_settings').select('*').single();
  const { data: menus } = await supabase.from('menus').select('*').order('order_index');

  const { data: post } = await supabase
    .from('posts')
    .select('*, categories(name)')
    .eq('slug', slug)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar menus={menus || []} settings={settings} />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 w-full space-y-8">
        {/* Tombol Kembali */}
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Berita
        </Link>

        {/* Header Artikel */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <Tag className="w-3 h-3" /> {post.categories?.name || 'Berita'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.created_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
            {post.title}
          </h1>
        </div>

        {/* Gambar Sampul */}
        {post.cover_image && (
          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md max-h-[450px]">
            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Konten Artikel */}
        <article
          className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 font-sans prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </main>

      <Footer settings={settings} />
    </div>
  );
}