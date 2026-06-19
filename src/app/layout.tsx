import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuakeGuard Bangladesh — Live Seismic Risk Monitor',
  description: 'Real-time earthquake monitoring and risk assessment focused on Bangladesh, tracking seismic activity across South & Southeast Asia.',
  keywords: ['earthquake', 'Bangladesh', 'seismic', 'risk', 'monitor', 'USGS', 'Dhaka'],
  openGraph: {
    title: 'QuakeGuard Bangladesh',
    description: 'Live earthquake risk dashboard for Bangladesh',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-navy-900 text-white antialiased font-body">
        {children}
      </body>
    </html>
  );
}
