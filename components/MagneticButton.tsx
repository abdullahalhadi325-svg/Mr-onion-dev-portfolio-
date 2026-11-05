'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  ...props
}: MagneticButtonProps) {
  const elementRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!elementRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = elementRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;

    gsap.to(elementRef.current, {
      x,
      y,
      duration: 0.3,
      ease: 'power2.out',
      force3D: true,
    });
  };

  const handleMouseLeave = () => {
    if (!elementRef.current) return;
    gsap.to(elementRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.4)',
      force3D: true,
    });
  };

  return (
    <button
      ref={elementRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`will-change-transform ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface MagneticAnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  strength?: number;
}

export function MagneticAnchor({
  children,
  className = '',
  strength = 0.3,
  ...props
}: MagneticAnchorProps) {
  const elementRef = useRef<HTMLAnchorElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!elementRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = elementRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;

    gsap.to(elementRef.current, {
      x,
      y,
      duration: 0.3,
      ease: 'power2.out',
      force3D: true,
    });
  };

  const handleMouseLeave = () => {
    if (!elementRef.current) return;
    gsap.to(elementRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.4)',
      force3D: true,
    });
  };

  return (
    <a
      ref={elementRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`will-change-transform ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
