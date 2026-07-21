import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import shahidSuit from '../../assets/shahid_suit.jpg';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoImage, setLogoImage] = useState('');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // 1. Intersection Observer for active section detection
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px', // Viewport detection hot-zone
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navLinks.forEach((link) => {
      const targetId = link.href.substring(1);
      const el = document.getElementById(targetId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 2. Scroll listener for capsule size and glassmorphism updates
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Load logo profile photo from backend API
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/hero');
        if (response.ok) {
          const data = await response.json();
          if (data && data.profileImage) {
            setLogoImage(data.profileImage);
          }
        }
      } catch (err) {
        console.log('Using local fallback image for navbar logo.');
      }
    };
    fetchLogo();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Entrance Framer Motion variants
  const navContainerVariants = {
    hidden: { y: -80, opacity: 0, filter: 'blur(10px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const navItemVariants = {
    hidden: { y: -20, opacity: 0, filter: 'blur(4px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <>
      {/* Dynamic Keyframes for Premium animations (Shine, Breath Glow) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine-sweep {
          0% { left: -150%; }
          50% { left: 150%; }
          100% { left: 150%; }
        }
        @keyframes infinite-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 25px rgba(96, 165, 250, 0.6); }
        }
        .btn-shine-overlay {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
          transform: skewX(-25deg);
          animation: shine-sweep 3.5s infinite ease-in-out;
        }
        .btn-pulse-glow {
          animation: infinite-glow 4s infinite ease-in-out;
        }
      `}} />

      <motion.header
        className={`fixed left-0 right-0 top-0 z-[50] transition-all duration-500 ease-out ${
          isScrolled ? 'top-3 px-4 md:px-8' : 'top-0 px-0'
        }`}
        variants={navContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between transition-all duration-500 ease-out ${
            isScrolled
              ? 'bg-[#050816]/75 backdrop-blur-2xl rounded-full px-8 py-3 border border-white/[0.08] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.5)]'
              : 'bg-transparent px-6 py-6 border-b border-white/[0.05]'
          }`}
        >
          {/* Logo Brand with custom Scale, Rotation & Glow */}
          <motion.a
            href="#home"
            onClick={(e) => handleLinkClick(e, 'home')}
            className="flex items-center space-x-2.5 group cursor-pointer"
            variants={navItemVariants}
            whileHover={{ scale: 1.03 }}
          >
            <div className="relative h-9 w-9 rounded-full overflow-hidden border border-white/20 bg-white/5 shadow-[0_0_15px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] transition-all duration-300">
              <img 
                src={logoImage || shahidSuit} 
                alt="Shahid Afridi Logo" 
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-sans text-xs font-black tracking-widest text-white group-hover:text-accent-blue transition-colors duration-300 uppercase hidden sm:inline-block">
              Shahid Afridi
            </span>
          </motion.a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const targetId = link.href.substring(1);
              const isActive = activeSection === targetId;

              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, targetId)}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 px-4.5 py-2 rounded-full cursor-pointer flex flex-col items-center ${
                    isActive 
                      ? 'text-[#3B82F6] font-extrabold shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                      : 'text-slate-300 hover:text-[#3B82F6]'
                  }`}
                  variants={navItemVariants}
                  whileHover={{ y: -1 }}
                >
                  <span className="relative z-10">{link.name}</span>
                  
                  {/* Hover background bubble */}
                  {hoveredLink === link.name && (
                    <motion.span
                      layoutId="hoverBubble"
                      className="absolute inset-0 rounded-full bg-white/[0.04] border border-white/[0.06] -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}

                  {/* Active Link Underline */}
                  {isActive && (
                    <motion.span
                      layoutId="activeUnderline"
                      className="absolute -bottom-1.5 left-4 right-4 h-[2px] bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-purple rounded-full z-10 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.a>
              );
            })}
          </nav>

          {/* Hire Me CTA Button - Pulsing shadow, Glossy Sweep, Hover scale */}
          <motion.div 
            className="hidden md:flex items-center"
            variants={navItemVariants}
          >
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="btn-pulse-glow relative overflow-hidden rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-6 py-2.5 text-xs font-bold tracking-wider uppercase text-white transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer block"
            >
              <div className="btn-shine-overlay" />
              <span className="relative z-10">Hire Me</span>
            </a>
          </motion.div>

          {/* Mobile Morphing Hamburger Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 flex-col items-center justify-center space-y-1.5 rounded-full border border-white/10 bg-white/5 text-white md:hidden hover:border-white/20 transition-all duration-200 cursor-pointer z-50"
            aria-label="Toggle Mobile Menu"
            variants={navItemVariants}
          >
            <motion.span 
              className="h-[2px] w-5 bg-white rounded-full block" 
              animate={isMobileMenuOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.span 
              className="h-[2px] w-5 bg-white rounded-full block" 
              animate={isMobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span 
              className="h-[2px] w-5 bg-white rounded-full block" 
              animate={isMobileMenuOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
            />
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Drawer Overlay - Slide in from right with backdrop blur */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div 
              className="fixed inset-0 z-[48] bg-black/60 backdrop-blur-md md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Morphing sidebar drawer */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-80 z-[49] flex flex-col justify-center bg-[#0b1120]/95 backdrop-blur-2xl border-l border-white/[0.08] px-8 md:hidden shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            >
              <div className="flex flex-col space-y-6">
                {navLinks.map((link, idx) => {
                  const targetId = link.href.substring(1);
                  const isActive = activeSection === targetId;

                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, targetId)}
                      className={`font-sans text-2xl font-bold tracking-wide transition-colors ${
                        isActive ? 'text-[#3B82F6]' : 'text-slate-400 hover:text-white'
                      }`}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ delay: idx * 0.06 }}
                    >
                      {link.name}
                    </motion.a>
                  );
                })}
                <motion.a
                  href="#contact"
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  className="btn-pulse-glow mt-8 block w-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] py-3.5 text-center font-sans text-base font-bold text-white shadow-lg relative overflow-hidden"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ delay: navLinks.length * 0.06 }}
                >
                  <div className="btn-shine-overlay" />
                  <span className="relative z-10">Hire Me</span>
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
