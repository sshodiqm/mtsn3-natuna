'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Kegiatan');

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    const { data } = await supabase.from('galleries').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleFileUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `galeri-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('school-assets').upload(fileName, file);
    if (error) return null;
    const { data } = supabase.storage.from('school-assets').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert('Silakan unggah foto terlebih dahulu');
    setSaving(true);

    await supabase.from('galleries').insert([{ title, image_url: imageUrl, category }]);
    setSaving(false);
    resetForm();
    fetchGallery();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus foto galeri ini?')) return;
    await supabase.from('galleries').delete().eq('id', id);
    fetchGallery();
  };

  const resetForm = () => {
    setTitle('');
    setImageUrl('');
    setCategory('Kegiatan');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-7 h-7 text-emerald-600" /> Galeri Foto Kegiatan
            </h1>
            <p className="text-slate-500 text-sm mt-1">Dokumentasi foto kegiatan dan momen penting di madrasah.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2">
            <Plus className="w-5 h-5" /> Unggah Foto
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {loading ? (
            <div className="text-center py-8 text-slate-500">Memuat galeri...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.id} className="group relative rounded-lg overflow-hidden border bg-slate-100 aspect-square">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-3 flex flex-col justify-end text-white">
                    <p className="font-semibold text-sm truncate">{item.title}</p>
                    <p className="text-xs text-slate-300">{item.category}</p>
                    <button onClick={() => handleDelete(item.id)} className="mt-2 text-xs bg-red-600/80 hover:bg-red-600 text-white py-1 rounded">
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800">Unggah Foto Galeri</h3>
              <button onClick={resetForm}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Judul / Deskripsi Foto"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-slate-800"
              />
              <input
                type="text"
                placeholder="Kategori (contoh: Pramuka, Upacara, Olahraga)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-slate-800"
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await handleFileUpload(file);
                      if (url) setImageUrl(url);
                    }
                  }}
                  className="text-xs text-slate-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg text-sm">Batal</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">
                  {saving ? 'Saving...' : 'Simpan Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}