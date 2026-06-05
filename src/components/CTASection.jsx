
export default function CTASection({ config }) {
  const handleUrl = `https://instagram.com/${config?.instagram_handle || 'kshitizgotbarss'}`;

  const ctaText = config?.cta_text || "Want your content to look smoother, more premium, and impossible to ignore?";
  const ctaSubtext = config?.cta_subtext || "DM @kshitizgotbarss on Instagram.";

  return (
    <section id="contact" className="py-32 px-6 md:px-20 relative bg-background overflow-hidden border-t border-white/5 scroll-mt-16">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-secondary-container/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <span className="font-label-caps text-primary text-xs tracking-[0.3em] font-bold block mb-4">GET IN TOUCH</span>
        
        {/* Large Text */}
        <h2 className="font-display-lg text-3xl md:text-5xl font-semibold mb-6 max-w-3xl leading-snug text-white">
          {ctaText}
        </h2>

        {/* Instgram handle reference */}
        <p className="text-on-surface-variant font-body-lg text-lg md:text-xl mb-12 tracking-wide font-light">
          {ctaSubtext}
        </p>

        {/* CTA Button */}
        <a 
          href={handleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative px-10 py-4 rounded-full bg-primary text-on-primary font-label-caps text-xs tracking-widest font-bold hover:bg-white hover:text-black transition-colors duration-500 cinematic-glow block"
        >
          <span className="flex items-center gap-3">
            LET'S WORK TOGETHER
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
