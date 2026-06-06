export default function Navbar({ onScrollTo, hasInteracted }) {
  return (
    <>
      <style>{`
        @keyframes fadeInUINav {
          0% { opacity: 0; filter: blur(10px); transform: translateY(-10px); }
          100% { opacity: 1; filter: blur(0px); transform: translateY(0); }
        }
        .animate-ui-nav { opacity: 0; animation: fadeInUINav 1s ease-out forwards; }
      `}</style>
      <header className={`fixed top-0 left-0 w-full z-40 flex justify-between items-center px-6 md:px-12 py-6 bg-transparent select-none pointer-events-none transition-opacity duration-300 ${hasInteracted ? 'animate-ui-nav' : 'opacity-0'}`}>
      <div 
        onClick={() => onScrollTo('hero')} 
        className="font-display-lg text-sm font-semibold text-white tracking-[0.2em] cursor-pointer hover:opacity-80 transition-opacity uppercase pointer-events-auto"
      >
        KSHITIZ ®
      </div>
      
      <a 
        href="https://instagram.com/kshitizgotbarss" 
        target="_blank" 
        rel="noopener noreferrer"
        className="font-display-lg text-[10px] md:text-xs font-bold text-black bg-white hover:bg-[#00d2ff] hover:text-black transition-all px-5 py-2 md:px-6 md:py-2.5 rounded-full tracking-widest uppercase shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] pointer-events-auto hover:scale-105"
      >
        Hire Me
      </a>
    </header>
    </>
  );
}
