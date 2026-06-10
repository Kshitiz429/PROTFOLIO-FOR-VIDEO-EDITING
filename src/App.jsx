import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import VideoModal from './components/VideoModal';
import MyWorks from './pages/MyWorks';

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const location = useLocation();

  const isWorksRoute = location.pathname === '/works';

  useEffect(() => {
    const handleInitialMove = () => {
      setHasInteracted(true);
      window.removeEventListener('mousemove', handleInitialMove);
    };
    window.addEventListener('mousemove', handleInitialMove);
    return () => window.removeEventListener('mousemove', handleInitialMove);
  }, []);

  // Scroll logic for navbar buttons
  const handleScrollTo = (elementId) => {
    const target = document.getElementById(elementId);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-background min-h-screen text-on-surface flex flex-col justify-between selection:bg-primary selection:text-on-primary relative overflow-x-hidden">
      
      {/* Dynamic Background Layout */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 grid-bg-pattern opacity-60"></div>
        <div className="absolute inset-0 noise-overlay"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full glow-orb-1 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full glow-orb-2 blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
        <div className="absolute top-[35%] right-[-15%] w-[45vw] h-[45vw] rounded-full glow-orb-3 blur-[110px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }}></div>
      </div>

      <Navbar onScrollTo={handleScrollTo} hasInteracted={hasInteracted} />
      
      {/* Always render HeroSection, pass isBlurred if on /works route */}
      <main className="flex-grow relative z-10 transition-all duration-700 ease-in-out">
        <HeroSection 
          onPlayShowreel={(project) => setSelectedProject(project)} 
          hasInteracted={hasInteracted} 
          isBlurred={isWorksRoute}
        />
      </main>

      {/* Render MyWorks strictly when route matches */}
      <Routes>
        <Route path="/works" element={<MyWorks />} />
      </Routes>

      {/* Fullscreen Interactive Video Modal for Home Page */}
      {selectedProject && (
        <VideoModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

    </div>
  );
}
