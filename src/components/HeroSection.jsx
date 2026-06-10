import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection({ onPlayShowreel, hasInteracted, isBlurred }) {
  const heroRef = useRef(null);
  const bgTextRef = useRef(null);
  const blocksRef = useRef([]);

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
      className={`relative h-screen w-full bg-[#020617] overflow-hidden flex flex-col justify-between origin-center select-none isolate transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isBlurred ? 'blur-[12px] scale-[0.97] opacity-40 pointer-events-none' : 'opacity-100 scale-100'}`}
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
            0% { opacity: 0; filter: blur(10px); transform: translateY(10px); }
            100% { opacity: 1; filter: blur(0px); transform: translateY(0); }
          }
          .animate-pop-up { animation: popUpText 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
          .animate-glitch { opacity: 0; animation: glitchReveal 0.6s ease-out 1s forwards; }
          .animate-ui { opacity: 0; animation: fadeInUI 1s ease-out forwards; }
          @keyframes moveGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-move { animation: moveGradient 3s ease infinite; background-size: 200% 200%; }
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

      {/* Text Info (Foreground UI) */}
      <div className={`absolute left-1/2 -translate-x-1/2 top-[12vh] md:left-12 md:translate-x-0 md:top-1/2 md:-translate-y-1/2 w-full max-w-[320px] md:max-w-[260px] px-6 md:px-0 z-20 flex flex-col items-center text-center md:items-start md:text-left transition-opacity duration-300 ${hasInteracted ? 'animate-ui pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <p className="font-body-md text-xs md:text-sm text-white/60 leading-relaxed font-medium tracking-wide">
          I guide visual direction, define dynamic pacing, and ensure every frame aligns with the brand's vision.
        </p>
      </div>

      {/* Centered Showreel Card (Foreground UI) */}
      <div className={`absolute left-1/2 bottom-[15%] md:bottom-20 -translate-x-1/2 z-30 flex flex-col items-center transition-opacity duration-300 ${hasInteracted ? 'animate-ui pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="relative group transition-transform duration-300 hover:scale-105 cursor-pointer">
          {/* Inspired Glowing Lights */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-[#f0f8ff] via-blue-600/50 to-[#00d2ff] rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500 animate-gradient-move"></div>
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[#f0f8ff] via-[#051024] to-[#00d2ff] rounded-xl opacity-60 group-hover:opacity-90 transition duration-500 animate-gradient-move"></div>

          <Link
            to="/works"
            className="relative glass-card rounded-xl px-6 py-4 flex items-center justify-center gap-3 shadow-2xl transition-all duration-300"
            style={{ background: 'rgba(5, 5, 10, 0.85)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
          >
            <span className="font-display-lg text-[10px] md:text-xs font-bold text-white/90 tracking-[0.3em] uppercase group-hover:text-white transition-colors">Catalouge</span>
            <span className="material-symbols-outlined text-white/50 text-sm group-hover:text-white/90 transition-colors">video_library</span>
          </Link>
        </div>
      </div>



      {/* Disciplines - Desktop (Bottom Row) */}
      <div className={`hidden md:flex absolute bottom-6 left-12 right-12 z-20 justify-between gap-4 text-xs tracking-[0.2em] font-semibold text-white/40 uppercase select-none transition-opacity duration-300 ${hasInteracted ? 'animate-ui pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <span className="hover:text-white transition-colors cursor-default">Video Editing</span>
        <span className="hover:text-white transition-colors cursor-default">Color Grading</span>
        <span className="hover:text-white transition-colors cursor-default">Sound Design</span>
        <span className="hover:text-white transition-colors cursor-default font-bold text-[#00d2ff]">Motion Design</span>
      </div>

      {/* Disciplines - Mobile (Side Stacks) */}
      <div className={`flex md:hidden absolute top-[55%] left-6 z-20 flex-col gap-10 text-[9px] tracking-[0.2em] font-semibold text-white/40 uppercase select-none transition-opacity duration-300 ${hasInteracted ? 'animate-ui pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <span className="hover:text-white transition-colors cursor-default w-min">Video Editing</span>
        <span className="hover:text-white transition-colors cursor-default w-min">Color Grading</span>
      </div>
      <div className={`flex md:hidden absolute top-[55%] right-6 z-20 flex-col items-end gap-10 text-[9px] tracking-[0.2em] font-semibold text-white/40 uppercase select-none transition-opacity duration-300 ${hasInteracted ? 'animate-ui pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <span className="hover:text-white transition-colors cursor-default w-min text-right">Sound Design</span>
        <span className="hover:text-white transition-colors cursor-default w-min text-right font-bold text-[#00d2ff]">Motion Design</span>
      </div>
    </section>
  );
}
