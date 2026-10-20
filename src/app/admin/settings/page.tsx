'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Loader2, Image as ImageIcon, User, Building, Phone, Mail, MapPin } from 'lucide-react';

export default function HomeSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingId, setSettingId] = useState<string | null>(null);

  // Form State
  const [schoolName, setSchoolName] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  
  const [principalName, setPrincipalName] = useState('');
  const [principalNip, setPrincipalNip] = useState('');
  const [principalSpeech, setPrincipalSpeech] = useState('');
  const [principalPhotoUrl, setPrincipalPhotoUrl] = useState('');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from('site_settings').select('*').single();

    if (data) {
      setSettingId(data.id);
      setSchoolName(data.school_name || '');
      setHeroTitle(data.hero_title || '');
      setHeroSubtitle(data.hero_subtitle || '');
      setHeroImageUrl(data.hero_image_url || '');
      setPrincipalName(data.principal_name || '');
      setPrincipalNip(data.principal_nip || '');
      setPrincipalSpeech(data.principal_speech || '');
      setPrincipalPhotoUrl(data.principal_photo_url || '');
      setPhone(data.phone || '');
      setEmail(data.email || '');
      setAddress(data.address || '');
    }
    setLoading(false);
  };

  // Helper fungsi upload file ke Supabase Storage
  const handleFileUpload = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('school-assets')
      .upload(fileName, file);

    if (uploadError) {
      alert(`Gagal upload gambar: ${uploadError.message}`);
      return null;
    }

    const { data } = supabase.storage.from('school-assets').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      school_name: schoolName,
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle,
      hero_image_url: heroImageUrl,
      principal_name: principalName,
      principal_nip: principalNip,
      principal_speech: principalSpeech,
      principal_photo_url: principalPhotoUrl,
      phone,
      email,
      address,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (settingId) {
      const res = await supabase.from('site_settings').update(payload).eq('id', settingId);
      error = res.error;
    } else {
      const res = await supabase.from('site_settings').insert([payload]);
      error = res.error;
    }

    if (error) {
      alert(`Gagal menyimpan pengaturan: ${error.message}`);
    } else {
      alert('✅ Pengaturan tampilan beranda berhasil diperbarui!');
      fetchSettings();
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-8 flex items-center justify-center text-slate-500 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" /> Memuat data pengaturan...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Building className="w-7 h-7 text-emerald-600" /> Kelola Tampilan Beranda
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Atur teks hero banner, sambutan Kepala Madrasah, dan identitas kontak sekolah.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Hero Banner */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-600" /> Bagian Hero Banner (Atas)
            </h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Madrasah</label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Judul Utama Hero (Heading)</label>
              <textarea
                rows={2}
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Subjudul Hero (Subheading)</label>
              <textarea
                rows={2}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Gambar Hero Banner</label>
              <div className="flex gap-4 items-center">
                {heroImageUrl && (
                  <img src={heroImageUrl} alt="Hero Preview" className="w-24 h-16 object-cover rounded border" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await handleFileUpload(file, 'hero-bg');
                      if (url) setHeroImageUrl(url);
                    }
                  }}
                  className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Sambutan Kepala Sekolah */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" /> Sambutan Kepala Madrasah
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Kepala Madrasah</label>
                <input
                  type="text"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">NIP Kepala Madrasah</label>
                <input
                  type="text"
                  value={principalNip}
                  onChange={(e) => setPrincipalNip(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Teks Sambutan</label>
              <textarea
                rows={5}
                value={principalSpeech}
                onChange={(e) => setPrincipalSpeech(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Foto Resmi Kepala Madrasah</label>
              <div className="flex gap-4 items-center">
                {principalPhotoUrl && (
                  <img src={principalPhotoUrl} alt="Foto Kepala" className="w-16 h-20 object-cover rounded border" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await handleFileUpload(file, 'principal-photo');
                      if (url) setPrincipalPhotoUrl(url);
                    }
                  }}
                  className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Kontak & Identitas */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-600" /> Informasi Kontak & Alamat
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Simpan Perubahan Tampilan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}