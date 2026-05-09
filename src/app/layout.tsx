import type {Metadata} from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import Footer from '@/components/Footer';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Voyage Compass - Andhra Pradesh Tourism',
  description: 'Explore 32 breathtaking wonders of Andhra Pradesh and connect with verified local guides.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col [scrollbar-gutter:stable]" suppressHydrationWarning>
        <FirebaseClientProvider>
          <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            <Navbar />
            <main className="flex-grow w-full max-w-[100vw]">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
