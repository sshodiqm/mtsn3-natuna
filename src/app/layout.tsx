import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MTsN 3 Natuna - Portal Resmi Madrasah',
  description: 'Website Resmi Madrasah Tsanawiyah Negeri 3 Natuna',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${poppins.className} antialiased bg-slate-50 text-slate-800`}>
        {children}
      </body>
    </html>
  );
}