'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Memuat ReactQuill secara dinamis di sisi Client (SSR: false)
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="h-56 bg-slate-50 border border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs font-sans">
      Memuat Editor Teks...
    </div>
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  // Pengaturan Tombol Toolbar Lengkap (Gaya Summernote)
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'clean'],
    ],
  };

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
  ];

  return (
    <div className="bg-white rounded-xl overflow-hidden text-slate-800 font-sans border border-slate-300">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Tuliskan isi berita secara lengkap di sini..."
        className="h-60 mb-12"
      />
    </div>
  );
}