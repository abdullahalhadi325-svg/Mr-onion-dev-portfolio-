import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Abdullah Al Hadi — Portfolio',
  description:
    'Minimalist editorial portfolio of Abdullah Al Hadi — products, engineering, and developer education.',
  openGraph: {
    title: 'Abdullah Al Hadi — Portfolio',
    description:
      'Minimalist editorial portfolio of Abdullah Al Hadi — products, engineering, and developer education.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abdullah Al Hadi — Portfolio',
    description:
      'Minimalist editorial portfolio of Abdullah Al Hadi — products, engineering, and developer education.',
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
