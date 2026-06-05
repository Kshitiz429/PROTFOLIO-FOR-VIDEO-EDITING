import { useEffect, useRef, useState } from 'react';

const REELS = [
  {
    title: 'Motion Graphics 01',
    video_url: 'https://mkawnzhhmksfhjxcofws.supabase.co/storage/v1/object/sign/videos/0604.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNDYzNjZmYy05ZDY5LTRkMjItYmExZC01ZjhlYzM2ZjgyZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvMDYwNC5tcDQiLCJpYXQiOjE3ODA2ODI1NjEsImV4cCI6MTgxMjIxODU2MX0.U5yMnpMNjDaulouczlZGyw6Q4C_SvKEiitUE3p6yX9E'
  },
  {
    title: 'Motion Graphics 02',
    video_url: 'https://mkawnzhhmksfhjxcofws.supabase.co/storage/v1/object/sign/videos/PROTFOLIO-01.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNDYzNjZmYy05ZDY5LTRkMjItYmExZC01ZjhlYzM2ZjgyZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvUFJPVEZPTElPLTAxLm1wNCIsImlhdCI6MTc4MDY4MjU3NiwiZXhwIjoxODEyMjE4NTc2fQ.5YK4Jpd92sBfaspX_ZwviXwNVIPdgvXqgmJhYMZ-G54'
  },
  {
    title: 'Motion Graphics 03',
    video_url: 'https://mkawnzhhmksfhjxcofws.supabase.co/storage/v1/object/sign/videos/storytelling.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNDYzNjZmYy05ZDY5LTRkMjItYmExZC01ZjhlYzM2ZjgyZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3Mvc3Rvcnl0ZWxsaW5nLm1wNCIsImlhdCI6MTc4MDY4MjU4NSwiZXhwIjoxODEyMjE4NTg1fQ.phNe9Xyt8ApYqTFgkh5FZtY_ZqC3zlGIiFry1oOuLrw'
  }
];

export default function HeroSection({ onPlayShowreel, hasInteracted }) {
  const heroRef = useRef(null);
  const bgTextRef = useRef(null);
  const blocksRef = useRef([]);
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!bgTextRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 25;
      const y = (e.clientY / window.innerHeight - 0.5) * 25;
      bgTextRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const height = window.innerHeight;
      const ratio = Math.min(1, scrollY / height);

      // Smooth zoom out, blur, and fade out
      const scale = 1 - ratio * 0.1;
      const blur = ratio * 12;
      const opacity = 1 - ratio * 1.2;

      heroRef.current.style.transform = `scale(${scale})`;
      heroRef.current.style.filter = `blur(${blur}px)`;
      heroRef.current.style.opacity = `${Math.max(0, opacity)}`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Physics loop for bouncing software icons
  useEffect(() => {
    const blocks = blocksRef.current.filter(Boolean);
    if (blocks.length === 0) return;

    // Cache items with velocity and position states
    const items = blocks.map((el) => {
      const rect = el.getBoundingClientRect();
      const w = rect.width || 140;
      const h = rect.height || 45;
      
      // Random starting coordinates spread across screen
      const startX = Math.random() * (window.innerWidth - w - 40) + 20;
      const startY = Math.random() * (window.innerHeight - h - 100) + 50;
      
      // Random speed vector
      const speed = Math.random() * 1.2 + 1.2;
      const angle = Math.random() * Math.PI * 2;
      
      return {
        el,
        w,
        h,
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed
      };
    });

    let animationId;
    
    const updatePhysics = () => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      items.forEach((item) => {
        // Move
        item.x += item.vx;
        item.y += item.vy;

        // Bounce left/right
        if (item.x <= 0) {
          item.x = 0;
          item.vx = -item.vx * (0.95 + Math.random() * 0.1);
        } else if (item.x + item.w >= screenW) {
          item.x = screenW - item.w;
          item.vx = -item.vx * (0.95 + Math.random() * 0.1);
        }

        // Bounce top/bottom
        if (item.y <= 0) {
          item.y = 0;
          item.vy = -item.vy * (0.95 + Math.random() * 0.1);
        } else if (item.y + item.h >= screenH) {
          item.y = screenH - item.h;
          item.vy = -item.vy * (0.95 + Math.random() * 0.1);
        }

        // Clip velocity range to maintain continuous active motion
        const currentSpeed = Math.sqrt(item.vx * item.vx + item.vy * item.vy);
        if (currentSpeed < 1.0) {
          item.vx = (item.vx / currentSpeed) * 1.2;
          item.vy = (item.vy / currentSpeed) * 1.2;
        } else if (currentSpeed > 4.0) {
          item.vx = (item.vx / currentSpeed) * 3.2;
          item.vy = (item.vy / currentSpeed) * 3.2;
        }

        // Apply translate3d for GPU compositor acceleration
        item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
      });

      animationId = requestAnimationFrame(updatePhysics);
    };

    animationId = requestAnimationFrame(updatePhysics);

    const handleResize = () => {
      items.forEach((item) => {
        const rect = item.el.getBoundingClientRect();
        item.w = rect.width || 140;
        item.h = rect.height || 45;
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative h-screen w-full bg-[#020617] overflow-hidden flex flex-col justify-between origin-center select-none isolate"
      style={{ 
        willChange: 'transform, filter, opacity',
        background: 'radial-gradient(circle at center, rgba(0, 85, 255, 0.42) 0%, rgba(2, 6, 22, 1) 75%)'
      }}
    >
      <style>
        {`
          @keyframes popUpText {
            0% { transform: scale(0.85); opacity: 0; filter: blur(20px); }
            100% { transform: scale(1); opacity: 0.9; filter: blur(0); }
          }
          @keyframes glitchReveal {
            0% { opacity: 0; transform: translateX(-2%) skewX(5deg); filter: hue-rotate(90deg) contrast(200%); clip-path: polygon(0 0, 100% 0, 100% 10%, 0 10%); }
            10% { opacity: 1; transform: translateX(2%) skewX(-5deg); filter: hue-rotate(-90deg) contrast(150%); clip-path: polygon(0 20%, 100% 20%, 100% 30%, 0 30%); }
            20% { transform: translateX(-1%) skewX(2deg); filter: hue-rotate(45deg) invert(1); clip-path: polygon(0 40%, 100% 40%, 100% 50%, 0 50%); }
            30% { transform: translateX(1%) skewX(-2deg); filter: hue-rotate(-45deg) invert(0); clip-path: polygon(0 60%, 100% 60%, 100% 70%, 0 70%); }
            40% { transform: translateX(0) skewX(0); filter: none; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
            45% { transform: translateX(-2%) skewX(10deg); filter: hue-rotate(90deg) contrast(200%); clip-path: polygon(0 80%, 100% 80%, 100% 90%, 0 90%); }
            50% { transform: translateX(0) skewX(0); filter: drop-shadow(0 15px 30px rgba(0,0,0,0.65)); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
            100% { opacity: 1; transform: translateX(0) skewX(0); filter: drop-shadow(0 15px 30px rgba(0,0,0,0.65)); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
          }
          @keyframes fadeInUI {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-pop-up { animation: popUpText 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
          .animate-glitch { opacity: 0; animation: glitchReveal 0.6s ease-out 1s forwards; }
          .animate-ui { opacity: 0; animation: fadeInUI 0.5s ease-out forwards; }
        `}
      </style>
      {/* Background large text "VIDEO EDITOR" */}
      <div 
        ref={bgTextRef}
        className="absolute inset-0 flex flex-col justify-center items-center z-0 pointer-events-none select-none transition-transform duration-200 ease-out"
        style={{ willChange: 'transform' }}
      >
        <div className="animate-pop-up flex flex-col items-center">
          <h1 className="font-display-xl text-[12vw] md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] text-[#0090ff] filter drop-shadow-[0_0_20px_rgba(0,144,255,0.2)]">
            Video
          </h1>
          <h1 
            className="font-display-xl text-[12vw] md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] text-[#06183a] -mt-1"
            style={{
              WebkitTextStroke: '1.5px rgba(0, 85, 255, 0.15)',
              textShadow: '0 0 10px rgba(0, 85, 255, 0.05)'
            }}
          >
            Editor
          </h1>
        </div>
      </div>

      {/* Centered Character Layer (Premium Soft Shadow) */}
      <div 
        className="absolute inset-0 flex items-end justify-center pointer-events-none"
        style={{ 
          transform: 'translate3d(0, 0, 0)',
          transformStyle: 'preserve-3d',
          zIndex: 10
        }}
      >
        <img 
          alt="Cinematic portfolio hero image of Kshitiz" 
          className="h-[65vh] md:h-[88vh] w-auto object-contain select-none pointer-events-auto animate-glitch"
          style={{ 
            filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.65))'
          }}
          src="/hero-character-sticker.png"
        />
      </div>

      {/* Floating Tool Blocks - Randomly bouncing around 1st page */}
      
      {/* Block 1: Premiere Pro */}
      <div 
        ref={el => blocksRef.current[0] = el}
        className="absolute top-0 left-0 pointer-events-none z-20"
      >
        <div 
          className={`glass-card rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg hover:scale-105 transition-all duration-300 select-none cursor-default ${hasInteracted ? 'animate-ui pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          style={{ background: 'rgba(2, 6, 22, 0.45)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div className="w-5 h-5 rounded bg-[#160030] border border-[#9979ff] flex items-center justify-center text-[9px] font-bold text-[#b49eff] tracking-tighter">
            Pr
          </div>
          <span className="font-display-lg text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">Premiere Pro</span>
        </div>
      </div>

      {/* Block 2: After Effects */}
      <div 
        ref={el => blocksRef.current[1] = el}
        className="absolute top-0 left-0 pointer-events-none z-20"
      >
        <div 
          className={`glass-card rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg hover:scale-105 transition-all duration-300 select-none cursor-default ${hasInteracted ? 'animate-ui pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          style={{ background: 'rgba(2, 6, 22, 0.45)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div className="w-5 h-5 rounded bg-[#130030] border border-[#d179ff] flex items-center justify-center text-[9px] font-bold text-[#e19eff] tracking-tighter">
            Ae
          </div>
          <span className="font-display-lg text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">After Effects</span>
        </div>
      </div>

      {/* Block 3: CapCut Pro */}
      <div 
        ref={el => blocksRef.current[2] = el}
        className="absolute top-0 left-0 pointer-events-none z-20"
      >
        <div 
          className={`glass-card rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg hover:scale-105 transition-all duration-300 select-none cursor-default ${hasInteracted ? 'animate-ui pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          style={{ background: 'rgba(2, 6, 22, 0.45)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div className="w-5 h-5 rounded bg-[#001f20] border border-[#00f5ff] flex items-center justify-center text-[9px] font-bold text-[#7ffffa] tracking-tighter">
            Cc
          </div>
          <span className="font-display-lg text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">CapCut Pro</span>
        </div>
      </div>

      <div 
        ref={el => blocksRef.current[3] = el}
        className="absolute top-0 left-0 pointer-events-none z-20"
      >
        <div 
          className={`glass-card rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg hover:scale-105 transition-all duration-300 select-none cursor-default ${hasInteracted ? 'animate-ui pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          style={{ background: 'rgba(2, 6, 22, 0.45)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div className="w-5 h-5 rounded bg-[#001c3d] border border-[#00a8ff] flex items-center justify-center text-[9px] font-bold text-[#00c0ff] tracking-tighter">
            Ps
          </div>
          <span className="font-display-lg text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">Photoshop</span>
        </div>
      </div>

      {/* Left Column Text Info (Foreground UI) */}
      <div className={`absolute left-6 md:left-12 top-1/2 -translate-y-1/2 max-w-[200px] md:max-w-[260px] z-20 flex flex-col items-start text-left transition-opacity duration-300 ${hasInteracted ? 'animate-ui pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <p className="font-body-md text-[11px] md:text-sm text-white/60 leading-relaxed font-medium tracking-wide">
          I guide visual direction, define dynamic pacing, and ensure every frame aligns with the brand's vision.
        </p>
      </div>

      {/* Right Column Showreel Card (Foreground UI) */}
      <div className={`absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col items-end transition-opacity duration-300 ${hasInteracted ? 'animate-ui pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button 
          onClick={() => setIsCatalogueOpen(true)}
          className="glass-card rounded-xl px-6 py-4 flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-all duration-300 group" 
          style={{ background: 'rgba(2, 6, 22, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <span className="font-display-lg text-[10px] md:text-xs font-bold text-white tracking-[0.3em] uppercase group-hover:text-[#00d2ff] transition-colors">Catalouge</span>
          <span className="material-symbols-outlined text-white/50 text-sm group-hover:text-[#00d2ff]/80 transition-colors">video_library</span>
        </button>
      </div>

      {/* Catalogue Modal */}
      {isCatalogueOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            onClick={() => setIsCatalogueOpen(false)}
          />
          
          {/* Modal Content */}
          <style>
            {`
              @keyframes blurIn {
                0% {
                  opacity: 0;
                  filter: blur(20px);
                  transform: scale(0.95);
                }
                100% {
                  opacity: 1;
                  filter: blur(0px);
                  transform: scale(1);
                }
              }
            `}
          </style>
          <div className="relative w-full max-w-lg bg-[#020616] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 md:p-8 m-4 flex flex-col gap-6" style={{ animation: 'blurIn 1s ease-out forwards' }}>
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="font-display-lg text-lg md:text-xl font-bold text-white tracking-[0.2em] uppercase">Catalouge</h2>
              <button 
                onClick={() => setIsCatalogueOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {REELS.map((reel, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setIsCatalogueOpen(false);
                    onPlayShowreel(reel);
                  }}
                  className="flex items-center gap-4 cursor-pointer group hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors"
                >
                  <div className="relative w-24 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/5 shadow-lg">
                    <video 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                      src={`${reel.video_url}#t=2.0`}
                      preload="metadata"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>play_arrow</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-display-lg text-xs md:text-sm font-bold text-white/80 group-hover:text-white tracking-widest uppercase transition-colors">
                    {reel.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Horizontal Disciplines Row */}
      <div className={`absolute bottom-6 left-6 right-6 md:left-12 md:right-12 z-20 flex justify-between gap-4 overflow-x-auto text-[8px] md:text-xs tracking-[0.2em] font-semibold text-white/40 uppercase select-none transition-opacity duration-300 ${hasInteracted ? 'animate-ui pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <span className="hover:text-white transition-colors cursor-default">Video Editing</span>
        <span className="hover:text-white transition-colors cursor-default">Color Grading</span>
        <span className="hover:text-white transition-colors cursor-default">Sound Design</span>
        <span className="hover:text-white transition-colors cursor-default font-bold text-[#00d2ff]">Motion Design</span>
      </div>
    </section>
  );
}
