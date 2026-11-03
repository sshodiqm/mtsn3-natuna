'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
}

interface HeroSliderProps {
  slides: Slide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide setiap 5 detik
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[450px] sm:h-[550px] overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id || currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Gambar Hero */}
          <img
            src={currentSlide.image_url}
            alt={currentSlide.title}
            className="w-full h-full object-cover"
          />

          {/* Animasi Layer Bayangan Gradasi Hitam di Bagian Bawah */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
          />

          {/* Animasi Masuknya Tulisan Judul & Subjudul */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 max-w-4xl mx-auto text-center z-10 space-y-3">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl sm:text-3xl font-black text-white leading-tight drop-shadow-md"
            >
              {currentSlide.title}
            </motion.h2>

            {currentSlide.subtitle && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl mx-auto drop-shadow-sm font-medium"
              >
                {currentSlide.subtitle}
              </motion.p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Tombol Navigasi Kiri & Kanan */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 sm:p-3 rounded-full transition"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 sm:p-3 rounded-full transition"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Indikator Titik (Pagination Dots) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-6 bg-emerald-500' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}