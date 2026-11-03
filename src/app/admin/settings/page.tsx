'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Loader2, Image as ImageIcon, User, Building, Phone, Plus, Trash2 } from 'lucide-react';

interface HeroSlide {
  id?: string;
  title: string;
  subtitle: string;
  image_url: string;
  order_index: number;
}

export default function HomeSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingId, setSettingId] = useState<string | null>(null);

  // Form State Identitas Sekolah & Kontak
  const [schoolName, setSchoolName] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [principalNip, setPrincipalNip] = useState('');
  const [principalSpeech, setPrincipalSpeech] = useState('');
  const [principalPhotoUrl, setPrincipalPhotoUrl] = useState('');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Hero Slides State (Maksimal 5)
  const [slides, setSlides] = useState<HeroSlide[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // 1. Ambil Pengaturan Umum
    const { data: settingsData } = await supabase.from('site_settings').select('*').single();
    if (settingsData) {
      setSettingId(settingsData.id);
      setSchoolName(settingsData.school_name || '');
      setPrincipalName(settingsData.principal_name || '');
      setPrincipalNip(settingsData.principal_nip || '');
      setPrincipalSpeech(settingsData.principal_speech || '');
      setPrincipalPhotoUrl(settingsData.principal_photo_url || '');
      setPhone(settingsData.phone || '');
      setEmail(settingsData.email || '');
      setAddress(settingsData.address || '');
    }

    // 2. Ambil Daftar Hero Slides
    const { data: slidesData } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order_index', { ascending: true });

    if (slidesData) {
      setSlides(slidesData);
    }

    setLoading(false);
  };

  // Helper fungsi upload file ke Supabase Storage (Dengan Batasan 1 MB)
  const handleFileUpload = async (file: File, path: string) => {
    const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB limit
    if (file.size > MAX_SIZE_BYTES) {
      alert('⚠️ Ukuran gambar terlalu besar! Maksimal ukuran gambar yang diperbolehkan adalah 1 MB.');
      return null;
    }

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

  // Handler Manajemen Slide
  const handleAddSlide = () => {
    if (slides.length >= 5) {
      alert('⚠️ Maksimal slide hero banner adalah 5 gambar.');
      return;
    }
    setSlides((prev) => [
      ...prev,
      { title: '', subtitle: '', image_url: '', order_index: prev.length },
    ]);
  };

  const handleUpdateSlide = (index: number, field: keyof HeroSlide, value: string) => {
    setSlides((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDeleteSlide = async (index: number) => {
    const target = slides[index];
    if (target.id) {
      const { error } = await supabase.from('hero_slides').delete().eq('id', target.id);
      if (error) {
        alert(`Gagal menghapus slide: ${error.message}`);
        return;
      }
    }
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // 1. Simpan Identitas & Kontak Sekolah
    const payload = {
      school_name: schoolName,
      principal_name: principalName,
      principal_nip: principalNip,
      principal_speech: principalSpeech,
      principal_photo_url: principalPhotoUrl,
      phone,
      email,
      address,
      updated_at: new Date().toISOString(),
    };

    let settingsError;
    if (settingId) {
      const res = await supabase.from('site_settings').update(payload).eq('id', settingId);
      settingsError = res.error;
    } else {
      const res = await supabase.from('site_settings').insert([payload]);
      settingsError = res.error;
    }

    if (settingsError) {
      alert(`Gagal menyimpan pengaturan: ${settingsError.message}`);
      setSaving(false);
      return;
    }

    // 2. Simpan Seluruh Hero Slides
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const slidePayload = {
        title: slide.title,
        subtitle: slide.subtitle,
        image_url: slide.image_url,
        order_index: i,
      };

      if (slide.id) {
        await supabase.from('hero_slides').update(slidePayload).eq('id', slide.id);
      } else {
        await supabase.from('hero_slides').insert([slidePayload]);
      }
    }

    alert('✅ Pengaturan tampilan beranda & hero slideshow berhasil diperbarui!');
    fetchData();
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
    <div className="min-h-screen bg-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Building className="w-7 h-7 text-emerald-600" /> Kelola Tampilan Beranda
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Atur hero banner slider (maksimal 5 slide), sambutan Kepala Madrasah, dan identitas kontak.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Hero Slideshow Manager (Maksimal 5) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" /> Hero Slideshow (Maksimal 5 Gambar)
              </h2>
              <button
                type="button"
                onClick={handleAddSlide}
                disabled={slides.length >= 5}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 border border-emerald-200 disabled:opacity-50 transition"
              >
                <Plus className="w-4 h-4" /> Tambah Slide ({slides.length}/5)
              </button>
            </div>

            {slides.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm italic">
                Belum ada slide hero. Klik "Tambah Slide" untuk menambahkan slide gambar pertama Anda.
              </div>
            ) : (
              <div className="space-y-4">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id || index}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                        Slide #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(index)}
                        className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Slide (Heading)</label>
                        <input
                          type="text"
                          required
                          value={slide.title}
                          onChange={(e) => handleUpdateSlide(index, 'title', e.target.value)}
                          placeholder="Contoh: Prestasi Madrasah"
                          className="w-full px-3 py-2 border rounded-lg text-sm bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Subjudul Slide (Subheading)</label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => handleUpdateSlide(index, 'subtitle', e.target.value)}
                          placeholder="Penjelasan ringkas slide..."
                          className="w-full px-3 py-2 border rounded-lg text-sm bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Gambar Slide (Maksimal 1 MB)</label>
                      <div className="flex gap-4 items-center">
                        {slide.image_url && (
                          <img
                            src={slide.image_url}
                            alt="Slide Preview"
                            className="w-24 h-14 object-cover rounded border border-slate-300"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file, `hero-slide-${index + 1}`);
                              if (url) handleUpdateSlide(index, 'image_url', url);
                            }
                          }}
                          className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Identitas Madrasah */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-600" /> Identitas Madrasah
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
          </div>

          {/* Section 3: Sambutan Kepala Sekolah */}
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

          {/* Section 4: Kontak & Identitas */}
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