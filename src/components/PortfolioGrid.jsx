import { useState, useEffect, useRef } from 'react';
import VideoCard from './VideoCard';

export default function PortfolioGrid({ projects, onSelectProject }) {
  // Filter for active/published reel projects
  const reelProjects = projects.filter(p => p.is_published);
  
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Once visible, we don't need to observe anymore
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Ensure we get exactly 4 slots (filled with project data or placeholders)
  const slots = [
    reelProjects[0] || null,
    reelProjects[1] || null,
    reelProjects[2] || null,
    reelProjects[3] || null
  ];

  const renderSlot = (project, index, colSpanClass = "col-span-1") => {
    const delay = index * 150;
    
    if (project) {
      return (
        <div 
          key={project.id || `slot-${index}`}
          style={{ transitionDelay: `${delay}ms` }}
          className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) h-full ${colSpanClass} ${
            isVisible ? 'opacity-100 translate-x-0 blur-0' : 'opacity-0 -translate-x-12 blur-md'
          }`}
        >
          <VideoCard 
            project={project} 
            onClick={onSelectProject} 
          />
        </div>
      );
    } else {
      return (
        <div 
          key={`placeholder-${index}`}
          style={{ 
            transitionDelay: `${delay}ms`,
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px dashed rgba(255, 255, 255, 0.1)' 
          }}
          className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) h-full min-h-[320px] glass-card rounded-2xl flex flex-col justify-center items-center p-6 text-center select-none ${colSpanClass} ${
            isVisible ? 'opacity-100 translate-x-0 blur-0' : 'opacity-0 -translate-x-12 blur-md'
          }`}
        >
          <span className="material-symbols-outlined text-white/10 text-3xl mb-3">video_library</span>
          <span className="font-display-lg text-xs font-bold text-white/30 tracking-widest uppercase">Reel Coming Soon</span>
        </div>
      );
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="work" 
      className="py-24 px-6 md:px-20 max-w-7xl mx-auto scroll-mt-16 overflow-hidden"
    >
      {/* Grid Header */}
      <div className="mb-12">
        <span className="font-label-caps text-primary text-xs tracking-wider mb-2 block font-bold">SHOWCASE</span>
        <h3 className="font-headline-lg text-3xl md:text-5xl font-bold text-white">Visual Reels Experience</h3>
      </div>

      {/* Structured Grid Layout (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-stretch">
        
        {/* Row 1, Col 1 & 2: Reels 1 & 2 */}
        {renderSlot(slots[0], 0, "col-span-1")}
        {renderSlot(slots[1], 1, "col-span-1")}

        {/* Column 3: Blurry Giant Character Card (Spans 1 col, 2 rows) */}
        <div 
          className={`col-span-1 sm:col-span-2 md:col-span-1 md:row-span-2 flex flex-col justify-end items-center min-h-[380px] md:min-h-full relative transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) overflow-hidden ${
            isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-16 blur-lg'
          }`}
          style={{ background: 'transparent', border: 'none' }}
        >
          {/* Centered Speech Bubble */}
          <div className="absolute top-6 md:top-6 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-display-lg font-bold text-[9px] md:text-[10px] tracking-[0.2em] px-4 py-2 rounded-full shadow-xl shadow-primary/20 animate-pulse select-none uppercase z-20 whitespace-nowrap">
            MY WORK || ⚡
          </div>

          {/* Blurred Background Character Image */}
          <img 
            alt="Showcase character portrait of Kshitiz" 
            className="absolute inset-0 w-full h-full object-cover object-center select-none filter blur-md brightness-[0.75] opacity-60 scale-110 pointer-events-none"
            src="/hero-character-sticker.png"
          />
        </div>

        {/* Column 4: Experience Details Card (Spans 1 col, 2 rows) */}
        <div 
          className={`col-span-1 sm:col-span-2 md:col-span-1 md:row-span-2 p-6 md:p-8 flex flex-col justify-center min-h-[380px] md:min-h-full relative transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) overflow-hidden ${
            isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-16 blur-lg'
          }`}
          style={{ background: 'transparent', border: 'none' }}
        >
          <div className="relative z-10 flex flex-col gap-6 text-left">
            <div>
              <h4 className="font-display-lg text-2xl md:text-3xl font-bold text-white tracking-wider uppercase mb-2">My Experience</h4>
              <p className="font-body-md text-xs md:text-sm font-bold text-primary tracking-wide uppercase">Experienced Motion Graphics & Visual Artist</p>
            </div>

            <ul className="flex flex-col gap-4 text-xs md:text-sm text-white/70 leading-relaxed list-disc pl-4 marker:text-primary">
              <li>Specialized in dynamic athletic narratives and high-end brand cuts.</li>
              <li>Expert in complex 3D fluid simulations and abstract procedural visual design.</li>
              <li>Proven ability to translate complex creative briefs into compelling visuals.</li>
              <li className="text-white/40 italic">(Additional experience details can be added here... for future editing)</li>
            </ul>
          </div>
          
          {/* Decorative Sparkle star in the bottom right corner */}
          <div className="absolute bottom-6 right-6 text-white/10 select-none animate-pulse">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
          </div>
        </div>

        {/* Row 2, Col 1 & 2: Reels 3 & 4 */}
        {renderSlot(slots[2], 2, "col-span-1")}
        {renderSlot(slots[3], 3, "col-span-1")}

      </div>
    </section>
  );
}
