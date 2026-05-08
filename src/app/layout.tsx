import '../index.css';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'TailorHub',
  description: 'Where Threads Meet Excellence',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="font-body">
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
