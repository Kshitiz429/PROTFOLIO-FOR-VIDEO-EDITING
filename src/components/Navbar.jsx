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
    </header>
    </>
  );
}
