import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Typing Frog - Juego de Mecanografía',
  description: 'Juego arcade de mecanografía donde controlas una rana que salta entre nenúfares',
  keywords: 'typing, mecanografía, juego, rana, arcade, educativo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
