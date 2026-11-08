'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Terminal, Cpu, CheckCircle } from 'lucide-react';
import { AboutData, siteData } from '@/lib/siteData';

interface AboutProps {
  data?: AboutData;
  lang?: 'en' | 'bn';
}

export default function About({ data = siteData.en.about, lang = 'en' }: AboutProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const quoteRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const statementRef = useRef<HTMLHeadingElement | null>(null);
  const bioRef = useRef<HTMLParagraphElement | null>(null);
  const skillsRef = useRef<HTMLDivElement | null>(null);
  const cyberRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      // 1. Massive stats row fade in and slide up
      const statItems = statsRef.current?.querySelectorAll('.stat-item');
      if (statItems && statItems.length > 0) {
        gsap.fromTo(
          statItems,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.16,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Core Identity Quote reveal
      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.25,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: quoteRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 3. Eyebrow entrance
      if (eyebrowRef.current) {
        gsap.fromTo(
          eyebrowRef.current,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: eyebrowRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 4. Editorial statement reveal
      const statementLines = statementRef.current?.querySelectorAll('.about-reveal-line');
      if (statementLines && statementLines.length > 0) {
        gsap.fromTo(
          statementLines,
          { y: '120%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 1.35,
            stagger: 0.1,
            ease: 'power4.out',
            force3D: true,
            scrollTrigger: {
              trigger: statementRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 5. Bio paragraph fade in
      if (bioRef.current) {
        gsap.fromTo(
          bioRef.current,
          { opacity: 0, y: 35 },
          {
            y: 0,
            opacity: 1,
            duration: 1.15,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: bioRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 6. Skills & Systems grid reveal
      if (skillsRef.current) {
        gsap.fromTo(
          skillsRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: skillsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 7. Cyber Security section reveal
      if (cyberRef.current) {
        gsap.fromTo(
          cyberRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: cyberRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [lang]);

  const isBn = lang === 'bn';

  return (
    <section
      id="about-section"
      ref={containerRef}
      className="relative z-10 w-full bg-black text-white py-28 md:py-48 px-6 md:px-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* 1. MASSIVE STATS ROW */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-8 border-b border-white/10 pb-20 md:pb-32"
        >
          {(data.stats || []).map((stat, idx) => (
            <div key={idx} className="stat-item flex flex-col items-start opacity-0 will-change-transform">
              <span className={`text-6xl sm:text-7xl md:text-8xl lg:text-[7vw] xl:text-[6.5vw] 2xl:text-[100px] font-light leading-none tracking-tight ${isBn ? "font-['Hind_Siliguri']" : 'font-sans'}`}>
                {stat.value}
              </span>
              <span className={`text-xs md:text-sm text-neutral-400 tracking-[0.2em] mt-4 md:mt-6 uppercase font-mono ${isBn ? "font-['Hind_Siliguri'] tracking-normal" : ''}`}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* 2. MASSIVE CORE IDENTITY QUOTE BLOCK: "I am a Vibe Coder..." */}
        <div
          ref={quoteRef}
          className="mt-28 md:mt-40 pt-16 pb-20 border-b border-white/10 relative"
        >
          <div className="flex items-start gap-6 md:gap-8">
            <span className="text-[#d4af37] font-serif text-5xl md:text-7xl leading-none select-none opacity-60 shrink-0">
              “
            </span>
            <div className="space-y-6 max-w-5xl">
              <blockquote
                className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15] font-light text-white tracking-tight ${
                  isBn ? "font-['Tiro_Bangla']" : 'font-serif'
                }`}
              >
                {data.quote || 'I am a Vibe Coder. I code with AI. I am not a traditional coder, I am a System Architect.'}
              </blockquote>
              <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 uppercase tracking-widest pt-2">
                <span className="w-8 h-[1px] bg-[#d4af37]"></span>
                <span className="text-white font-medium">{data.quoteAuthor || 'Abdullah Al Hadi'}</span>
                <span className="text-neutral-500">/</span>
                <span className="text-[#d4af37]">VIBE CODER & SYSTEM ARCHITECT</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. EDITORIAL BIO STATEMENT */}
        <div className="mt-28 md:mt-36">
          {/* Eyebrow */}
          <p
            ref={eyebrowRef}
            className={`text-xs md:text-sm tracking-[0.25em] text-[#d4af37] mb-8 uppercase flex items-center gap-4 opacity-0 will-change-transform font-mono ${isBn ? "font-['Hind_Siliguri'] tracking-widest" : ''}`}
          >
            <span className="w-2 h-2 bg-[#d4af37] inline-block shrink-0"></span>
            {data.eyebrow}
          </p>

          {/* Massive Statement with overflow hidden reveal */}
          <h2
            ref={statementRef}
            className={`max-w-6xl leading-[1.05] tracking-tight text-white ${
              isBn
                ? "font-['Tiro_Bangla'] text-4xl sm:text-5xl md:text-[5vw] lg:text-[4.5vw] xl:text-[62px] font-normal"
                : 'font-serif text-5xl sm:text-6xl md:text-[5.8vw] lg:text-[5vw] xl:text-[72px] font-light'
            }`}
          >
            <div className="overflow-hidden">
              <span className="about-reveal-line block will-change-transform">
                {data.headlinePrimary}
              </span>
            </div>
            <div className="overflow-hidden mt-1 md:mt-3">
              <span className={`about-reveal-line block will-change-transform ${isBn ? 'not-italic font-normal' : 'italic font-light'}`}>
                {data.headlineSecondary}
              </span>
            </div>
          </h2>

          {/* Clean Bio Paragraph */}
          <p
            ref={bioRef}
            className={`mt-12 md:mt-16 max-w-4xl leading-relaxed opacity-0 will-change-transform ${
              isBn ? "font-['Hind_Siliguri'] text-lg md:text-xl lg:text-2xl text-neutral-300" : 'font-sans text-lg md:text-xl lg:text-2xl text-neutral-300'
            }`}
          >
            {data.bio}
          </p>

          {/* Chris Do / Un-selling Aggressive Copy Block */}
          <div className="mt-12 md:mt-16 p-8 border-l-2 border-[#d4af37] bg-neutral-900/50 backdrop-blur-sm">
            <p className={`text-base md:text-lg lg:text-xl font-medium tracking-wide text-neutral-200 leading-relaxed ${isBn ? "font-['Hind_Siliguri']" : 'font-sans'}`}>
              {data.unsellingCopy || (isBn
                ? "আমার ন্যূনতম এঙ্গেজমেন্ট অনেক বেশি কারণ আমি যে আরওআই (ROI) প্রদান করি তা বহুগুণ। আপনি যদি সিরিয়াস আর্কিটেকচারে ইনভেস্ট করতে প্রস্তুত না হন, তবে এই ট্যাবটি বন্ধ করুন।"
                : "My minimum engagement starts high because the ROI I deliver is exponential. If you're not ready to invest in serious architecture, close this tab.")}
            </p>
          </div>
        </div>

        {/* 4. TECH STACK & PRODUCTION SYSTEMS ENGINEERED (ZERO PILL METADATA) */}
        <div ref={skillsRef} className="mt-28 md:mt-40 border-t border-white/10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left: Core Tech Stack */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Terminal className="w-4 h-4 text-[#d4af37]" />
                <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-[#d4af37]">
                  {isBn ? 'মূল টেক স্ট্যাক ও স্কিলস' : 'CORE ENGINEERING STACK'}
                </h3>
              </div>
              
              <div className="space-y-4">
                {(data.skills || []).map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 border-b border-white/5 text-neutral-200 group hover:text-white transition-colors"
                  >
                    <span className="text-base md:text-lg font-light tracking-tight">{skill}</span>
                    <span className="text-xs font-mono text-neutral-500 tracking-wider">
                      0{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Systems Built */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Cpu className="w-4 h-4 text-[#d4af37]" />
                <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-[#d4af37]">
                  {isBn ? 'নির্মিত বাস্তব সিস্টেমসমূহ' : 'PRODUCTION SYSTEMS ARCHITECTED'}
                </h3>
              </div>

              <div className="space-y-4">
                {(data.systemsBuilt || []).map((system, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 border-b border-white/5 text-neutral-200 group hover:text-white transition-colors"
                  >
                    <span className="text-base md:text-lg font-light tracking-tight">{system}</span>
                    <span className="text-xs font-mono text-[#d4af37] tracking-wider">
                      PROD · VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 5. CYBER SECURITY & ETHICAL HACKING ARCHITECTURE */}
        {data.cyberSecurity && (
          <div ref={cyberRef} className="mt-28 md:mt-36 p-8 md:p-14 bg-neutral-950 border border-white/10 rounded-sm">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-10 border-b border-white/10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-5 h-5 text-[#25D366]" />
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#25D366]">
                    {data.cyberSecurity.subtitle}
                  </span>
                </div>
                <h3 className={`text-2xl sm:text-3xl md:text-4xl font-light text-white tracking-tight ${isBn ? "font-['Tiro_Bangla']" : 'font-serif'}`}>
                  {data.cyberSecurity.title}
                </h3>
                <p className="mt-4 text-sm md:text-base text-neutral-400 font-sans leading-relaxed">
                  {data.cyberSecurity.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <div className="px-4 py-3 bg-black border border-white/10 rounded-sm text-xs font-mono text-neutral-300 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                  <span>WHITE HAT: HARDENED DEFENSE</span>
                </div>
                <div className="px-4 py-3 bg-black border border-white/10 rounded-sm text-xs font-mono text-neutral-300 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span>BLACK HAT: THREAT RECONNAISSANCE</span>
                </div>
              </div>
            </div>

            {/* Security Domains List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              {(data.cyberSecurity.domains || []).map((domain, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-neutral-300 font-mono leading-relaxed">
                    {domain}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
