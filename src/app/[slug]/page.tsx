import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const revalidate = 0;

interface DynamicPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicPublicPage({ params }: DynamicPageProps) {
  const { slug } = await params;

  // 1. Ambil data detail halaman, pengaturan website, dan daftar menu navigasi secara bersamaan
  const [{ data: menu }, { data: settings }, { data: menus }] = await Promise.all([
    supabase.from('menus').select('*').eq('slug', slug).single(),
    supabase.from('site_settings').select('*').single(),
    supabase.from('menus').select('*').order('order_index'),
  ]);

  // 2. Jika halaman tidak ditemukan di database, tampilkan 404
  if (!menu) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Mengirimkan props menus dan settings ke Navbar */}
      <Navbar menus={menus || []} settings={settings} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-4">
            {menu.title}
          </h1>

          {menu.content ? (
            <article
              className="text-slate-800 leading-relaxed break-words overflow-hidden [&>p]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>a]:text-emerald-600 [&>a]:underline"
              dangerouslySetInnerHTML={{ __html: menu.content }}
            />
          ) : (
            <div className="text-center py-12 text-slate-400 italic">
              Konten untuk halaman ini belum diisi oleh admin.
            </div>
          )}
        </div>
      </main>

      {/* Mengirimkan props settings ke Footer */}
      <Footer settings={settings} />
    </div>
  );
}