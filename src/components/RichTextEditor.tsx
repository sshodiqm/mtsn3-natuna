'use client';

import { useRef, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import 'react-quill-new/dist/quill.snow.css';

// Memuat ReactQuill dan Modul ImageResize secara dinamis di sisi Client (Bebas SSR Error)
const ReactQuill = dynamic(
  async () => {
    const { default: RQ, Quill } = await import('react-quill-new');
    const { default: ImageResize } = await import('quill-image-resize-module-react');

    // Mendaftarkan modul ImageResize ke Quill
    Quill.register('modules/imageResize', ImageResize);

    return function ReactQuillComponent({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-56 bg-slate-50 border border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs font-sans">
        Memuat Editor Teks...
      </div>
    ),
  }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const quillRef = useRef<any>(null);

  // Handler kustom untuk mengunggah dan memvalidasi gambar
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // 1. Validasi Ukuran Gambar (Maksimal 1 MB)
      const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1 Megabyte
      if (file.size > MAX_SIZE_BYTES) {
        alert('⚠️ Ukuran gambar terlalu besar! Maksimal ukuran gambar yang diperbolehkan adalah 1 MB.');
        return;
      }

      try {
        // 2. Buat nama file unik
        const fileExt = file.name.split('.').pop();
        const fileName = `editor-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

        // 3. Unggah ke Supabase Storage (bucket 'school-assets')
        const { error: uploadError } = await supabase.storage
          .from('school-assets')
          .upload(fileName, file);

        if (uploadError) {
          alert(`Gagal mengunggah gambar: ${uploadError.message}`);
          return;
        }

        // 4. Dapatkan URL publik dari Supabase Storage
        const { data } = supabase.storage.from('school-assets').getPublicUrl(fileName);
        const publicUrl = data.publicUrl;

        // 5. Sisipkan gambar ke dalam editor pada posisi kursor
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', publicUrl);
          quill.setSelection(range.index + 1);
        }
      } catch (error) {
        alert('Terjadi kesalahan saat mengunggah gambar ke editor.');
      }
    };
  }, []);

  // Pengaturan Toolbar, ImageResize & Handler React Quill
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image', 'clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      // Aktifkan modul ImageResize untuk memungut (drag) dan membesarkan/mengecilkan gambar
      imageResize: {
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
      },
    }),
    [imageHandler]
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'align',
    'link',
    'image',
  ];

  return (
    <div className="bg-white rounded-xl overflow-hidden text-slate-800 font-sans border border-slate-300">
      <ReactQuill
        forwardedRef={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Tuliskan isi konten secara lengkap di sini..."
        className="h-64 mb-12"
      />
    </div>
  );
}