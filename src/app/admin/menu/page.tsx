'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, Save, X, Menu as MenuIcon, Loader2, CornerDownRight } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';

interface MenuItem {
  id: string;
  title: string;
  url: string;
  slug?: string | null;
  content?: string | null;
  parent_id: string | null;
  order_index: number;
  is_active: boolean;
}

export default function MenuBuilderPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [orderIndex, setOrderIndex] = useState(0);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && data) {
      setMenus(data);
    }
    setLoading(false);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!editingId) {
      const generatedSlug = generateSlug(newTitle);
      setSlug(generatedSlug);
      setUrl(`/${generatedSlug}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const finalSlug = slug ? slug : generateSlug(title);
    const finalUrl = url ? url : `/${finalSlug}`;

    const payload = {
      title,
      url: finalUrl,
      slug: finalSlug,
      content,
      parent_id: parentId === '' ? null : parentId,
      order_index: Number(orderIndex) || menus.length + 1,
    };

    let error;
    if (editingId) {
      const res = await supabase.from('menus').update(payload).eq('id', editingId);
      error = res.error;
    } else {
      const res = await supabase.from('menus').insert([payload]);
      error = res.error;
    }

    if (error) {
      alert(`Gagal menyimpan menu: ${error.message}`);
    } else {
      resetForm();
      fetchMenus();
    }

    setSaving(false);
  };

  const handleEdit = (menu: MenuItem) => {
    setEditingId(menu.id);
    setTitle(menu.title);
    setUrl(menu.url);
    setSlug(menu.slug || '');
    setContent(menu.content || '');
    setParentId(menu.parent_id || '');
    setOrderIndex(menu.order_index);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus menu ini? Submenu di dalamnya juga akan terhapus.')) return;
    setLoading(true);
    await supabase.from('menus').delete().eq('id', id);
    fetchMenus();
  };

  const changeOrder = async (menu: MenuItem, direction: 'up' | 'down') => {
    const newOrder = direction === 'up' ? menu.order_index - 1 : menu.order_index + 1;
    if (newOrder < 1) return;

    await supabase.from('menus').update({ order_index: newOrder }).eq('id', menu.id);
    fetchMenus();
  };

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setSlug('');
    setContent('');
    setParentId('');
    setOrderIndex(0);
    setEditingId(null);
    setIsModalOpen(false);
  };

  const mainMenus = menus.filter((m) => !m.parent_id);
  const getSubmenus = (parentId: string) => menus.filter((m) => m.parent_id === parentId);

  return (
    <div className="space-y-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <MenuIcon className="w-7 h-7 text-emerald-600" /> Kelola Navbar & Menu
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Atur menu navigasi utama, submenu, beserta isi konten halaman dinamisnya.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-5 h-5" /> Tambah Menu
          </button>
        </div>

        {/* List Menu Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Memuat data menu...
            </div>
          ) : mainMenus.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Belum ada menu. Klik Tambah Menu untuk membuat baru.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {mainMenus.map((menu) => {
                const submenus = getSubmenus(menu.id);
                return (
                  <div key={menu.id} className="p-4 hover:bg-slate-50 transition">
                    {/* Menu Utama */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs flex items-center justify-center">
                          {menu.order_index}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800">{menu.title}</p>
                          <p className="text-xs text-slate-400 font-mono">{menu.url}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => changeOrder(menu, 'up')}
                          className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200"
                          title="Naikkan Urutan"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => changeOrder(menu, 'down')}
                          className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200"
                          title="Turunkan Urutan"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(menu)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Menu"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(menu.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Hapus Menu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Submenu List */}
                    {submenus.length > 0 && (
                      <div className="mt-3 ml-8 pl-4 border-l-2 border-slate-200 space-y-2">
                        {submenus.map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between bg-slate-100/70 p-2.5 rounded-md">
                            <div className="flex items-center gap-2">
                              <CornerDownRight className="w-4 h-4 text-slate-400" />
                              <div>
                                <p className="font-medium text-sm text-slate-700">{sub.title}</p>
                                <p className="text-xs text-slate-400 font-mono">{sub.url}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEdit(sub)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(sub.id)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Form Tambah/Edit Menu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-xl my-8">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-lg text-slate-800">
                {editingId ? 'Edit Menu / Halaman' : 'Tambah Menu / Halaman Baru'}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Menu</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Contoh: Sejarah, Visi Misi"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setUrl(`/${e.target.value}`);
                    }}
                    placeholder="sejarah-madrasah"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">URL / Link Target</label>
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Contoh: /sejarah atau https://..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Induk Menu (Parent)</label>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
                  >
                    <option value="">-- Menu Utama (Tanpa Induk) --</option>
                    {mainMenus
                      .filter((m) => m.id !== editingId)
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          Submenu dari: {m.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Urutan (Order Index)</label>
                <input
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(Number(e.target.value))}
                  placeholder="1, 2, 3..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Isi Konten Halaman (Rich Text)</label>
                <RichTextEditor value={content} onChange={setContent} />
                <p className="text-xs text-slate-400 mt-1">
                  Isi bagian ini jika menu/submenu ditujukan untuk menampilkan halaman bacaan khusus (seperti Sejarah, Visi Misi, atau Profil).
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border text-slate-600 rounded-lg font-medium hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Menu & Konten
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}