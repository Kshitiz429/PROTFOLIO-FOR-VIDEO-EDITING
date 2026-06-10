import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { REELS } from '../data/reels';
import VideoModal from '../components/VideoModal';

export default function MyWorks() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [scrambledReels, setScrambledReels] = useState([]);
  const navigate = useNavigate();

  // Scramble videos on mount
  useEffect(() => {
    const shuffled = [...REELS].sort(() => Math.random() - 0.5);
    setScrambledReels(shuffled);
  }, []);

  // Escape key to close page
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !selectedVideo) {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, selectedVideo]);

  // Positions corresponding to the design reference
  const LAYOUT_POSITIONS = [
    { top: '15%', left: '4%', width: '16%', height: '60%', rotate: '6deg', zIndex: 10 },
    { top: '10%', left: '22%', width: '16%', height: '60%', rotate: '4deg', zIndex: 20 },
    { top: '2%', left: '41%', width: '18%', height: '36%', rotate: '0deg', zIndex: 30 },
    { top: '46%', left: '41%', width: '20%', height: '28%', rotate: '-2deg', zIndex: 40 },
    { top: '2%', left: '62%', width: '21%', height: '30%', rotate: '-5deg', zIndex: 30 },
    { top: '38%', left: '65%', width: '15%', height: '55%', rotate: '-3deg', zIndex: 40 },
    { top: '15%', left: '82%', width: '16%', height: '60%', rotate: '-6deg', zIndex: 20 },
    { top: '68%', left: '12%', width: '20%', height: '25%', rotate: '8deg', zIndex: 50 },
  ];

  return (
    <>
      <style>{`
        @keyframes slideUpFade {
          from { transform: translateY(100px); opacity: 0; filter: blur(20px); }
          to { transform: translateY(0); opacity: 1; filter: blur(0px); }
        }
        @keyframes floatRandom {
          0% { transform: translateY(0px) rotate(var(--rot)); }
          50% { transform: translateY(-15px) rotate(var(--rot)); }
          100% { transform: translateY(0px) rotate(var(--rot)); }
        }
        .animate-entry {
          animation: slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .float-card {
          animation: floatRandom 6s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-black/40 backdrop-blur-xl flex flex-col items-center select-none pt-8 pb-20 animate-entry">
        
        {/* Click outside to close (Optional, since we have back button) */}
        <div className="absolute inset-0 z-0" onClick={() => navigate('/')}></div>

        <div className="relative z-10 w-full max-w-[1400px] flex flex-col items-center flex-grow px-4 pointer-events-none">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 relative w-full justify-center pointer-events-auto">
            <button onClick={() => navigate('/')} className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition-all shadow-lg backdrop-blur-md">
              <span className="material-symbols-outlined text-white text-2xl">close</span>
            </button>
            <h1 className="font-display-xl text-4xl md:text-5xl lg:text-6xl font-black tracking-widest text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] uppercase">
              MY <span className="text-[#00d2ff]">WORKS</span>
            </h1>
          </div>

          {/* Desktop Arc Layout Container */}
          <div className="hidden lg:block relative w-full aspect-[21/9] max-h-[700px] pointer-events-auto">
            {scrambledReels.slice(0, 8).map((reel, idx) => {
              const pos = LAYOUT_POSITIONS[idx] || LAYOUT_POSITIONS[0];
              const delay = `${idx * 0.2}s`;
              return (
                <div 
                  key={idx}
                  className="absolute float-card cursor-pointer group shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_20px_45px_rgba(0,210,255,0.5)] border-2 border-white/60 bg-black rounded-xl overflow-hidden hover:!z-50"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    width: pos.width,
                    height: pos.height,
                    zIndex: pos.zIndex,
                    '--rot': pos.rotate,
                    animationDelay: delay,
                    transform: `rotate(${pos.rotate})`
                  }}
                  onClick={() => setSelectedVideo(reel)}
                >
                  <video
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    src={`${reel.video_url}#t=1.0`}
                    poster={reel.poster}
                    autoPlay
                    loop
                    preload="auto"
                    muted
                    playsInline
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    disablePictureInPicture
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-3 left-0 w-full text-center px-2">
                    <h3 className="text-white font-display-lg font-bold text-xs sm:text-sm xl:text-base tracking-wide drop-shadow-md truncate">
                      {reel.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Fallback Layout */}
          <div className="flex lg:hidden flex-col gap-6 w-full max-w-sm pointer-events-auto">
            {scrambledReels.map((reel, idx) => (
              <div 
                key={idx}
                className="relative rounded-xl overflow-hidden cursor-pointer group shadow-[0_15px_35px_rgba(0,0,0,0.3)] transition-all duration-500 hover:scale-105 border-2 border-white/80 bg-black aspect-[9/16]"
                onClick={() => setSelectedVideo(reel)}
              >
                <video
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  src={`${reel.video_url}#t=1.0`}
                  poster={reel.poster}
                  autoPlay
                  loop
                  preload="auto"
                  muted
                  playsInline
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  disablePictureInPicture
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-4 left-0 w-full text-center px-4">
                  <h3 className="text-white font-display-lg font-bold text-base tracking-wide drop-shadow-md">
                    {reel.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Hire Me Button */}
          <a 
            href="https://instagram.com/kshitizgotbarss" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-12 group relative pointer-events-auto inline-block"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative px-12 py-4 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] rounded-full border border-white/40 shadow-[0_10px_30px_rgba(0,100,255,0.4)] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[0%] transition-transform duration-300"></div>
              <span className="relative z-10 font-display-lg text-white font-bold text-xl tracking-widest drop-shadow-md">HIRE ME</span>
            </div>
          </a>

        </div>

        {/* Fullscreen Video Modal */}
        {selectedVideo && (
          <VideoModal 
            project={selectedVideo} 
            onClose={() => setSelectedVideo(null)} 
          />
        )}
      </div>
    </>
  );
}
