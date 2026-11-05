'use client';

import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import gsap from 'gsap';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(pointer: fine)');
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function getSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: fine)').matches;
}

function getServerSnapshot() {
  return false;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const isFinePointer = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!isFinePointer || typeof window === 'undefined') return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Set initial center
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.2, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.2, ease: 'power3.out' });

    let hasMoved = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMoved) {
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
        hasMoved = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseEnterInteractive = () => {
      gsap.to(cursor, {
        scale: 4,
        opacity: 0.9,
        duration: 0.25,
        ease: 'power2.out',
      });
    };

    const handleMouseLeaveInteractive = () => {
      gsap.to(cursor, {
        scale: 1,
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Attach listeners to interactive elements
    const attachHoverListeners = () => {
      const interactives = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, .parallax-image, .project-item'
      );
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnterInteractive);
        el.addEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    };

    attachHoverListeners();

    // Re-check periodically when dynamic DOM nodes mount
    const observer = new MutationObserver(() => {
      attachHoverListeners();
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-3 h-3 rounded-full bg-white mix-blend-difference pointer-events-none z-[9999] will-change-transform"
      style={{ willChange: 'transform' }}
    />
  );
}
