'use client';

import React, { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Portfolio App runtime error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full border border-white/10 rounded-sm bg-neutral-950 p-8 shadow-2xl">
        <span className="text-xs font-mono text-red-400 tracking-widest uppercase block mb-3">
          Runtime Exception
        </span>
        <h2 className="text-3xl font-serif text-white tracking-tight mb-4">
          Architectural Fault
        </h2>
        <p className="text-xs font-mono text-neutral-400 leading-relaxed mb-8">
          {error.message || 'An unexpected runtime state occurred.'}
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black text-xs font-mono tracking-wider uppercase font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          Recover Session
        </button>
      </div>
    </main>
  );
}
