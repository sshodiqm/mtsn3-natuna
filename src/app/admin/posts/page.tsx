'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import RichTextEditor from '@/components/RichTextEditor';
import { Plus, Trash2, Edit2, Save, X, Newspaper, Loader2, Image as ImageIcon, Star } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  category_id: string;
  is_featured: boolean;
  created_at: string;
  categories?: { name: string };
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const { data: catData } = await supabase.from('categories').select('*');
    if (catData) setCategories(catData);

    const { data: postData } = await supabase
      .from('posts')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (postData) setPosts(postData);
    setLoading(false);
  };

  const handleFileUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `berita-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from('school-assets').upload(fileName, file);
    if (error) {
      alert(`Gagal unggah gambar: ${error.message}`);
      return null;
    }

    const { data } = supabase.storage.from('school-assets').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const payload = {
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 150),
      category_id: categoryId || null,
      cover_image: coverImage,
      is_featured: isFeatured,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editingId) {
      const res = await supabase.from('posts').update(payload).eq('id', editingId);
      error = res.error;
    } else {
      const res = await supabase.from('posts').insert([payload]);
      error = res.error;
    }

    if (error) {
      alert(`Gagal menyimpan artikel: ${error.message}`);
    } else {
      alert('✅ Artikel berhasil disimpan!');
      resetForm();
      fetchInitialData();
    }
    setSaving(false);
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setExcerpt(post.excerpt || '');
    setCategoryId(post.category_id || '');
    setCoverImage(post.cover_image || '');
    setIsFeatured(post.is_featured || false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    setLoading(true);
    await supabase.from('posts').delete().eq('id', id);
    fetchInitialData();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setExcerpt('');
    setCategoryId('');
    setCoverImage('');
    setIsFeatured(false);
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Newspaper className="w-7 h-7 text-emerald-600" /> Kelola Berita & Pengumuman
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Publikasikan informasi kegiatan, pengumuman resmi, dan prestasi madrasah.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-5 h-5" /> Tulis Berita Baru
          </button>
        </div>

        {/* List Berita */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" /> Memuat data berita...
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Belum ada berita. Klik Tulis Berita Baru untuk membuat.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {posts.map((post) => (
                <div key={post.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition gap-4">
                  <div className="flex items-center gap-4">
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title} className="w-20 h-16 object-cover rounded-lg border" />
                    ) : (
                      <div className="w-20 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 text-base">{post.title}</h3>
                        {post.is_featured && (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Berita Utama
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Kategori: <span className="font-semibold">{post.categories?.name || 'Tanpa Kategori'}</span> • {new Date(post.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(post)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Form Berita */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl my-8">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-lg text-slate-800">{editingId ? 'Edit Berita' : 'Tulis Berita Baru'}</h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Judul Berita</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Judul artikel berita..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    Tampilkan sebagai Berita Utama (Hero/Highlight)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Gambar Sampul (Cover Image)</label>
                <div className="flex gap-4 items-center">
                  {coverImage && <img src={coverImage} alt="Cover Preview" className="w-20 h-16 object-cover rounded border" />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleFileUpload(file);
                        if (url) setCoverImage(url);
                      }
                    }}
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Ringkasan Singkat (Excerpt)</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Isi Berita Lengkap</label>
                <RichTextEditor value={content} onChange={setContent} />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={resetForm} className="px-4 py-2 border text-slate-600 rounded-lg hover:bg-slate-50">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 font-medium"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}