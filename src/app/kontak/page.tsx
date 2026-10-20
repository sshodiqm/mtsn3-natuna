'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export default function KontakPage() {
  const [settings, setSettings] = useState<any>(null);
  const [menus, setMenus] = useState<any[]>([]);

  // Form State
  const [nama, setNama] = useState('');
  const [pesan, setPesan] = useState('');
  const [dikirim, setDikirim] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: sData } = await supabase.from('site_settings').select('*').single();
      const { data: mData } = await supabase.from('menus').select('*').order('order_index');
      if (sData) setSettings(sData);
      if (mData) setMenus(mData);
    }
    fetchData();
  }, []);

  const handleKirimPesan = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNum = settings?.phone?.replace(/[^0-9]/g, '') || '6281234567890';
    const text = encodeURIComponent(`Halo MTsN 3 Natuna,\n\nNama: ${nama}\nPesan: ${pesan}`);
    window.open(`https://wa.me/${phoneNum}?text=${text}`, '_blank');
    setDikirim(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar menus={menus} settings={settings} />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 opacity-90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-4">
            <div className="inline-block mb-4">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30">
                    Layanan Informasi
                </span>
            </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Hubungi Kami</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Kami siap melayani pertanyaan, konsultasi pendaftaran, dan informasi seputar MTsN 3 Natuna.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-16 w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Kartu Informasi Kontak */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-800 border-b pb-4">Informasi Kontak Resmi</h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Alamat Madrasah</h4>
                    <p className="text-slate-600 mt-1 leading-relaxed">{settings?.address || 'Kabupaten Natuna, Kepulauan Riau'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Telepon / WhatsApp</h4>
                    <p className="text-slate-600 mt-1">{settings?.phone || '(0773) 123456'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Email Resmi</h4>
                    <p className="text-slate-600 mt-1">{settings?.email || 'info@mtsn3natuna.sch.id'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Jam Layanan</h4>
                    <p className="text-slate-600 mt-1">Senin - Jumat: 07.00 - 15.00 WIB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Kirim Pesan */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b pb-4">Kirim Pesan Langsung</h2>

            {dikirim ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-lg">Pesan Terhubung ke WhatsApp!</h3>
                <p className="text-xs text-emerald-700">Terima kasih, pesan Anda langsung dialihkan ke obrolan WhatsApp resmi madrasah.</p>
              </div>
            ) : (
              <form onSubmit={handleKirimPesan} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Masukkan nama Anda..."
                    className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pesan / Pertanyaan</label>
                  <textarea
                    rows={5}
                    required
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    placeholder="Tuliskan pertanyaan Anda mengenai PPDB atau informasi sekolah..."
                    className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <Send className="w-4 h-4" /> Kirim Pesan via WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}