import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pixel Detective • ConvoQuest | Le Studio des Filtres & de la Convolution',
  description:
    'Apprends la convolution et les filtres d’image par le jeu et l’expérimentation visuelle. Spécialement conçu pour les 15–19 ans.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning className="dark h-full antialiased">
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#080b14] text-slate-100">
        {children}
      </body>
    </html>
  );
}
