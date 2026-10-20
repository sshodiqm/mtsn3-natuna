import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UserPlus, FileText, CheckCircle2, Calendar, Phone, ArrowRight, Download, HelpCircle } from 'lucide-react';

// Tambahkan baris ini agar Vercel merender data Supabase secara dinamis
export const dynamic = 'force-dynamic';

export default async function PpdbPage() {
  const { data: settings } = await supabase.from('site_settings').select('*').single();
  const { data: menus } = await supabase.from('menus').select('*').order('order_index');

  const steps = [
    { step: '01', title: 'Pendaftaran Daring/Luring', desc: 'Mengisi formulir pendaftaran secara online melalui situs resmi atau datang langsung ke sekretariat PPDB MTsN 3 Natuna.' },
    { step: '02', title: 'Penyerahan Berkas', desc: 'Melengkapi dan menyerahkan fotokopi dokumen persyaratan (Akte, KK, Ijazah/SKL, dan Foto).' },
    { step: '03', title: 'Tes Pemetaan & Baca Al-Qur\'an', desc: 'Pelaksanaan pemetaan akademik dasar serta pemetaan kemampuan membaca Al-Qur\'an calon siswa.' },
    { step: '04', title: 'Pengumuman & Daftar Ulang', desc: 'Pengumuman hasil kelulusan penerimaan dan proses pendaftaran ulang bagi calon siswa yang diterima.' },
  ];

  const requirements = [
    'Mengisi Formulir Pendaftaran PPDB.',
    'Fotokopi Ijazah SD/MI atau Surat Keterangan Lulus (SKL) yang telah dilegalisir (2 lembar).',
    'Fotokopi Kartu Keluarga (KK) & Akta Kelahiran (2 lembar).',
    'Fotokopi Kartu NISN resmi dari Kementerian Agama / Kemendikbud.',
    'Pas foto berwarna ukuran 3x4 terbaru (3 lembar).',
    'Fotokopi Kartu KIP / PKH / KPS (jika memiliki).',
  ];

  const schedule = [
    { event: 'Pendaftaran Gelombang I', date: '01 Mei - 15 Juni 2026', status: 'Dibuka' },
    { event: 'Verifikasi Berkas & Pemetaan', date: '18 Juni - 20 Juni 2026', status: 'Mendatang' },
    { event: 'Pengumuman Kelulusan', date: '25 Juni 2026', status: 'Mendatang' },
    { event: 'Pendaftaran Ulang Siswa Baru', date: '27 Juni - 30 Juni 2026', status: 'Mendatang' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar menus={menus || []} settings={settings} />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 opacity-90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-4">
            <div className="inline-block mb-4">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30">
                    Tahun Ajaran 2026/2027
                </span>
            </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Penerimaan Peserta Didik Baru (PPDB)</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Bergabunglah menjadi bagian dari keluarga besar MTsN 3 Natuna dan wujudkan generasi islami yang berakhlak mulia dan berprestasi.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-16 w-full space-y-16">
        {/* Banner Aksi Utama */}
        <section className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="bg-amber-400 text-slate-950 text-xs font-black uppercase px-3 py-1 rounded-full">
              Pendaftaran Resmi Dibuka
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Siap Menjadi Siswa Berprestasi di MTsN 3 Natuna?
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Daftarkan putra-putri Anda secara langsung atau konsultasikan syarat pendaftaran dengan Panitia PPDB melalui layanan WhatsApp resmi.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <a
              href={`https://wa.me/${settings?.phone?.replace(/[^0-9]/g, '') || '6281234567890'}?text=Halo%20Panitia%20PPDB%20MTsN%203%20Natuna,%20saya%20ingin%20bertanya%20mengenai%20pendaftaran%20siswa%20baru.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Hubungi Panitia PPDB
            </a>
          </div>
        </section>

        {/* Alur Pendaftaran */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Tahapan PPDB</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">Alur Pendaftaran Siswa Baru</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative space-y-3">
                <span className="text-3xl font-black text-emerald-600/20 absolute top-4 right-4">{item.step}</span>
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-slate-800 text-base">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Persyaratan Berkas & Jadwal Kegiatan */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Persyaratan */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Persyaratan Berkas</h3>
                <p className="text-xs text-slate-500">Dokumen yang wajib dilengkapi saat penyerahan berkas.</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              {requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Jadwal Kegiatan */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Jadwal Penting</h3>
                <p className="text-xs text-slate-500">Agenda penerimaan siswa baru tahun 2026.</p>
              </div>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              {schedule.map((sch, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{sch.event}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{sch.date}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${sch.status === 'Dibuka' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {sch.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}