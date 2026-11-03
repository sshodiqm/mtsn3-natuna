'use client';

import { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, Award } from 'lucide-react';

// Sub-komponen Animasi Hitung Angka
function AnimatedCounter({ value, duration = 1500, suffix = '' }: { value: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Efek easing (cepat di awal, perlahan berhenti di akhir)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOutCubic * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <>{count}{suffix}</>;
}

export default function StatsSection() {
  return (
    <section className="-mt-2 relative z-20 max-w-7xl mx-auto px-4 sm:px-8 w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
        {/* Siswa Aktif */}
        <div className="flex items-center gap-4 p-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-800">
              <AnimatedCounter value={450} suffix="+" />
            </p>
            <p className="text-xs text-slate-500 font-medium">Siswa Aktif</p>
          </div>
        </div>

        {/* Guru & Staf */}
        <div className="flex items-center gap-4 p-2">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-800">
              <AnimatedCounter value={32} />
            </p>
            <p className="text-xs text-slate-500 font-medium">Guru & Staf</p>
          </div>
        </div>

        {/* Rombongan Belajar */}
        <div className="flex items-center gap-4 p-2">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-800">
              <AnimatedCounter value={12} />
            </p>
            <p className="text-xs text-slate-500 font-medium">Rombongan Belajar</p>
          </div>
        </div>

        {/* Akreditasi */}
        <div className="flex items-center gap-4 p-2">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-800">A</p>
            <p className="text-xs text-slate-500 font-medium">Akreditasi</p>
          </div>
        </div>
      </div>
    </section>
  );
}