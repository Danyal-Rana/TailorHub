import Link from 'next/link';
import { Scissors, Github, Twitter, Instagram } from 'lucide-react';

const LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
  ],
  Platform: [
    { label: 'Sign Up', href: '/signup' },
    { label: 'Sign In', href: '/login' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Contact Us', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                <Scissors className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-display font-black text-white">TailorHub</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              The complete platform for tailors, customers, and delivery partners across Pakistan.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition-colors group"
                >
                  <Icon className="w-4 h-4 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-white font-bold text-sm mb-5">{group}</h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} TailorHub. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">Crafted with precision in Pakistan 🇵🇰</p>
        </div>
      </div>
    </footer>
  );
}
