'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  ArrowUp,
  MessageCircle,
  Linkedin,
  Github,
  Instagram,
  Facebook,
  Mail,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { FooterData, SocialLinks, siteData } from '@/lib/siteData';
import { MagneticAnchor, MagneticButton } from '@/components/MagneticButton';

interface FooterProps {
  data?: FooterData;
  socialLinks?: SocialLinks;
  heroName?: string;
  lang?: 'en' | 'bn';
  onScrollToTop?: () => void;
}

export default function Footer({
  data = siteData.en.footer,
  socialLinks = siteData.en.socialLinks,
  heroName = siteData.en.hero.name,
  lang = 'en',
  onScrollToTop,
}: FooterProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const isBn = lang === 'bn';
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      const lines = headlineRef.current?.querySelectorAll('.footer-reveal-line');
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          { y: '120%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 1.35,
            ease: 'power4.out',
            stagger: 0.12,
            force3D: true,
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [lang, data]);

  const copyToClipboard = (text: string, type: 'phone' | 'email') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'phone') {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      } else {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      }
    }
  };

  const whatsappNumber = '+8801934885834';
  const emailAddress = 'abdullahalhadi325@gmail.com';

  return (
    <footer
      id="contact-section"
      ref={containerRef}
      className="relative z-10 w-full bg-black text-white pt-28 md:pt-44 lg:pt-52 pb-16 px-6 md:px-16 lg:px-24 border-t border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[60vh]">
        
        {/* Top Eyebrow Bar */}
        <div className="flex items-center justify-between pb-8 border-b border-white/10">
          <span className={`text-xs tracking-[0.25em] text-[#d4af37] uppercase flex items-center gap-3 font-mono ${isBn ? "font-['Hind_Siliguri'] tracking-[0.1em]" : ''}`}>
            <span className="w-2 h-2 bg-[#d4af37] inline-block shrink-0"></span>
            {data.eyebrow || (isBn ? '০৩ / সরাসরি যোগাযোগ' : '03 / DIRECT COLLABORATION')}
          </span>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest hidden sm:inline-block">
            {isBn ? 'নতুন সুযোগ ও প্রজেক্টে যুক্ত হন' : 'AVAILABLE FOR HIGH-IMPACT SYSTEMS'}
          </span>
        </div>

        {/* MASSIVE EDITORIAL HEADLINE: "Let's architect something great." */}
        <div className="py-16 md:py-24 lg:py-32">
          <h2
            ref={headlineRef}
            className={`tracking-tighter text-white max-w-6xl leading-[0.92] select-none ${
              isBn
                ? "font-['Tiro_Bangla'] text-4xl sm:text-6xl md:text-[6.5vw] lg:text-[5.5vw] xl:text-[76px] font-normal"
                : 'font-serif text-5xl sm:text-7xl md:text-[7.5vw] lg:text-[6.8vw] xl:text-[88px] font-light'
            }`}
          >
            <div className="overflow-hidden">
              <span className="footer-reveal-line block will-change-transform">
                {data.headlinePrimary || "Let's architect something"}
              </span>
            </div>
            <div className="overflow-hidden mt-1 md:mt-3">
              <span className={`footer-reveal-line block will-change-transform text-white/90 ${isBn ? 'not-italic font-normal' : 'italic font-light'}`}>
                {data.headlineSecondary || "great."}
              </span>
            </div>
          </h2>

          <div className="mt-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <p className={`text-neutral-400 max-w-xl text-base md:text-lg lg:text-xl leading-relaxed ${isBn ? "font-['Hind_Siliguri']" : 'font-sans'}`}>
              {data.subtext ||
                'Available for full-stack system architecture, high-scale web & mobile app engineering, developer education, security audits, and founder-led initiatives.'}
            </p>

            {/* Direct High-Contrast Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto shrink-0">
              <MagneticAnchor
                href={`https://wa.me/8801934885834`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-black hover:bg-neutral-200 transition-all text-xs font-mono tracking-wider uppercase font-semibold cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.15)] active:scale-95 ${
                  isBn ? "font-['Hind_Siliguri'] text-base tracking-normal" : ''
                }`}
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                <span>{isBn ? 'হোয়াটসঅ্যাপে মেসেজ দিন' : 'WhatsApp +8801934885834'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </MagneticAnchor>

              <MagneticAnchor
                href={`mailto:${emailAddress}`}
                className={`inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/20 hover:border-white text-neutral-300 hover:text-white transition-all text-xs font-mono tracking-wider uppercase cursor-pointer ${
                  isBn ? "font-['Hind_Siliguri'] text-base tracking-normal" : ''
                }`}
              >
                <Mail className="w-4 h-4 text-[#d4af37]" />
                <span>{isBn ? 'ইমেইল পাঠান' : 'Send Direct Email'}</span>
              </MagneticAnchor>
            </div>
          </div>

          {/* Quick Copy Contact Bar */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center gap-8 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-3">
              <span className="text-neutral-500">DIRECT WHATSAPP:</span>
              <a
                href="https://wa.me/8801934885834"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#25D366] transition-colors"
              >
                {whatsappNumber}
              </a>
              <button
                onClick={() => copyToClipboard(whatsappNumber, 'phone')}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="Copy WhatsApp Number"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-[#25D366]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-neutral-500">EMAIL:</span>
              <a
                href={`mailto:${emailAddress}`}
                className="text-white hover:text-[#d4af37] transition-colors"
              >
                {emailAddress}
              </a>
              <button
                onClick={() => copyToClipboard(emailAddress, 'email')}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="Copy Email Address"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#d4af37]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Brand & Scroll To Top Row */}
        <div className="pt-10 pb-8 flex items-center justify-between border-t border-white/10">
          <div className="flex items-baseline gap-3">
            <span className={`text-2xl md:text-3xl font-light text-white tracking-tight ${isBn ? "font-['Tiro_Bangla']" : 'font-serif'}`}>
              {heroName}
            </span>
            <span className="text-xs font-mono text-neutral-500 hidden sm:inline-block">/ SYSTEM ARCHITECT & VIBE CODER</span>
          </div>

          {onScrollToTop && (
            <MagneticButton
              onClick={onScrollToTop}
              aria-label="Scroll back to top"
              className="w-12 h-12 rounded-full border border-white/20 hover:border-white hover:bg-white hover:text-black flex items-center justify-center transition-all cursor-pointer group shadow-sm"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </MagneticButton>
          )}
        </div>

        {/* CLEAN HORIZONTAL INLINE SOCIAL LINKS (UNBOXED, EDITORIAL) */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-8 gap-y-4 text-xs md:text-sm font-mono text-neutral-400">
            {socialLinks.whatsapp && (
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer py-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp (+8801934885834)</span>
              </a>
            )}

            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer py-1"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                <span>LinkedIn</span>
              </a>
            )}

            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer py-1"
              >
                <Github className="w-3.5 h-3.5 text-white" />
                <span>GitHub</span>
              </a>
            )}

            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer py-1"
              >
                <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                <span>Instagram</span>
              </a>
            )}

            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer py-1"
              >
                <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                <span>Facebook</span>
              </a>
            )}

            {socialLinks.tiktok && (
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer py-1"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#00f2fe]" />
                <span>TikTok</span>
              </a>
            )}

            {socialLinks.email && (
              <a
                href={socialLinks.email}
                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer py-1"
              >
                <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Email</span>
              </a>
            )}
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px] font-mono text-neutral-500">
          <div>
            © {data.copyrightYear || 2026} {heroName.toUpperCase()}. ALL ARCHITECTURAL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-3 tracking-widest uppercase">
            <span>{data.location || 'Dhaka, Bangladesh · Worldwide'}</span>
            <span>•</span>
            <span className="text-[#25D366]">ZERO-TRUST HARDENED</span>
            <span>•</span>
            <span className="text-neutral-400">120 FPS</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
