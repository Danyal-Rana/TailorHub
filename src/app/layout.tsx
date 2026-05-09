import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import '../index.css';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'sonner';

const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'TailorHub',
  description: 'Where Threads Meet Excellence',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body suppressHydrationWarning className="font-body">
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
