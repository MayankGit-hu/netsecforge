import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProgressProvider } from '@/context/ProgressContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: 'NetSecForge | Zero-to-Expert Network Security & Cybersecurity Platform',
  description:
    'Enterprise-grade interactive learning platform combining technical documentation, visual React Flow topologies, packet byte dissectors, simulated terminal sandboxes, and certification tracking.',
  keywords: [
    'Network Security',
    'Cybersecurity',
    'Next-Gen Firewalls',
    'Palo Alto PCNSE',
    'Cisco CCNA',
    'CCNP Security',
    'CompTIA Security+',
    'Fortinet FortiGate',
    'Packet Dissector',
    'Wireshark',
    'Zero Trust Architecture',
    'AlgoSec',
    'Tufin',
    'CISSP',
  ],
  authors: [{ name: 'NetSecForge Architecture Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
      <head>
        <meta name="color-scheme" content="dark" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 cyber-grid selection:bg-cyan-500/30 selection:text-cyan-200">
        <ProgressProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </ProgressProvider>
      </body>
    </html>
  );
}
