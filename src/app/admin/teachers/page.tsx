'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit2, Save, X, Users, Loader2, User } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  nip: string;
  subject: string;
  photo_url: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [subject, setSubject] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    const { data } = await supabase.from('teachers').select('*').order('created_at', { ascending: true });
    if (data) setTeachers(data);
    setLoading(false);
  };

  const handleFileUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `guru-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('school-assets').upload(fileName, file);
    if (error) return null;
    const { data } = supabase.storage.from('school-assets').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { name, nip, subject, photo_url: photoUrl };

    if (editingId) {
      await supabase.from('teachers').update(payload).eq('id', editingId);
    } else {
      await supabase.from('teachers').insert([payload]);
    }

    setSaving(false);
    resetForm();
    fetchTeachers();
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingId(teacher.id);
    setName(teacher.name);
    setNip(teacher.nip || '');
    setSubject(teacher.subject);
    setPhotoUrl(teacher.photo_url || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus data guru ini?')) return;
    await supabase.from('teachers').delete().eq('id', id);
    fetchTeachers();
  };

  const resetForm = () => {
    setName('');
    setNip('');
    setSubject('');
    setPhotoUrl('');
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-7 h-7 text-emerald-600" /> Kelola Data Guru & Staf
            </h1>
            <p className="text-slate-500 text-sm mt-1">Kelola direktori tenaga kependidikan MTsN 3 Natuna.</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" /> Tambah Guru
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Memuat data guru...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {teachers.map((t) => (
                <div key={t.id} className="border rounded-xl p-4 flex items-center gap-4 bg-slate-50/50 hover:bg-white transition">
                  {t.photo_url ? (
                    <img src={t.photo_url} alt={t.name} className="w-16 h-20 object-cover rounded-lg border" />
                  ) : (
                    <div className="w-16 h-20 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">{t.name}</h3>
                    <p className="text-xs font-medium text-emerald-700">{t.subject}</p>
                    <p className="text-xs text-slate-400 mt-1">NIP: {t.nip || '-'}</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleEdit(t)} className="text-xs text-blue-600 font-semibold hover:underline">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="text-xs text-red-600 font-semibold hover:underline">Hapus</button>
                    </div>
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
              <h3 className="font-bold text-slate-800">{editingId ? 'Edit Guru' : 'Tambah Guru Baru'}</h3>
              <button onClick={resetForm}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Nama Lengkap & Gelar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-slate-800"
              />
              <input
                type="text"
                placeholder="NIP (Opsional)"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-slate-800"
              />
              <input
                type="text"
                required
                placeholder="Mata Pelajaran / Jabatan"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-slate-800"
              />
              <div className="flex gap-3 items-center">
                {photoUrl && <img src={photoUrl} className="w-12 h-14 object-cover rounded border" />}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await handleFileUpload(file);
                      if (url) setPhotoUrl(url);
                    }
                  }}
                  className="text-xs text-slate-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg text-sm">Batal</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">
                  {saving ? 'Saving...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}