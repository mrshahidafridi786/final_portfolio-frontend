import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearchMinus, FaCalendarAlt, FaPalette, FaTerminal, FaVial, FaCloudUploadAlt, FaWrench, FaChevronDown 
} from 'react-icons/fa';

const processSteps = [
  {
    phase: '01',
    icon: FaSearchMinus,
    title: 'Discovery',
    short: 'Understanding your business goal, target audience, and engineering constraints.',
    details: 'Through active meetings and requirements analysis, we outline what needs to be engineered. We map business logic, study APIs that need data integration, and align on project priorities.'
  },
  {
    phase: '02',
    icon: FaCalendarAlt,
    title: 'Planning',
    short: 'Defining folder structures, modeling database schemas, and wireframing state architectures.',
    details: 'Before writing code, we draft entity-relationship diagrams (ERDs) for MongoDB, set up Vite proxy routes, and map state flow models to ensure long-term codebase scale.'
  },
  {
    phase: '03',
    icon: FaPalette,
    title: 'Design UI',
    short: 'Transforming layouts into glassmorphic, responsive, and animated user interface systems.',
    details: 'We build consistent styling tokens, tailwind configurations, custom fonts, and motion keyframes. All interface components are coded with absolute pixel-precision across mobile and wide screens.'
  },
  {
    phase: '04',
    icon: FaTerminal,
    title: 'Development',
    short: 'Writing clean, modular React components and secure Node.js controllers.',
    details: 'Developing iteratively. We build schema models, Express endpoints, write custom hooks, and wire socket connections. Every file uses strict TypeScript typing boundaries.'
  },
  {
    phase: '05',
    icon: FaVial,
    title: 'Testing',
    short: 'Validating form logic, tracking API response speeds, and debugging state updates.',
    details: 'We execute build scripts, test form inputs with validation constraints, verify MongoDB queries are running within 15ms limit, and inspect responsiveness sways.'
  },
  {
    phase: '06',
    icon: FaCloudUploadAlt,
    title: 'Deployment',
    short: 'Hosting database servers and deploying static frontend bundles with CDN caching.',
    details: 'Deploying backend APIs on production hosting environments (such as Render or Heroku) and frontend bundles to Vercel/Netlify. We set up SSL, MongoDB Atlas connection profiles, and environment keys.'
  },
  {
    phase: '07',
    icon: FaWrench,
    title: 'Maintenance',
    short: 'Monitoring database growth, updating dependencies, and implementing follow-up features.',
    details: 'Providing post-launch operational support. We tune MongoDB indexing configurations, scale server caches, and implement feedback modules to support business scaling.'
  }
];

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="relative z-10 py-24 px-6 bg-[#050816]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-sans text-xs font-bold tracking-widest text-accent-cyan uppercase mb-3">
            Workflow
          </h2>
          <h3 className="font-sans text-3xl font-extrabold tracking-tight sm:text-5xl">
            My Development Process
          </h3>
          <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
        </div>

        {/* Timeline body wrapper */}
        <div className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-3 items-center">
          {/* Mobile Dropdown Selector */}
          <div className="block lg:hidden space-y-2">
            <label className="block font-sans text-xs font-bold uppercase tracking-wider text-accent-cyan">
              Select Process Phase:
            </label>
            <div className="relative">
              <select
                value={activeStep}
                onChange={(e) => setActiveStep(Number(e.target.value))}
                className="w-full rounded-2xl bg-[#0b1120] border border-white/20 p-4 font-sans text-sm font-bold text-white outline-none focus:border-accent-cyan shadow-glass-sm appearance-none cursor-pointer pr-10"
              >
                {processSteps.map((step, idx) => (
                  <option key={idx} value={idx} className="bg-[#050816] text-white py-2">
                    Phase {step.phase}: {step.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-accent-cyan">
                <FaChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Desktop Steps selector menu */}
          <div className="hidden lg:block lg:col-span-1 space-y-3">
            {processSteps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left rounded-2xl p-4 flex items-center space-x-4 border transition-all duration-300 ${
                    isActive
                      ? 'glassmorphism border-accent-blue/50 shadow-glow-blue bg-accent-blue/5'
                      : 'bg-white/5 border-transparent text-text-secondary hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
                    isActive 
                      ? 'bg-accent-blue border-transparent text-white shadow-glow-blue' 
                      : 'bg-white/5 border-white/10 text-text-secondary'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <span className="block font-sans text-[10px] font-bold text-accent-cyan uppercase">
                      Phase {step.phase}
                    </span>
                    <span className="font-sans font-bold text-sm text-white">
                      {step.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step detail presentation display */}
          <div className="lg:col-span-2 glassmorphism rounded-3xl p-8 border border-white/10 relative shadow-glass-md min-h-[300px] flex flex-col justify-center overflow-hidden">
            {/* Pulsating background watermark */}
            <div className="absolute right-8 bottom-0 font-sans text-9xl font-extrabold text-white/5 select-none pointer-events-none">
              {processSteps[activeStep].phase}
            </div>

            {(() => {
              const ActiveIcon = processSteps[activeStep].icon;
              return (
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="space-y-4 relative z-10"
                >
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-accent-blue to-accent-cyan text-white shadow-glow-blue mb-4">
                    <ActiveIcon size={26} />
                  </div>

                  <h4 className="font-sans text-2xl font-extrabold text-white">
                    {processSteps[activeStep].title}
                  </h4>

                  <p className="font-sans text-base text-accent-cyan font-semibold">
                    {processSteps[activeStep].short}
                  </p>

                  <p className="font-sans text-sm text-text-secondary leading-relaxed max-w-xl">
                    {processSteps[activeStep].details}
                  </p>
                </motion.div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}
