import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaWhatsapp, FaArrowDown, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import Hero3D from './3d/Hero3D';
import shahidSuit from '../../../assets/shahid_suit.jpg';

const iconMap: Record<string, any> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  whatsapp: FaWhatsapp,
  email: FaEnvelope,
};

export default function Hero() {
  const [data, setData] = useState({
    name: 'Shahid Afridi',
    title: 'MERN Stack & React Native Developer',
    subtitle: 'I build high-end web applications, cross-platform React Native apps, real-time analytics dashboards, and premium user interfaces that turn visitors into paying clients.',
    profileImage: '',
    ctaButtons: [
      { label: 'Hire Me', action: '#contact', primary: true },
      { label: 'Download CV', action: '#about', primary: false }
    ],
    socialLinks: [
      { platform: 'github', url: 'https://github.com/mrshahidafridi786' },
      { platform: 'linkedin', url: 'https://www.linkedin.com/in/shahid-ullahafridi' },
      { platform: 'whatsapp', url: 'https://wa.me/923178533838' },
      { platform: 'email', url: 'mailto:shahidullahafridi31@gmail.com' }
    ]
  });

  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await axios.get('/api/hero');
        if (response.data) {
          setData(response.data);
        }
      } catch (err) {
        console.log('Using default hero configuration parameters.');
      }
    };
    loadHero();
  }, []);

  const handleScrollTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCtaClick = (action: string) => {
    if (action.startsWith('#')) {
      handleScrollTo(action.substring(1));
    } else {
      window.open(action, '_blank', 'noopener,noreferrer');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col justify-center px-6 pt-16 md:px-16 overflow-hidden"
    >
      {/* 3D Canvas Background */}
      <Hero3D />

      {/* Glow Backdrops */}
      <div className="glow-backdrop-blue left-[-100px] top-[10%]" />
      <div className="glow-backdrop-purple right-[-50px] bottom-[20%]" />

      {/* Main Hero Contents */}
      <div className="mx-auto w-full max-w-7xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center space-y-6"
        >
          {/* Tagline Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex w-fit items-center space-x-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-accent-cyan uppercase"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
            </span>
            <span>Available for International Projects</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-sans text-5xl font-extrabold tracking-tight sm:text-7xl leading-tight"
          >
            Hi, I'm <br />
            <span className="text-gradient-blue-purple font-sans">{data.name}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            variants={itemVariants}
            className="font-sans text-2xl font-bold tracking-tight text-white/90 sm:text-3xl"
          >
            {data.title}
          </motion.h2>

          {/* Body description */}
          <motion.p
            variants={itemVariants}
            className="max-w-md font-sans text-base leading-relaxed text-text-secondary md:text-lg"
          >
            {data.subtitle}
          </motion.p>

          {/* CTA Group */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
            {data.ctaButtons.map((btn, index) => (
              <button
                key={index}
                onClick={() => handleCtaClick(btn.action)}
                className={btn.primary 
                  ? "rounded-full bg-gradient-to-r from-accent-blue to-accent-purple px-8 py-3.5 text-sm font-bold tracking-wider uppercase text-white shadow-glow-blue transition-transform hover:scale-105"
                  : "rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-3.5 text-sm font-bold tracking-wider uppercase text-white transition-all hover:bg-white/10 hover:border-white/30"
                }
              >
                {btn.label}
              </button>
            ))}
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex items-center space-x-6 pt-4">
            {data.socialLinks.map((social, index) => {
              const Icon = iconMap[social.platform.toLowerCase()] || FaEnvelope;
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-white transition-colors duration-300"
                  aria-label={`${social.platform} Link`}
                >
                  <Icon size={24} />
                </a>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Floating Avatar Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, type: 'spring' }}
          className="hidden md:flex justify-center items-center relative"
        >
          {/* Floating backdrop glow */}
          <div className="absolute h-72 w-72 rounded-full bg-accent-blue/10 blur-3xl" />
          
          {/* Geometric floating element container */}
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 2, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 6, 
              ease: "easeInOut" 
            }}
            className="relative h-[340px] w-[270px] rounded-3xl border border-white/10 p-3 bg-white/5 backdrop-blur-md shadow-glass-md flex flex-col items-center justify-between overflow-hidden"
          >
            {/* The profile photo */}
            <div className="h-[250px] w-full rounded-2xl overflow-hidden border border-white/5 relative">
              <img 
                src={data.profileImage || shahidSuit} 
                alt={data.name} 
                className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
            
            <div className="w-full text-center pb-1">
              <div className="font-sans font-bold text-white text-sm tracking-wide">{data.name}</div>
              <div className="font-sans text-[10px] tracking-widest text-accent-cyan uppercase mt-0.5">
                {data.title}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => handleScrollTo('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer flex flex-col items-center space-y-2 z-10"
      >
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary hover:text-white transition-colors">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-accent-cyan"
        >
          <FaArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
