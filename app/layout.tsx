import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LANKA HQ',
  description: 'Sistema operativo modular para Lanka Collective',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
