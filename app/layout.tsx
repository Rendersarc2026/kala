import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-gotham',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KALA | Premium Interior Design Studio',
  description: 'An award-winning interior design studio specializing in residential, commercial, and hospitality interiors. Sculpting warm, tactile spaces with a refined editorial aesthetic.',
  keywords: ['interior design', 'luxury residential design', 'hospitality interiors', 'commercial architects', 'modular kitchens', 'soho design studio'],
  authors: [{ name: 'KALA Studio' }],
  creator: 'KALA Studio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kaladesign.com',
    title: 'KALA | Premium Interior Design Studio',
    description: 'Bespoke residential, commercial, and hospitality interiors designed with meticulous craftsmanship.',
    siteName: 'KALA Studio',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-charcoal selection:bg-terracotta selection:text-bone">
        <Header />
        <SmoothScroll>
          <PageTransition>
            <main className="flex-grow pt-0">{children}</main>
          </PageTransition>
        </SmoothScroll>
        <Footer />
      </body>
    </html>
  );
}
