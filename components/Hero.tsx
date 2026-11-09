'use client';

import React from 'react';
import { LinkedinLogo, GithubLogo, WhatsappLogo, EnvelopeSimple, InstagramLogo, FacebookLogo } from '@phosphor-icons/react';
import { HeroData, SocialLinks, siteData } from '@/lib/siteData';
import { MagneticButton, MagneticAnchor } from '@/components/MagneticButton';
import { motion } from 'framer-motion';

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

  const handleExploreClick = () => {
    const targetSection = document.getElementById(data.ctaPrimary.targetId || 'work-section');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.95, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 text-center bg-[#000000] select-none z-10">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center w-full max-w-[680px] mx-auto"
      >
        
        {/* Scarcity badge */}
        {data.scarcityBadge && data.scarcityBadge.visible && (
          <div className="mb-spacing-400 inline-flex items-center gap-spacing-100 px-spacing-100 py-spacing-75 rounded-full bg-[#181818]/60 backdrop-blur-md border border-[#313131]">
            <motion.div
              className={`relative flex h-2 w-2 rounded-full ${data.scarcityBadge.status === 'available' ? 'bg-white' : 'bg-[#9B9B9B]'}`}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <span className="caption-1 text-[#9B9B9B]">
              {data.scarcityBadge.text}
            </span>
          </div>
        )}

        {/* Eyebrow */}
        <p className="caption-1 text-[#9B9B9B] mb-spacing-200 uppercase tracking-normal">
          {data.eyebrow}
        </p>

        {/* Headline */}
        <h1 className="heading-1 text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#9B9B9B] text-balance mb-spacing-300">
          {data.headlinePrimary}
        </h1>

        {/* Subheadline */}
        <p className="title-2 text-[#9B9B9B] text-pretty max-w-[680px] mb-spacing-600">
          {data.subheadline}
        </p>

        {/* Primary CTA and Secondary */}
        <div className="flex flex-col sm:flex-row items-center gap-spacing-200">
          <MagneticButton
            onClick={handleExploreClick}
            className="button-md px-spacing-100 py-spacing-75 rounded-lg bg-[#181818]/60 backdrop-blur-md text-white hover:bg-[#272727]/80 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-98 flex items-center gap-spacing-100 cursor-pointer border border-[#313131]"
          >
            <span>{data.ctaPrimary.label}</span>
          </MagneticButton>

          <MagneticAnchor
            href={data.ctaSecondary.url || socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="button-md px-spacing-100 py-spacing-75 rounded-lg text-[#9B9B9B] hover:text-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-98 flex items-center gap-spacing-100 cursor-pointer"
          >
            <span>{data.ctaSecondary.label}</span>
          </MagneticAnchor>
        </div>

        {/* Social Proof / Icons */}
        <div className="mt-spacing-700 flex gap-spacing-300 items-center text-[#9B9B9B]">
          {socialLinks.whatsapp && (
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Direct WhatsApp Message"
              className="min-w-11 min-h-11 flex items-center justify-center p-spacing-100 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-white"
            >
              <WhatsappLogo weight="regular" className="w-5 h-5 cursor-pointer" />
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="min-w-11 min-h-11 flex items-center justify-center p-spacing-100 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-white"
            >
              <LinkedinLogo weight="regular" className="w-5 h-5 cursor-pointer" />
            </a>
          )}
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="min-w-11 min-h-11 flex items-center justify-center p-spacing-100 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-white"
            >
              <GithubLogo weight="regular" className="w-5 h-5 cursor-pointer" />
            </a>
          )}
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              className="min-w-11 min-h-11 flex items-center justify-center p-spacing-100 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-white"
            >
              <InstagramLogo weight="regular" className="w-5 h-5 cursor-pointer" />
            </a>
          )}
          {socialLinks.facebook && (
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Profile"
              className="min-w-11 min-h-11 flex items-center justify-center p-spacing-100 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-white"
            >
              <FacebookLogo weight="regular" className="w-5 h-5 cursor-pointer" />
            </a>
          )}
          {socialLinks.email && (
            <a
              href={socialLinks.email}
              aria-label="Direct Email"
              className="min-w-11 min-h-11 flex items-center justify-center p-spacing-100 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-white"
            >
              <EnvelopeSimple weight="regular" className="w-5 h-5 cursor-pointer" />
            </a>
          )}
        </div>
      </motion.div>
    </section>
  );
}
