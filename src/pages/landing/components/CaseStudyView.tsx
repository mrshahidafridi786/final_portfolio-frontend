import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaCheckCircle, FaAward, FaBolt, FaArrowLeft } from 'react-icons/fa';

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

interface CaseStudyViewProps {
  project: Project;
  onClose: () => void;
}

export default function CaseStudyView({ project, onClose }: CaseStudyViewProps) {
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Code snippet copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex justify-end bg-primary/80 backdrop-blur-md"
    >
      {/* Case Study Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        className="w-full lg:w-[65%] h-full bg-primary-light border-l border-white/10 overflow-y-auto px-6 pb-8 pt-0 md:px-12 flex flex-col shadow-2xl relative"
      >
        {/* Top Header: Navigation Controls */}
        <div className="sticky top-0 bg-primary-light/95 backdrop-blur-md z-30 flex items-center justify-between pb-4 border-b border-white/5 pt-8 mb-8">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 px-4 py-2 font-sans text-xs font-bold text-white transition-all transform hover:scale-105"
            aria-label="Back to Projects"
          >
            <FaArrowLeft className="text-accent-cyan" />
            <span>Back to Projects</span>
          </button>
          <div className="flex items-center space-x-2">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-accent-cyan bg-accent-cyan/15 rounded-full px-3 py-1">
              Case Study
            </span>
            <span className="font-sans text-xs text-text-secondary hidden sm:inline">/ {project.category}</span>
          </div>
        </div>

        {/* Hero image and titles */}
        <div className="space-y-6 mb-10">
          <h2 className="font-sans text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
            {project.title}
          </h2>
          <p className="font-sans text-lg text-text-secondary leading-relaxed max-w-3xl">
            {project.description}
          </p>

          {/* Banner Hero Image */}
          <div className="relative h-64 sm:h-[400px] w-full rounded-2xl overflow-hidden border border-white/10">
            <img
              src={project.heroImage}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-light via-transparent to-transparent" />
          </div>

          {/* Links and tech stacks */}
          <div className="flex flex-wrap gap-4 items-center justify-between border-b border-white/5 pb-8">
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-sans text-xs font-semibold text-text-secondary bg-white/5 rounded-full px-3 py-1 border border-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex space-x-3">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-2.5 font-sans text-xs font-bold text-white transition-all"
                >
                  <FaGithub />
                  <span>GitHub</span>
                </a>
              )}
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan hover:shadow-glow-blue px-5 py-2.5 font-sans text-xs font-bold text-white transition-all"
                >
                  <FaExternalLinkAlt />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Narrative Modules */}
        <div className="space-y-12 font-sans text-base leading-relaxed text-text-secondary pb-16">
          {/* Executive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-white/5 pb-8">
            <div>
              <h3 className="font-bold text-white text-lg mb-3">The Problem</h3>
              <p className="text-sm">{project.problem}</p>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-3">The Solution</h3>
              <p className="text-sm">{project.solution}</p>
            </div>
          </div>

          {/* Responsibilities and features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-white/5 pb-8">
            <div>
              <h3 className="font-bold text-white text-lg mb-3">Responsibilities</h3>
              <ul className="space-y-2 text-sm">
                {project.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <FaCheckCircle className="text-accent-blue mt-1 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-3">Core Features</h3>
              <ul className="space-y-2 text-sm">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <FaCheckCircle className="text-accent-purple mt-1 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Details sections */}
          <div>
            <h3 className="font-bold text-white text-xl mb-3">The Technical Challenge</h3>
            <p className="text-sm">{project.challenge}</p>
          </div>

          <div>
            <h3 className="font-bold text-white text-xl mb-3">Research & User Discovery</h3>
            <p className="text-sm">{project.research}</p>
          </div>

          <div>
            <h3 className="font-bold text-white text-xl mb-3">Architecture & Planning</h3>
            <p className="text-sm mb-6">{project.planning}</p>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs text-accent-cyan leading-relaxed">
              {project.architecture}
            </div>
          </div>

          {/* Design decisions and wireframes */}
          <div>
            <h3 className="font-bold text-white text-xl mb-3">Design Decisions</h3>
            <p className="text-sm">{project.designDecisions}</p>
            {project.wireframes && (
              <p className="text-xs text-text-secondary mt-3 italic">
                Wireframe context: {project.wireframes}
              </p>
            )}
          </div>

          {/* Code Snippets showcase */}
          {project.codeSnippets && project.codeSnippets.length > 0 && (
            <div>
              <h3 className="font-bold text-white text-xl mb-4">Core Code Implementation</h3>
              <div className="space-y-6">
                {project.codeSnippets.map((snip, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/10 bg-[#050816] overflow-hidden">
                    <div className="bg-white/5 px-4 py-3 flex justify-between items-center border-b border-white/5">
                      <span className="text-xs font-bold text-white">{snip.title}</span>
                      <button
                        onClick={() => handleCopyCode(snip.code)}
                        className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono text-white/80 overflow-x-auto leading-relaxed max-h-72">
                      <code>{snip.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics result and performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <FaBolt className="text-accent-cyan" />
                <span>Performance Audit</span>
              </h4>
              <p className="text-xs">{project.performance}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <FaAward className="text-accent-purple" />
                <span>Business Results</span>
              </h4>
              <p className="text-xs">{project.results}</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white text-xl mb-3">Lessons Learned</h3>
            <p className="text-sm">{project.lessonsLearned}</p>
          </div>

          {/* Project Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div>
              <h3 className="font-bold text-white text-xl mb-4">Gallery Screenshots</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.gallery.map((img, idx) => (
                  <div key={idx} className="h-44 rounded-xl overflow-hidden border border-white/5">
                    <img
                      src={img}
                      alt={`${project.title} screenshot ${idx + 1}`}
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
