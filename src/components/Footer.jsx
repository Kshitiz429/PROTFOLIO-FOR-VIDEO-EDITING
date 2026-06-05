
export default function Footer() {
  return (
    <footer className="w-full px-6 md:px-20 py-12 flex flex-col md:flex-row justify-between items-center border-t border-outline-variant/10 bg-surface-container-lowest">
      <div className="font-display-lg text-lg font-bold text-on-surface mb-6 md:mb-0 tracking-widest">
        KSHITIZ
      </div>
      
      <div className="flex flex-col items-center md:items-end gap-4">
        <div className="flex gap-8 font-body-md text-sm text-on-surface-variant font-semibold">
          <a className="hover:text-primary transition-colors duration-300" href="#">Instagram</a>
          <a className="hover:text-primary transition-colors duration-300" href="#">Behance</a>
          <a className="hover:text-primary transition-colors duration-300" href="#">Dribbble</a>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-on-surface/40">
          <p>© 2026 Kshitiz Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
