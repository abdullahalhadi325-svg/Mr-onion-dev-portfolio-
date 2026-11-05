'use client';

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import { siteData } from '@/lib/siteData';

export default function Page() {
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [contentStore, setContentStore] = useState(siteData);
  const lenisRef = useRef<any>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const heroImageRef = useRef<HTMLImageElement | null>(null);

  // Initialize GSAP plugins in client environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      gsap.defaults({ force3D: true });
    }
  }, []);

  // Load dynamically updated CMS content
  useEffect(() => {
    let isMounted = true;
    fetch('/api/content')
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && json.data) {
          setContentStore({
            en: json.data.en || siteData.en,
            bn: json.data.bn || siteData.bn,
          });
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const currentData = contentStore[lang] || siteData[lang];

  // Initialize smooth scrolling synchronized with GSAP ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lenisInstance: any = null;
    let tickerCallback: any = null;

    import('lenis')
      .then(({ default: Lenis }) => {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
        });

        lenisRef.current = lenis;
        lenisInstance = lenis;

        lenis.on('scroll', ScrollTrigger.update);

        tickerCallback = (time: number) => {
          lenis.raf(time * 1000);
        };

        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);
      })
      .catch(() => {
        // Fallback to native smooth scrolling
      });

    return () => {
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
      }
      lenisRef.current = null;
    };
  }, []);

  // Subtle zoom/fade on the fixed hero image during initial load
  useEffect(() => {
    if (heroImageRef.current) {
      gsap.fromTo(
        heroImageRef.current,
        { scale: 1.06, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out', force3D: true }
      );
    }
  }, []);

  // Experience timeline scroll animation with force3D for 120fps
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (experienceRef.current) {
        const rows = experienceRef.current.querySelectorAll('.experience-row');
        if (rows.length > 0) {
          gsap.fromTo(
            rows,
            { y: 35, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              stagger: 0.18,
              ease: 'power3.out',
              force3D: true,
              scrollTrigger: {
                trigger: experienceRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }
    }, experienceRef);

    return () => ctx.revert();
  }, [lang]);

  const scrollToTop = () => {
    if (lenisRef.current && typeof lenisRef.current.scrollTo === 'function') {
      lenisRef.current.scrollTo(0, { duration: 1.5 });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* 1. Global Custom Cursor for Fine Pointer Devices */}
      <CustomCursor />

      {/* 2. Raw 35mm Film Grain / Noise Overlay (Subtle 3% Opacity for Editorial Texture) */}
      <div 
        aria-hidden="true" 
        className="fixed inset-0 pointer-events-none z-30 opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3. Auto-Hide Navbar with Integrated Non-Overlapping Language Toggle */}
      <Navbar lang={lang} onToggleLang={toggleLanguage} data={currentData} />

      {/* 
        4. THE "SCROLL-OVER" HERO IMAGE (Fixed Background Layer):
        The image stays completely fixed at z-0 while the text and all subsequent black sections scroll OVER it.
      */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none overflow-hidden">
        <Image
          ref={heroImageRef}
          src={currentData.hero.image || '/hero.png'}
          alt={currentData.hero.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top will-change-transform"
          style={{ willChange: 'transform, opacity' }}
        />
        {/* Adjusted Gradient Mask: Face and upper body remain crisp and brightly visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 via-70% to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)] pointer-events-none"></div>
      </div>

      {/* 
        5. FOREGROUND CONTENT LAYER:
        Wrapped in relative z-10 w-full bg-transparent.
        Hero text is transparent, then all sections below are bg-black, sliding OVER the fixed portrait.
      */}
      <div className="relative z-10 w-full bg-transparent">
        
        {/* Transparent Hero Foreground Content */}
        <Hero
          data={currentData.hero}
          socialLinks={currentData.socialLinks}
          lang={lang}
        />

        {/* Subsequent Sections (Solid bg-black slides elegantly OVER the fixed hero image) */}
        <div className="relative z-20 bg-black shadow-[0_-30px_60px_rgba(0,0,0,1)]">
          
          {/* About Section */}
          <About data={currentData.about} lang={lang} />

          {/* Projects Section with Parallax */}
          <Projects
            projects={currentData.projects}
            lang={lang}
            labels={currentData.labels}
          />

          {/* Experience Timeline Section */}
          <section
            id="experience-section"
            ref={experienceRef}
            className="relative z-10 w-full bg-black py-28 md:py-48 px-6 md:px-20 border-t border-white/10"
          >
            <div className="max-w-7xl mx-auto">
              <p className="text-xs tracking-widest text-[#d4af37] mb-8 uppercase flex items-center gap-4 font-mono">
                <span className="w-2 h-2 bg-[#d4af37] inline-block shrink-0"></span>
                {lang === 'bn' ? '০৩ / পরিক্রমা ও ভিত্তি' : '03 / THE JOURNEY & FOUNDATIONS'}
              </p>

              <h2 className="text-4xl md:text-[5vw] font-serif leading-none tracking-tight text-white max-w-4xl mb-20">
                {lang === 'bn' ? (
                  <>
                    শুরুর কোডিং ভিত্তি থেকে। <br />
                    <span className="italic font-normal">উচ্চ-প্রভাবশালী সিস্টেম পর্যন্ত।</span>
                  </>
                ) : (
                  <>
                    From foundational code. <br />
                    <span className="italic font-normal">To high-leverage systems.</span>
                  </>
                )}
              </h2>

              <div className="border-t border-white/10 divide-y divide-white/10">
                {(currentData.experience || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="experience-row py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline group hover:bg-white/[0.02] transition-colors px-4 rounded-sm will-change-transform"
                  >
                    <div className="md:col-span-2 text-xs font-mono text-[#d4af37] tracking-wider">
                      {item.year}
                    </div>
                    <div className="md:col-span-4 text-xl md:text-2xl font-serif text-white group-hover:translate-x-1 transition-transform duration-200">
                      {item.title}
                    </div>
                    <div className="md:col-span-6 text-sm text-neutral-400 font-sans leading-relaxed">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Minimalist Editorial Footer (Zero Boxes, Inline Socials, Magnetic Actions) */}
          <Footer
            data={currentData.footer}
            socialLinks={currentData.socialLinks}
            heroName={currentData.hero.name}
            lang={lang}
            onScrollToTop={scrollToTop}
          />

        </div>

      </div>

    </main>
  );
}
