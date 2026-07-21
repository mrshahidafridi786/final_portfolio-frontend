import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FaCode, FaRocket, FaExchangeAlt, FaPaintBrush, FaTools, FaBolt, FaPlus, FaMinus 
} from 'react-icons/fa';

const iconMap: Record<string, any> = {
  FaCode,
  FaRocket,
  FaExchangeAlt,
  FaPaintBrush,
  FaTools,
  FaBolt
};

const fallbackServices = [
  {
    icon: 'FaCode',
    title: 'React Web Development',
    short: 'Building secure, component-driven client portals and interactive software interfaces.',
    bullets: [
      'Single Page Applications (SPAs) with optimized client routing.',
      'Context API, Redux Toolkit, or custom hooks state architectures.',
      'Strict TypeScript compilation for error-free execution.',
      'API gateway connections and schema parsing middleware.'
    ],
    stack: 'React, Vite, TS, Tailwind'
  },
  {
    icon: 'FaBolt',
    title: 'Performance Optimization',
    short: 'Auditing code, minifying bundles, caching databases, and securing 95+ Lighthouse scores.',
    bullets: [
      'React component memoization and code splitting protocols.',
      'MongoDB pipeline optimizations, caching with Redis cache stores.',
      'Optimizing bundle sizes by purging dead code modules.',
      'Configuring lazy-loading modules for assets and canvases.'
    ],
    stack: 'Webpack, Vite, Lighthouse, Redis'
  },
  {
    icon: 'FaRocket',
    title: 'High-Converting Landing Pages',
    short: 'Crafting visually stunning, interactive marketing pages with fluid animations.',
    bullets: [
      'Glow backdrops, responsive grid setups, and custom styles.',
      'Lenis smooth scroll integration and particle elements.',
      'Micro hover sways, entrance transitions, and slider components.',
      'Optimized SEO meta-headers, canonical structures, and open-graph keys.'
    ],
    stack: 'Tailwind CSS, Framer Motion, HTML5'
  },
  {
    icon: 'FaExchangeAlt',
    title: 'API Design & Integration',
    short: 'Constructing robust Node.js and Express backend servers with secure endpoints.',
    bullets: [
      'REST API route layouts and request controllers.',
      'MongoDB model layouts, indexing, and mongoose data validators.',
      'Robust JWT-based security middleware and password encrypt algorithms.',
      'Realtime notification setups powered by Socket.io events.'
    ],
    stack: 'Node.js, Express, MongoDB, WebSockets'
  },
  {
    icon: 'FaPaintBrush',
    title: 'UI/UX Design Engineering',
    short: 'Transforming mockup layouts into responsive code matching exact visual styles.',
    bullets: [
      'Converting Figma layout blueprints into responsive Tailwind components.',
      'Integrating dark theme controls and customizable styling tokens.',
      'Pixel-perfect compliance across mobile, tablet, and wide monitors.',
      'Configuring custom font packs, weights, and spacing guidelines.'
    ],
    stack: 'Figma, Tailwind CSS, Typography'
  },
  {
    icon: 'FaTools',
    title: 'Website Redesigns',
    short: 'Migrating obsolete frontend pages to modular React code with zero operational downtime.',
    bullets: [
      'Mapping old routes to optimized React Router configurations.',
      'Upgrading plain CSS styling sheets to dynamic Tailwind utilities.',
      'Decoupling heavy calculations into isolated backend controllers.',
      'Refining forms validation and lead routing pathways.'
    ],
    stack: 'Node.js, React, Mongoose, Express'
  }
];

export default function Services() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>(fallbackServices);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await axios.get('/api/services');
        if (response.data && response.data.length > 0) {
          setServices(response.data.map((s: any) => ({
            icon: s.icon,
            title: s.name,
            short: s.description,
            bullets: [],
            stack: 'Dynamic Service'
          })));
        }
      } catch (err) {
        console.log('Using local fallback services.');
      }
    };
    loadServices();
  }, []);

  const toggleExpand = (idx: number) => {
    if (expandedIndex === idx) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(idx);
    }
  };

  return (
    <section id="services" className="relative z-10 py-24 px-6 bg-primary-light/10">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-sans text-xs font-bold tracking-widest text-accent-cyan uppercase mb-3">
            Expertise
          </h2>
          <h3 className="font-sans text-3xl font-extrabold tracking-tight sm:text-5xl">
            Premium Design & Engineering
          </h3>
          <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => {
            const Icon = iconMap[service.icon] || FaCode;
            const isExpanded = expandedIndex === idx;

            return (
              <motion.div
                layout
                key={service.title}
                onClick={() => toggleExpand(idx)}
                className={`glassmorphism rounded-3xl p-8 cursor-pointer relative overflow-hidden transition-all duration-300 border ${
                  isExpanded 
                    ? 'border-accent-blue/50 shadow-glow-blue' 
                    : 'border-white/5 hover:border-white/20'
                }`}
                whileHover={{ y: isExpanded ? 0 : -5 }}
              >
                {/* Visual Glow Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Header: Icon & Toggle button */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-cyan">
                        <Icon size={22} />
                      </div>
                      <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-text-secondary border border-white/10">
                        {isExpanded ? <FaMinus size={12} /> : <FaPlus size={12} />}
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-sans text-xl font-bold text-white mb-3">
                      {service.title}
                    </h4>

                    {/* Short Description */}
                    <p className="font-sans text-sm text-text-secondary leading-relaxed mb-4">
                      {service.short}
                    </p>

                    {/* Expanded bullet details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <ul className="space-y-2 border-t border-white/10 pt-4 mt-4 text-xs text-text-secondary font-sans">
                            {service.bullets.map((bullet: string, bIdx: number) => (
                              <li key={bIdx} className="flex items-start space-x-2">
                                <span className="text-accent-cyan mt-1">•</span>
                                <span className="leading-relaxed">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Tech stack badge footer */}
                  <div className="mt-6 border-t border-white/5 pt-4">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-text-secondary bg-white/5 rounded-full px-3 py-1.5 border border-white/5">
                      {service.stack}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
