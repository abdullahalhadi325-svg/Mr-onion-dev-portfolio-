'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ExternalLink, Play, Image as ImageIcon } from 'lucide-react';
import { ProjectItem, siteData, LocaleContent } from '@/lib/siteData';

interface ProjectsProps {
  projects?: ProjectItem[];
  lang?: 'en' | 'bn';
  labels?: LocaleContent['labels'];
}

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1`;
  }
  return null;
}

export default function Projects({
  projects = siteData.en.projects,
  lang = 'en',
  labels = siteData[lang].labels,
}: ProjectsProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [activeStory, setActiveStory] = useState<ProjectItem | null>(null);
  const [mediaMode, setMediaMode] = useState<Record<string, 'video' | 'image'>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      // 1. Headline reveal with rotation and stagger
      const lines = headerRef.current?.querySelectorAll('.projects-reveal-line');
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          { y: '120%', rotate: 2, opacity: 0 },
          {
            y: '0%',
            rotate: 0,
            opacity: 1,
            duration: 1.3,
            ease: 'power4.out',
            stagger: 0.1,
            force3D: true,
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Parallax effect on project images tied strictly to scroll with scrub: 1
      const projectItems = containerRef.current?.querySelectorAll<HTMLElement>('.project-item');
      projectItems?.forEach((item) => {
        const img = item.querySelector<HTMLElement>('.parallax-image');
        const content = item.querySelector<HTMLElement>('.project-content');

        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -12, scale: 1.12 },
            {
              yPercent: 12,
              scale: 1.0,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          );
        }

        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power3.out',
              force3D: true,
              scrollTrigger: {
                trigger: content,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [lang, projects]);

  const toggleMedia = (id: string, currentIsVideo: boolean) => {
    setMediaMode((prev) => ({
      ...prev,
      [id]: currentIsVideo ? 'image' : 'video',
    }));
  };

  return (
    <section
      id="work-section"
      ref={containerRef}
      className="relative z-10 w-full bg-black text-white py-28 md:py-48 px-6 md:px-20 overflow-hidden border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* 1. HEADER AREA */}
        <div ref={headerRef} className="mb-24 md:mb-32">
          {/* Eyebrow */}
          <p className="text-xs tracking-widest text-[#d4af37] mb-8 uppercase flex items-center gap-4 font-mono">
            <span className="w-2 h-2 bg-[#d4af37] inline-block shrink-0"></span>
            {lang === 'bn' ? '০২ / নির্বাচিত কাজ' : '02 / SELECTED ARCHITECTURAL WORKS'}
          </p>

          {/* Massive Headline with Line-Masked Rotation Reveal */}
          <h2 className="text-5xl sm:text-6xl md:text-[5.8vw] lg:text-[5vw] xl:text-[72px] font-serif leading-none tracking-tight text-white max-w-6xl">
            {lang === 'bn' ? (
              <>
                <div className="overflow-hidden">
                  <span className="projects-reveal-line block will-change-transform">
                    ধারণা কেবল শুরু।
                  </span>
                </div>
                <div className="overflow-hidden mt-1 md:mt-2">
                  <span className="projects-reveal-line block italic font-normal will-change-transform">
                    কাজের বাস্তব রূপ এটাই।
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="overflow-hidden">
                  <span className="projects-reveal-line block will-change-transform">
                    Ideas are a start.
                  </span>
                </div>
                <div className="overflow-hidden mt-1 md:mt-2">
                  <span className="projects-reveal-line block italic font-normal will-change-transform">
                    This is the work.
                  </span>
                </div>
              </>
            )}
          </h2>
        </div>

        {/* 2. VERTICAL PROJECT STACK (MASSIVE NEGATIVE SPACE, NO CLUTTERED CARDS) */}
        <div className="space-y-36 md:space-y-64">
          {projects.map((project) => {
            const projectId = project.id || `project-${project.index}`;
            const embedUrl = getYouTubeEmbedUrl(project.youtubeUrl);
            const userPref = mediaMode[projectId];
            const showVideo = Boolean(embedUrl && (userPref === undefined ? true : userPref === 'video'));

            return (
              <article key={projectId} className="project-item flex flex-col w-full">
                
                {/* Media Container: Either Sleek YouTube Iframe or Parallax Image Container */}
                <div className="w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.35/1] overflow-hidden bg-neutral-950 rounded-sm mb-8 relative border border-white/10 group">
                  
                  {showVideo && embedUrl ? (
                    <div className="w-full h-full relative bg-black">
                      <iframe
                        src={embedUrl}
                        title={`${project.title} Video Player`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0 absolute inset-0"
                      />
                    </div>
                  ) : (
                    <>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="parallax-image w-full h-[125%] object-cover object-center absolute inset-0 -top-[12%] will-change-transform"
                        style={{ willChange: 'transform' }}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.endsWith('.svg')) {
                            target.src = `/project${project.index.replace(/^0/, '').replace(/^০/, '1')}.svg`;
                          }
                        }}
                      />
                      
                      {/* Dark cinematic vignette overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 pointer-events-none"></div>
                    </>
                  )}

                  {/* Top Left: Category Tag */}
                  <div className="absolute top-6 left-6 z-10 pointer-events-none">
                    <span className="text-[11px] font-mono tracking-widest uppercase text-white/90 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10">
                      {project.tag}
                    </span>
                  </div>

                  {/* Top Right: Video / Image Toggle if both are available */}
                  {embedUrl && (
                    <div className="absolute top-6 right-6 z-10">
                      <button
                        onClick={() => toggleMedia(projectId, showVideo)}
                        className="flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase text-white bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/20 hover:border-white transition-colors cursor-pointer"
                      >
                        {showVideo ? (
                          <>
                            <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>View Photo</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                            <span>Play Video</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                </div>

                {/* Project Content Below Image */}
                <div className="project-content flex flex-col md:flex-row md:items-start justify-between gap-8 pt-4">
                  
                  {/* Left: Index, Title & Description */}
                  <div className="max-w-3xl">
                    <span className="text-xs font-mono text-[#d4af37] tracking-widest block mb-2">
                      {project.index}
                    </span>
                    
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-serif text-white tracking-tight leading-tight">
                      {project.title}
                    </h3>

                    <p className="text-neutral-400 max-w-2xl mt-4 text-base md:text-lg leading-relaxed font-sans">
                      {project.description}
                    </p>

                    {/* 3-Part Framework Highlights (Problem -> Solution -> Benefit) */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs">
                      <div>
                        <span className="text-[#d4af37] font-mono block mb-1">01. {labels.problem}</span>
                        <p className="text-neutral-400 line-clamp-3 leading-relaxed">{project.problem}</p>
                      </div>
                      <div>
                        <span className="text-neutral-300 font-mono block mb-1">02. {labels.solution}</span>
                        <p className="text-neutral-400 line-clamp-3 leading-relaxed">{project.solution}</p>
                      </div>
                      <div>
                        <span className="text-white font-mono block mb-1">03. {labels.benefit}</span>
                        <p className="text-neutral-400 line-clamp-3 leading-relaxed">{project.benefit}</p>
                      </div>
                    </div>

                    {/* Actions Row: View Live Site Button (ONLY when liveUrl exists) + Case Study Modal */}
                    <div className="mt-8 flex flex-wrap items-center gap-5">
                      
                      {/* CONDITIONAL "View Live Site ↗" BUTTON */}
                      {Boolean(project.liveUrl && project.liveUrl.trim().length > 0) && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-mono tracking-wider uppercase font-semibold transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)] active:scale-95"
                        >
                          <span>{labels.viewLiveSite || 'View Live Site ↗'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {/* Explore Deep Case Study */}
                      <button
                        onClick={() => setActiveStory(project)}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-neutral-300 hover:text-white border-b border-white/30 hover:border-white pb-1 transition-colors cursor-pointer"
                      >
                        <span>{labels.exploreStory}</span>
                        <span className="text-sm">↗</span>
                      </button>

                    </div>
                  </div>

                  {/* Right: Key metrics summary */}
                  <div className="shrink-0 flex md:flex-col gap-6 md:gap-4 md:border-l md:border-white/10 md:pl-8 text-left">
                    {project.metrics.map((metric, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-2xl md:text-3xl font-light font-sans text-white tabular-nums">
                          {metric.value}
                        </span>
                        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mt-0.5">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>

              </article>
            );
          })}
        </div>

      </div>

      {/* 3. CASE STUDY STORY MODAL */}
      {activeStory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl overflow-y-auto flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300"
        >
          <div className="relative w-full max-w-4xl bg-neutral-950 border border-white/15 rounded-sm p-8 md:p-16 my-auto text-white">
            
            {/* Top Close Button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#d4af37] tracking-widest">
                  {`CASE STUDY · ${activeStory.index}`}
                </span>
                <span className="text-xs text-neutral-500">•</span>
                <span className="text-xs text-neutral-400">{activeStory.subtitle}</span>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                aria-label={labels.close}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 text-xs text-neutral-300 hover:text-white hover:border-white transition-colors cursor-pointer"
              >
                <span>{labels.close}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Video Player in Modal if youtubeUrl is present */}
            {getYouTubeEmbedUrl(activeStory.youtubeUrl) && (
              <div className="w-full aspect-video rounded-sm overflow-hidden mb-8 border border-white/10">
                <iframe
                  src={getYouTubeEmbedUrl(activeStory.youtubeUrl)!}
                  title={`${activeStory.title} Modal Video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            )}

            {/* Title & Overview */}
            <h3 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
              {activeStory.title}
            </h3>
            <p className="text-neutral-300 text-base md:text-lg mt-4 leading-relaxed font-sans">
              {activeStory.description}
            </p>

            {/* Full 3-Part Framework Breakdown */}
            <div className="mt-12 space-y-8 border-t border-b border-white/10 py-10">
              
              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="w-36 shrink-0 text-xs font-mono text-[#d4af37] tracking-widest uppercase">
                  [ {labels.problem} ]
                </div>
                <div className="text-neutral-300 text-sm md:text-base leading-relaxed">
                  {activeStory.problem}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="w-36 shrink-0 text-xs font-mono text-neutral-300 tracking-widest uppercase">
                  [ {labels.solution} ]
                </div>
                <div className="text-neutral-300 text-sm md:text-base leading-relaxed">
                  {activeStory.solution}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="w-36 shrink-0 text-xs font-mono text-white tracking-widest uppercase">
                  [ {labels.benefit} ]
                </div>
                <div className="text-neutral-300 text-sm md:text-base leading-relaxed">
                  {activeStory.benefit}
                </div>
              </div>

            </div>

            {/* Metrics & Tech Stack */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase block mb-3">
                  {labels.verifiedMetrics}
                </span>
                <div className="grid grid-cols-3 gap-4">
                  {activeStory.metrics.map((m, idx) => (
                    <div key={idx} className="p-3 bg-neutral-900 border border-white/5 rounded-sm">
                      <div className="text-lg md:text-xl font-light text-white font-sans tabular-nums">{m.value}</div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase block mb-3">
                  {labels.productionStack}
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeStory.stack.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-mono text-neutral-300 bg-neutral-900 border border-white/10 rounded-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Row */}
            <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                {Boolean(activeStory.liveUrl && activeStory.liveUrl.trim().length > 0) && (
                  <a
                    href={activeStory.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-mono uppercase tracking-wider font-semibold hover:bg-neutral-200 transition-colors"
                  >
                    <span>{labels.viewLiveSite || 'View Live Site ↗'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                
                {activeStory.link && (
                  <a
                    href={activeStory.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#d4af37] hover:underline"
                  >
                    {labels.discussWhatsApp}
                  </a>
                )}
              </div>

              <button
                onClick={() => setActiveStory(null)}
                className="px-6 py-2.5 bg-neutral-900 text-white border border-white/20 font-medium text-xs tracking-wider uppercase rounded-full hover:bg-neutral-800 transition-colors cursor-pointer ml-auto"
              >
                {labels.backToWorks}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
