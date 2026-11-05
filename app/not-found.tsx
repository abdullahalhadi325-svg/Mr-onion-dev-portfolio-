import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full border border-white/10 rounded-sm bg-neutral-950 p-8 shadow-2xl">
        <span className="text-xs font-mono text-[#d4af37] tracking-widest uppercase block mb-3">
          Error 404 // Route Not Found
        </span>
        <h1 className="text-5xl font-serif text-white tracking-tight mb-4">
          404
        </h1>
        <p className="text-xs font-mono text-neutral-400 leading-relaxed mb-8">
          The requested system architecture endpoint or page does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black text-xs font-mono tracking-wider uppercase font-semibold hover:bg-neutral-200 transition-colors"
        >
          Return to Portfolio
        </Link>
      </div>
    </main>
  );
}
