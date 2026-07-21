import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaExternalLinkAlt } from 'react-icons/fa';

interface CodeSnippet {
  title: string;
  code: string;
  language: string;
}

interface Project {
  _id?: string;
  title: string;
  description: string;
  heroImage: string;
  gallery: string[];
  category: string;
  technologies: string[];
  liveLink?: string;
  githubLink?: string;
  problem: string;
  solution: string;
  responsibilities: string[];
  features: string[];
  results: string;
  challenge: string;
  research: string;
  planning: string;
  wireframes?: string;
  designDecisions: string;
  developmentProcess: string;
  architecture: string;
  codeSnippets: CodeSnippet[];
  performance: string;
  lessonsLearned: string;
}

const fallbackProjects: Project[] = [
  {
    title: 'LocalTalent',
    description: 'A premium MERN stack marketplace connecting local service professionals with neighborhood clients, featuring direct peer-to-peer connections.',
    heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Full Stack Web App',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Vite', 'TypeScript'],
    liveLink: 'https://local-talent-frontend.vercel.app',
    githubLink: 'https://github.com/mrshahidafridi786/local-talent',
    problem: 'Traditional gig platforms impose high booking commissions (often 15-20%) on local service providers like electricians, painters, and barbers, reducing their margins and inflating costs for clients.',
    solution: 'Engineered a commission-free local services marketplace (LocalTalent) built on the MERN stack. Providers register directly, and clients filter services by city and category to initiate zero-fee contracts.',
    responsibilities: [
      'Designed scalable MongoDB search indexes to filter providers by category, city, and ratings.',
      'Developed Express route controllers managing provider listings and profile details.',
      'Built responsive frontend search widgets and glassmorphic listings cards in React + Tailwind CSS.',
      'Integrated light/dark theme switches and clean user flow paths for registration.'
    ],
    features: [
      'Direct peer-to-peer connection without intermediary brokers.',
      'Advanced city and service-category search queries.',
      'Interactive service provider register workflow.',
      'Light/dark mode aesthetics matching modern web standards.'
    ],
    results: 'Eliminated transaction commission fees, allowing service providers to retain 100% of their earnings. Boosted local provider discovery by 35% in targeted neighborhoods.',
    challenge: 'Configuring low-latency responsive filtering across thousands of provider listings while maintaining clean component re-renders on the client thread.',
    research: 'Analyzed query indexing strategies in MongoDB Mongoose and benchmarked throttled keyboard listeners in the search input.',
    planning: 'Mapped database schema structures connecting clients, reviews, and provider listing indexes to allow fast aggregations.',
    wireframes: 'Modular components: Search Bar -> Category Icons Grid -> Providers Results List -> Detailed Profile Cards.',
    designDecisions: 'Used a clean minimalist interface with floating glass cards and vibrant purple accents to command trust and modern usability.',
    developmentProcess: 'Engineered backend database controllers, tested search endpoint filters, integrated the React client dashboard views, and styled UI responsive layers.',
    architecture: 'Standard MVC architecture. Client communicates with Node/Express REST API. Database query results are mapped via Mongoose schemas.',
    codeSnippets: [
      {
        title: 'MongoDB Query Filter Endpoint',
        code: `router.get('/providers/search', async (req, res) => {
  const { city, category, query } = req.query;
  const filter: any = {};
  
  if (city) filter.city = city;
  if (category) filter.category = category;
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: 'i' } },
      { bio: { $regex: query, $options: 'i' } }
    ];
  }
  
  const providers = await Provider.find(filter).sort({ rating: -1 });
  res.json(providers);
});`,
        language: 'typescript'
      }
    ],
    performance: 'Average page rendering: <1.2s. 98% Lighthouse performance rating. Database search queries: <10ms response.',
    lessonsLearned: 'Throttling search inputs and indexing text fields in MongoDB is critical to maintaining fast response speeds as provider listings grow.'
  }
];

// Project Card with 3D Mouse Tilt and Hover Glow
function ProjectCard({ project }: { project: Project }) {
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt limit to max 8 degrees
    const rotateX = ((centerY - y) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  };

  const targetLink = project.liveLink || project.githubLink || '#';
  const hasLink = targetLink !== '#';

  return (
    <motion.a
      href={targetLink}
      target={hasLink ? "_blank" : undefined}
      rel={hasLink ? "noopener noreferrer" : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
      className="glassmorphism rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-accent-blue/30 shadow-glass-sm transition-all duration-200 hover:shadow-glow-blue flex flex-col h-full group"
    >
      {/* Hero Image wrapper */}
      <div className="relative h-56 overflow-hidden border-b border-white/5">
        <img
          src={project.heroImage}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] to-transparent opacity-60" />
        
        {/* Overlay hover action */}
        {targetLink !== '#' && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-tr from-accent-blue to-accent-cyan text-white shadow-glow-blue px-5 py-2.5 font-sans text-xs font-bold transition-all">
              <FaExternalLinkAlt size={14} />
              <span>Visit Live Website</span>
            </div>
          </div>
        )}
      </div>

      {/* Description wrapper */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-accent-cyan bg-accent-cyan/10 rounded-full px-3 py-1 border border-accent-cyan/20">
              {project.category}
            </span>
            {project.liveLink && (
              <span className="flex items-center gap-1.5 font-sans text-xs font-bold text-accent-cyan group-hover:text-white transition-colors">
                <span>Live Demo</span>
                <FaExternalLinkAlt size={10} />
              </span>
            )}
          </div>
          <h4 className="font-sans text-xl font-extrabold text-white mt-3 mb-2">
            {project.title}
          </h4>
          <p className="font-sans text-sm text-text-secondary leading-relaxed mb-4">
            {project.description}
          </p>
        </div>

        {/* badge technologies footer */}
        <div className="border-t border-white/5 pt-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="font-sans text-[10px] font-semibold text-text-secondary bg-white/5 rounded-full px-2.5 py-1 border border-white/5"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="font-sans text-[10px] font-semibold text-text-secondary bg-white/5 rounded-full px-2.5 py-1">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setProjects(data);
          }
        }
      } catch (err) {
        console.warn('API error fetching projects. Falling back to local data.', err);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['All', 'Full Stack Web App', 'Frontend', 'Realtime Systems', 'E-Commerce Development'];

  const filteredProjects = projects.filter((proj) => {
    const matchesCategory = selectedCategory === 'All' || proj.category === selectedCategory;
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="relative z-10 py-24 px-6 bg-[#050816]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-sans text-xs font-bold tracking-widest text-accent-cyan uppercase mb-3">
            Portfolio
          </h2>
          <h3 className="font-sans text-3xl font-extrabold tracking-tight sm:text-5xl">
            Featured Projects
          </h3>
          <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
        </div>

        {/* Filters and search box */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-accent-blue to-accent-cyan text-white border-transparent shadow-glow-blue'
                    : 'bg-white/5 text-text-secondary border-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {cat === 'All' ? 'All Projects' : cat}
              </button>
            ))}
          </div>

          {/* Search box input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search project or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-3 font-sans text-xs text-white placeholder-text-secondary outline-none focus:border-accent-blue focus:shadow-glow-blue transition-all"
            />
            <FaSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
            />
          ))}
        </div>

        {/* Empty status message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 font-sans text-text-secondary">
            No projects matched your search criteria. Try a different technology term.
          </div>
        )}
      </div>
    </section>
  );
}
