import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://mr-onion-dev-portfolio-ud2z.vercel.app'),
  title: 'Abdullah Al Hadi — Portfolio',
  description:
    'Minimalist editorial portfolio of Abdullah Al Hadi — products, engineering, and developer education.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Abdullah Al Hadi — Portfolio',
    description:
      'Minimalist editorial portfolio of Abdullah Al Hadi — products, engineering, and developer education.',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Abdullah Al Hadi — Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abdullah Al Hadi — Portfolio',
    description:
      'Minimalist editorial portfolio of Abdullah Al Hadi — products, engineering, and developer education.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-black text-white antialiased overflow-x-hidden selection:bg-white selection:text-black font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
