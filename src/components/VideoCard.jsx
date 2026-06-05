import { useRef, useEffect } from 'react';

export default function VideoCard({ project, onClick }) {
  const videoRef = useRef(null);

  useEffect(() => {
    // Ensure play starts when video ref is mounted
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        // Safe check for autoplay blocks
        console.log("Autoplay check:", err.message);
      });
    }
  }, [project.video_url]);

  return (
    <div 
      onClick={() => onClick(project)}
      className="relative glass-card rounded-3xl p-6 flex flex-col justify-end group cursor-pointer overflow-hidden transition-all duration-500 hover:border-primary/30 h-[360px] sm:h-[400px] md:h-[450px]"
    >
      {/* Continuously looping background video preview */}
      <video
        ref={videoRef}
        src={project.video_url || 'https://assets.mixkit.co/videos/preview/mixkit-dark-3d-render-fluid-organic-shapes-43336-large.mp4'}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 pointer-events-none"
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
        <span className="font-label-caps text-[10px] text-primary font-bold tracking-widest uppercase">
          {project.category || 'REEL'}
        </span>
        <h4 className="font-headline-lg text-lg font-bold mt-1 mb-2 text-white group-hover:text-primary transition-colors">
          {project.title}
        </h4>
        <p className="text-on-surface/50 text-xs line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        
        {/* Play HUD hover indicator */}
        <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-primary/0 group-hover:text-primary/100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-500">
          <span>EXPAND REEL</span>
          <span className="material-symbols-outlined text-xs">open_in_full</span>
        </div>
      </div>
    </div>
  );
}
