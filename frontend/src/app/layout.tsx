import './globals.css';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 flex items-center justify-center min-h-screen">
        {children}
      </body>
    </html>
  );
}
