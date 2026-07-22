import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaWhatsapp, FaArrowUp, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import shahidSuit from '../../assets/shahid_suit.jpg';

const iconMap: Record<string, any> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  whatsapp: FaWhatsapp,
  email: FaEnvelope,
};

export default function Footer() {
  const [logoImage, setLogoImage] = useState('');
  const [settings, setSettings] = useState({
    email: 'shahidullahafridi31@gmail.com',
    socialLinks: [
      { platform: 'github', url: 'https://github.com/mrshahidafridi786' },
      { platform: 'linkedin', url: 'https://www.linkedin.com/in/shahid-ullahafridi' },
      { platform: 'whatsapp', url: 'https://wa.me/923178533838' }
    ]
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        if (response.data) {
          setSettings(response.data);
        }
      } catch (err) {
        console.log('Using local fallback settings in footer.');
      }
    };

    const fetchLogo = async () => {
      try {
        const response = await axios.get('/api/hero');
        if (response.data && response.data.profileImage) {
          setLogoImage(response.data.profileImage);
        }
      } catch (err) {
        console.log('Using local fallback image in footer logo.');
      }
    };

    loadSettings();
    fetchLogo();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#050816] py-12 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & Headline */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/20 bg-white/5 shadow-glow-blue">
                <img
                  src={logoImage || shahidSuit}
                  alt="Shahid Afridi"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-sans text-xl font-bold tracking-wider text-white uppercase">
                Shahid Afridi
              </span>
            </div>
            <p className="max-w-sm font-sans text-sm leading-relaxed text-text-secondary">
              Designing and engineering high-end MERN stack solutions. Making digital operations responsive, secure, and modern.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-sm font-bold tracking-wider uppercase text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 font-sans text-sm">
              <li>
                <a href="#home" className="text-text-secondary transition-colors hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-text-secondary transition-colors hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#skills" className="text-text-secondary transition-colors hover:text-white">
                  Skills
                </a>
              </li>
              <li>
                <a href="#projects" className="text-text-secondary transition-colors hover:text-white">
                  Projects
                </a>
              </li>
              <li>
                <Link to="/admin/login" className="text-accent-cyan/80 transition-colors hover:text-accent-cyan">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Details */}
          <div>
            <h4 className="font-sans text-sm font-bold tracking-wider uppercase text-white mb-4">
              Connect
            </h4>
            <div className="flex space-x-4 mb-4">
              {settings.socialLinks.map((social, index) => {
                const Icon = iconMap[social.platform.toLowerCase()] || FaEnvelope;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-secondary transition-all hover:border-accent-blue hover:text-white hover:shadow-glow-blue"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
            <p className="flex items-center space-x-2 font-sans text-sm text-text-secondary">
              <FaEnvelope size={14} className="text-accent-cyan" />
              <span>{settings.email}</span>
            </p>
          </div>
        </div>

        {/* Separator & Back to Top */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-white/5 pt-8 sm:flex-row">
          <p className="font-sans text-xs text-text-secondary text-center sm:text-left mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} Shahid Afridi. All rights reserved. Created with premium MERN stack guidelines.
          </p>

          <motion.button
            onClick={scrollToTop}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-secondary transition-all hover:border-accent-purple hover:text-white hover:shadow-glow-purple"
            whileHover={{ y: -5 }}
            aria-label="Scroll to top"
          >
            <FaArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
