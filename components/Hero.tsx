'use client';

import React, { useEffect, useRef } from 'react';
import { Linkedin, Github, MessageCircle, Mail, Instagram, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { HeroData, SocialLinks, siteData } from '@/lib/siteData';
import { MagneticButton, MagneticAnchor } from '@/components/MagneticButton';

interface HeroProps {
  data?: HeroData;
  socialLinks?: SocialLinks;
  lang?: 'en' | 'bn';
}

export default function Hero({
  data = siteData.en.hero,
  socialLinks = siteData.en.socialLinks,
  lang = 'en',
}: HeroProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subheadlineRef = useRef<HTMLParagraphElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
  const isBn = lang === 'bn';

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Staggered headline reveal with line masking
      const lines = headlineRef.current?.querySelectorAll('.headline-reveal-line');
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          {
            y: '115%',
            opacity: 0,
          },
          {
            y: '0%',
            opacity: 1,
            duration: 1.3,
            ease: 'power4.out',
            stagger: 0.12,
            force3D: true,
          }
        );
      }

      // 2. Subheadline smooth fade in
      if (subheadlineRef.current) {
        gsap.fromTo(
          subheadlineRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            delay: 0.35,
            force3D: true,
          }
        );
      }

      // 3. Hypnotic scroll indicator breathing animation
      if (scrollIndicatorRef.current) {
        gsap.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: -10 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            delay: 0.7,
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [lang]);

  const handleExploreClick = () => {
    const targetSection = document.getElementById(data.ctaPrimary.targetId || 'work-section');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.95, behavior: 'smooth' });
    }
  };

  const handleScrollIndicatorClick = () => {
    const targetSection = document.getElementById('work-section') || document.getElementById('about-section');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-end pb-24 md:pb-28 px-4 text-center bg-transparent select-none z-10"
    >
      <div className="flex flex-col items-center w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-24 md:pt-32 lg:pt-36">
        
        {/* SCARCITY STATUS BADGE */}
        {data.scarcityBadge && data.scarcityBadge.visible && (
          <div className="mb-10 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)] will-change-transform">
            <motion.div
              className={`relative flex h-3 w-3 rounded-full ${data.scarcityBadge.status === 'available' ? 'bg-[#25D366]' : 'bg-red-500'}`}
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
            <span className="text-xs md:text-sm font-mono font-bold tracking-wider uppercase text-white/90">
              {data.scarcityBadge.text}
            </span>
          </div>
        )}

        {/* Eyebrow / Role Marker */}
        <p className={`text-xs md:text-sm tracking-[0.28em] text-[#d4af37] mb-6 uppercase font-mono will-change-transform ${isBn ? "font-['Hind_Siliguri']" : ''}`}>
          {data.eyebrow}
        </p>

        {/* COHESIVE, ELEGANT EDITORIAL TYPOGRAPHY (NO MISMATCHED FONTS) */}
        <h1
          ref={headlineRef}
          className={`leading-[0.92] tracking-tight text-white select-none ${
            isBn
              ? "font-['Tiro_Bangla'] text-[11vw] sm:text-[9vw] md:text-[7.5vw] lg:text-[6.5vw] xl:text-[88px] font-bold"
              : 'font-serif text-[12vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[7.2vw] xl:text-[96px] font-bold'
          }`}
        >
          <div className="overflow-hidden inline-block w-full">
            <span className="headline-reveal-line block will-change-transform text-white">
              {data.headlinePrimary}
            </span>
          </div>
          <div className="overflow-hidden inline-block w-full mt-1 lg:mt-2">
            <span className={`headline-reveal-line block will-change-transform ${isBn ? 'not-italic text-white' : 'italic text-white/90'}`}>
              {data.headlineSecondary}
            </span>
          </div>
        </h1>

        {/* Subheadline with clean typography */}
        <p
          ref={subheadlineRef}
          className={`mt-8 md:mt-10 max-w-sm md:max-w-xl lg:max-w-2xl text-neutral-300 text-sm md:text-base lg:text-lg leading-relaxed will-change-transform ${
            isBn ? "font-['Hind_Siliguri'] text-base md:text-lg lg:text-xl" : 'font-sans'
          }`}
        >
          {data.subheadline}
        </p>

        {/* BUTTONS WITH TACTILE MAGNETIC INTERACTIONS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <MagneticButton
            onClick={handleExploreClick}
            className={`px-8 py-3.5 rounded-full border border-white/30 bg-white/5 hover:bg-white hover:text-black transition-all text-xs font-mono tracking-wider uppercase flex items-center gap-2 cursor-pointer backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 ${
              isBn ? "font-['Hind_Siliguri'] text-sm tracking-normal" : ''
            }`}
          >
            <span>{data.ctaPrimary.label}</span>
            <span className="text-base">↓</span>
          </MagneticButton>

          <MagneticAnchor
            href={data.ctaSecondary.url || socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-7 py-3.5 rounded-full border border-transparent hover:border-white/20 text-xs font-mono tracking-wider uppercase text-neutral-400 hover:text-white transition-all flex items-center gap-2 cursor-pointer ${
              isBn ? "font-['Hind_Siliguri'] text-sm tracking-normal" : ''
            }`}
          >
            <span>{data.ctaSecondary.label}</span>
            <span className="text-sm">↗</span>
          </MagneticAnchor>
        </div>

        {/* SOCIAL ICONS USING LUCIDE-REACT */}
        <div className="mt-10 flex gap-2 md:gap-4 items-center text-neutral-400">
          {socialLinks.whatsapp && (
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Direct WhatsApp Message"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 transition-all duration-300 ease-out hover:scale-110 hover:text-[#25D366] hover:drop-shadow-[0_0_8px_rgba(37,211,102,0.8)] will-change-transform"
            >
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 cursor-pointer text-neutral-400 group-hover:text-[#25D366] transition-colors" />
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 transition-all duration-300 ease-out hover:scale-110 hover:text-[#0077B5] hover:drop-shadow-[0_0_8px_rgba(0,119,181,0.8)] will-change-transform"
            >
              <Linkedin className="w-4 h-4 md:w-5 md:h-5 cursor-pointer transition-colors" />
            </a>
          )}
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 transition-all duration-300 ease-out hover:scale-110 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] will-change-transform"
            >
              <Github className="w-4 h-4 md:w-5 md:h-5 cursor-pointer transition-colors" />
            </a>
          )}
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 transition-all duration-300 ease-out hover:scale-110 hover:text-[#E1306C] hover:drop-shadow-[0_0_8px_rgba(225,48,108,0.8)] will-change-transform"
            >
              <Instagram className="w-4 h-4 md:w-5 md:h-5 cursor-pointer transition-colors" />
            </a>
          )}
          {socialLinks.facebook && (
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Profile"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 transition-all duration-300 ease-out hover:scale-110 hover:text-[#1877F2] hover:drop-shadow-[0_0_8px_rgba(24,119,242,0.8)] will-change-transform"
            >
              <Facebook className="w-4 h-4 md:w-5 md:h-5 cursor-pointer transition-colors" />
            </a>
          )}
          {socialLinks.email && (
            <a
              href={socialLinks.email}
              aria-label="Direct Email"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 transition-all duration-300 ease-out hover:scale-110 hover:text-[#d4af37] hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] will-change-transform"
            >
              <Mail className="w-4 h-4 md:w-5 md:h-5 cursor-pointer transition-colors" />
            </a>
          )}
        </div>

      </div>

      {/* 
        PSYCHOLOGICAL HOOK: HYPNOTIC "SCROLL TO DISCOVER" INDICATOR
      */}
      <div
        ref={scrollIndicatorRef}
        onClick={handleScrollIndicatorClick}
        aria-label="Scroll to discover content"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group text-neutral-500 hover:text-white transition-colors select-none"
      >
        <span
          className={`text-[9px] md:text-[10px] tracking-[0.28em] uppercase font-mono opacity-80 group-hover:opacity-100 ${
            isBn ? "font-['Hind_Siliguri'] tracking-[0.15em] text-[11px]" : ''
          }`}
        >
          {isBn ? 'স্ক্রোল করে দেখুন' : 'Scroll to discover'}
        </span>
        
        <div className="w-4 h-7 rounded-full border border-white/20 flex justify-center pt-1 shadow-[0_0_10px_rgba(255,255,255,0.05)]">
          <div className="w-1 h-2 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37] animate-hypnotic-pulse"></div>
        </div>
      </div>

    </section>
  );
}
