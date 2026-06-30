import type { Metadata } from 'next';
import { Barlow_Condensed, Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';
import { AuthGate } from '@/components/AuthGate';

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-display',
});

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-grotesk',
});

const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono-custom',
});

export const metadata: Metadata = {
  title: 'LANKA HQ',
  description: 'Sistema operativo modular para Lanka Collective',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${barlow.variable} ${grotesk.variable} ${mono.variable}`}>
      <body>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
