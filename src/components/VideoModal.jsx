import { useRef, useState, useEffect } from 'react';

export default function VideoModal({ project, onClose }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Time Updates
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  // Metadata Loaded (Duration)
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  // Progress scrubbing
  const handleProgressClick = (e) => {
    if (!videoRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Volume Change
  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  // Fullscreen
  const toggleFullscreen = () => {
    const playerContainer = videoRef.current?.parentElement;
    if (!playerContainer) return;

    if (!document.fullscreenElement) {
      playerContainer.requestFullscreen().catch(err => {
        console.error("Fullscreen error:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Escape key close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Format time (mm:ss)
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress bar percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Cloudflare Stream URL or standard backup
  const videoUrl = project.cloudflare_video_id
    ? `https://videodelivery.net/${project.cloudflare_video_id}/manifest/video.m3u8`
    : project.video_url || 'https://assets.mixkit.co/videos/preview/mixkit-dark-3d-render-fluid-organic-shapes-43336-large.mp4';

  const isCloudflareStream = !!project.cloudflare_video_id;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300">
      {/* Click Backdrop to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Close Button */}
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 text-white/60 hover:text-white z-[110] transition-colors focus:outline-none"
      >
        <span className="material-symbols-outlined text-4xl">close</span>
      </button>

      {/* Player Container */}
      <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl cinematic-glow z-10 group">
        
        {isCloudflareStream ? (
          // If using Cloudflare Stream API direct embed (using standard CF player iframe)
          <iframe
            src={`https://iframe.videodelivery.net/${project.cloudflare_video_id}?autoplay=true&letterbox=true`}
            style={{ border: 'none', width: '100%', height: '100%' }}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
            title={project.title}
          ></iframe>
        ) : (
          // Custom HTML5 Video Player
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              className="w-full h-full object-contain cursor-pointer"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              disablePictureInPicture
            />

            {/* Custom Styled Video.js Inspired HUD Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-4 pointer-events-auto">
              
              {/* Timeline Scrub Progress Bar */}
              <div 
                onClick={handleProgressClick}
                className="w-full bg-white/20 h-1.5 rounded-full cursor-pointer relative overflow-hidden hover:h-2 transition-all duration-150"
              >
                <div 
                  style={{ width: `${progressPercent}%` }}
                  className="absolute top-0 left-0 h-full bg-primary"
                ></div>
              </div>

              {/* Controls HUD */}
              <div className="flex justify-between items-center text-white/80">
                <div className="flex items-center gap-6">
                  {/* Play/Pause Button */}
                  <button onClick={togglePlay} className="hover:text-primary transition-colors focus:outline-none">
                    <span className="material-symbols-outlined text-2xl">
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>

                  {/* Volume HUD */}
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="hover:text-primary transition-colors focus:outline-none">
                      <span className="material-symbols-outlined text-2xl">
                        {isMuted ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                      </span>
                    </button>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.05" 
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-white/25 rounded-lg appearance-none cursor-pointer accent-primary" 
                    />
                  </div>

                  {/* Time Counters */}
                  <span className="font-label-caps text-xs tracking-wider">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  {/* Settings Indicator */}
                  <span className="material-symbols-outlined text-xl cursor-pointer hover:text-primary transition-colors">
                    settings
                  </span>

                  {/* Fullscreen Toggle */}
                  <button onClick={toggleFullscreen} className="hover:text-primary transition-colors focus:outline-none">
                    <span className="material-symbols-outlined text-2xl">
                      {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
