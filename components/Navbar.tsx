'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, MessageCircle } from 'lucide-react';
import { siteData, LocaleContent } from '@/lib/siteData';

interface NavbarProps {
  lang?: 'en' | 'bn';
  onToggleLang?: () => void;
  data?: LocaleContent;
}

export default function Navbar({ lang = 'en', onToggleLang, data }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const content = data || siteData[lang];

  // Auto-hide deck on scroll down, reveal on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { label: content.labels.work, href: '#work-section' },
    { label: content.labels.about, href: '#about-section' },
    { label: content.labels.experience, href: '#experience-section' },
    { label: content.labels.contact, href: '#contact-section' },
  ];

  return (
    <>
      {/* 
        THE FLOATING "DECK" NAVBAR (Premium Glassmorphism)
        Exact requested container code with smooth auto-hide transition 
      */}
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-6xl z-50 flex items-center justify-between px-6 py-3 md:py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-300 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        {/* Left: Brand Name */}
        <div className="flex items-center">
          <a
            href="#"
            className={`text-sm font-medium tracking-tight text-white hover:opacity-80 transition-opacity whitespace-nowrap ${
              lang === 'bn' ? "font-['Tiro_Bangla'] text-base" : 'font-sans'
            }`}
          >
            {content.hero.name}
          </a>
        </div>

        {/* Center: Hide on mobile */}
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 font-mono tracking-widest uppercase">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
          <span>{content.hero.role}</span>
        </div>

        {/* Right: Flex container with [ EN / BN ] toggle and Menu button side-by-side (NO OVERLAP) */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Language Switcher */}
          {onToggleLang && (
            <button
              onClick={onToggleLang}
              aria-label="Toggle language between English and Bangla"
              className="px-3 py-1 rounded-full border border-white/15 bg-white/5 hover:border-white/40 text-xs font-mono tracking-wider text-white transition-all cursor-pointer active:scale-95 flex items-center gap-1 shadow-sm"
            >
              <span className={lang === 'en' ? 'text-white font-bold' : 'text-gray-400'}>EN</span>
              <span className="text-gray-500">/</span>
              <span className={lang === 'bn' ? 'text-white font-bold' : 'text-gray-400'}>BN</span>
            </button>
          )}

          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            aria-label={isOpen ? content.labels.close : content.labels.menu}
            className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/5 hover:border-white/40 text-xs text-neutral-200 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <span className={lang === 'bn' ? "font-['Hind_Siliguri']" : 'font-sans'}>
              {isOpen ? content.labels.close : content.labels.menu}
            </span>
            {isOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Fullscreen Overlay Menu (Replicating reference video) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-6 md:p-16 animate-in fade-in duration-300">
          {/* Top row in menu */}
          <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
            <span
              className={`text-base font-medium tracking-tight text-white ${
                lang === 'bn' ? "font-['Tiro_Bangla'] text-lg" : 'font-serif'
              }`}
            >
              {content.hero.name}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-xs text-neutral-200 hover:text-white hover:border-white/50 transition-all cursor-pointer"
            >
              <span>{content.labels.close}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Central Nav Links */}
          <nav className="flex flex-col gap-6 md:gap-8 my-auto max-w-6xl mx-auto w-full">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between text-4xl md:text-6xl font-light text-neutral-300 hover:text-white hover:translate-x-2 transition-all duration-200 ${
                  lang === 'bn' ? "font-['Tiro_Bangla']" : 'font-serif'
                }`}
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 opacity-40 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}

            <div className="pt-6">
              <a
                href={content.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all text-sm font-medium"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span className={lang === 'bn' ? "font-['Hind_Siliguri']" : 'font-sans'}>
                  {lang === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি কথা বলুন' : "Let's talk on WhatsApp"}
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </nav>

          {/* Footer note & social links */}
          <div className="border-t border-neutral-900 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-neutral-500 font-mono max-w-6xl mx-auto w-full">
            <p className={lang === 'bn' ? "font-['Hind_Siliguri'] text-sm" : ''}>
              {content.hero.subheadline}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={content.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
              <a href={content.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <a href={content.socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
              <a href={content.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <a href={content.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
              <a href={content.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TikTok</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
