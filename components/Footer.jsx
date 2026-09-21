import Link from 'next/link';
import { Film, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foxBg border-t border-foxBorder py-12 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & description */}
        <div className="col-span-1 md:col-span-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-foxAccent text-2xl font-bold uppercase tracking-wider mb-4"
          >
            <Film className="w-6 h-6" /> FILMFOX
          </Link>
          <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
            Your premium destination for personalized cinematic discovery. FilmFox uses advanced algorithms to find your next favorite movie.
          </p>
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <a
            href="#"
            className="hover:text-white hover:-translate-y-1 transition-all"
            aria-label="Github"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="hover:text-white hover:-translate-y-1 transition-all"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="hover:text-white hover:-translate-y-1 transition-all"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
