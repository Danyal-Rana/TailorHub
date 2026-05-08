import '../index.css';
import { Sidebar } from '../components/Sidebar';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <div className='min-h-screen flex selection:bg-indigo-100 selection:text-indigo-900'>
          <Sidebar isOpen={true} onClose={() => {}} />
          <main className='flex-1 md:ml-64 transition-all duration-300 min-h-screen flex flex-col bg-slate-50/50'>
            <div className='flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full'>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
