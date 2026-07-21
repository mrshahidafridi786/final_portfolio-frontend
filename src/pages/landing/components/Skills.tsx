import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaReact, FaNodeJs, FaGithub, FaDocker, FaAws, FaHtml5, FaCss3Alt 
} from 'react-icons/fa';
import { 
  SiTypescript, SiTailwindcss, SiExpress, SiMongodb, 
  SiPostgresql, SiRedis, SiVercel, SiPostman, SiSocketdotio,
  SiExpo
} from 'react-icons/si';
import { TbBrandFramerMotion, TbHexagon3D, TbBrandReactNative } from 'react-icons/tb';

// Dynamic icon mapping table
const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  FaReact,
  SiTypescript,
  SiTailwindcss,
  TbBrandFramerMotion,
  TbHexagon3D,
  FaNodeJs,
  SiExpress,
  SiPostman,
  SiSocketdotio,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  FaGithub,
  FaDocker,
  FaAws,
  SiVercel,
  TbBrandReactNative,
  SiExpo,
  FaHtml5,
  FaCss3Alt
};

interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'other';
  level: number;
  iconName: string;
}

const fallbackSkills: Skill[] = [
  // Frontend
  { name: 'HTML5', category: 'frontend', level: 95, iconName: 'FaHtml5' },
  { name: 'CSS3', category: 'frontend', level: 95, iconName: 'FaCss3Alt' },
  { name: 'React', category: 'frontend', level: 95, iconName: 'FaReact' },
  { name: 'React Native', category: 'frontend', level: 90, iconName: 'TbBrandReactNative' },
  { name: 'Expo', category: 'frontend', level: 85, iconName: 'SiExpo' },
  { name: 'TypeScript', category: 'frontend', level: 90, iconName: 'SiTypescript' },
  { name: 'Tailwind CSS', category: 'frontend', level: 95, iconName: 'SiTailwindcss' },
  { name: 'Framer Motion', category: 'frontend', level: 85, iconName: 'TbBrandFramerMotion' },
  { name: 'Three.js / R3F', category: 'frontend', level: 80, iconName: 'TbHexagon3D' },
  // Backend
  { name: 'Node.js', category: 'backend', level: 92, iconName: 'FaNodeJs' },
  { name: 'Express', category: 'backend', level: 90, iconName: 'SiExpress' },
  { name: 'REST APIs', category: 'backend', level: 95, iconName: 'SiPostman' },
  { name: 'Socket.io', category: 'backend', level: 85, iconName: 'SiSocketdotio' },
  // Database
  { name: 'MongoDB', category: 'database', level: 90, iconName: 'SiMongodb' },
  { name: 'PostgreSQL', category: 'database', level: 82, iconName: 'SiPostgresql' },
  { name: 'Redis', category: 'database', level: 75, iconName: 'SiRedis' },
  // Tools
  { name: 'Git & GitHub', category: 'tools', level: 90, iconName: 'FaGithub' },
  { name: 'Docker', category: 'tools', level: 78, iconName: 'FaDocker' },
  { name: 'AWS (S3/EC2)', category: 'tools', level: 75, iconName: 'FaAws' },
  { name: 'Vercel / Render', category: 'tools', level: 92, iconName: 'SiVercel' }
];

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills);
  const [activeTab, setActiveTab] = useState<'all' | 'frontend' | 'backend' | 'database' | 'tools'>('all');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setSkills(data);
          }
        }
      } catch (err) {
        console.warn('API error fetching skills. Falling back to local values.', err);
      }
    };
    fetchSkills();
  }, []);

  const filteredSkills = skills.filter((skill) => {
    if (activeTab === 'all') return true;
    return skill.category === activeTab;
  });

  const categories = [
    { key: 'all', label: 'All Technologies' },
    { key: 'frontend', label: 'Frontend UI' },
    { key: 'backend', label: 'Backend API' },
    { key: 'database', label: 'Databases' },
    { key: 'tools', label: 'DevOps & Tools' }
  ];

  return (
    <section id="skills" className="relative z-10 py-24 px-6 bg-[#050816]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-sans text-xs font-bold tracking-widest text-accent-cyan uppercase mb-3">
            My Toolbox
          </h2>
          <h3 className="font-sans text-3xl font-extrabold tracking-tight sm:text-5xl">
            Skills & Core Technologies
          </h3>
          <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key as any)}
              className={`rounded-full px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                activeTab === cat.key
                  ? 'bg-gradient-to-r from-accent-blue to-accent-cyan text-white border-transparent shadow-glow-blue'
                  : 'bg-white/5 text-text-secondary border-white/5 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
        >
          {filteredSkills.map((skill, idx) => {
            const IconComponent = iconMap[skill.iconName] || FaReact;
            return (
              <motion.div
                layout
                key={skill.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                className="glassmorphism rounded-2xl p-6 relative overflow-hidden group shadow-glass-sm border border-white/5 hover:border-accent-blue/30 transition-all duration-300 hover:shadow-glow-blue"
              >
                {/* Micro hover background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Rotating Animated Icon container */}
                  <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary group-hover:text-accent-cyan group-hover:scale-110 group-hover:border-accent-cyan/35 transition-all duration-300">
                    <IconComponent className="animate-spin-slow group-hover:animate-none" size={24} />
                  </div>

                  {/* Skill Name */}
                  <h4 className="font-sans font-bold text-white text-sm tracking-wide">
                    {skill.name}
                  </h4>

                  {/* Level Slider Bar */}
                  <div className="w-full space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                      <span>Proficiency</span>
                      <span className="text-white">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
