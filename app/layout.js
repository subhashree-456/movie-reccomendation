import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'FILMFOX - Personalized Cinematic Discovery',
  description:
    'Your premium destination for personalized cinematic discovery. FilmFox uses advanced machine learning to recommend your next favorite movie.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative flex flex-col min-h-screen bg-foxBg text-slate-100">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
