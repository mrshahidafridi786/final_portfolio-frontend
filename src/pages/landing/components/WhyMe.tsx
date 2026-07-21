import { FaLaptopCode, FaServer, FaComments, FaBuffer } from 'react-icons/fa';

const valuesData = [
  {
    icon: FaLaptopCode,
    title: 'Pixel-Perfect UI Execution',
    description: 'Converting structural designs into modular Tailwind CSS layouts. Verify sizing scales, hover states, and font variables to ensure complete fidelity.'
  },
  {
    icon: FaServer,
    title: 'Scalable MVC Architecture',
    description: 'Separating route controllers, mongoose schemas, middleware validations, and db helpers. Write type-safe TypeScript interfaces to avoid syntax failures.'
  },
  {
    icon: FaBuffer,
    title: 'Database Optimization & Security',
    description: 'Structuring MongoDB schemas with explicit indexing, projection pipelines, and caching. Implement JWT tokens, encrypted credentials, and CORS origins.'
  },
  {
    icon: FaComments,
    title: 'Clear, Client-Driven Communication',
    description: 'Setting clear development phases, updating tasks check-sheets, and delivering documentation walkthroughs. Make complex code logic clear and auditable.'
  }
];

export default function WhyMe() {
  return (
    <section id="whyme" className="relative z-10 py-24 px-6 bg-primary-light/5">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-sans text-xs font-bold tracking-widest text-accent-cyan uppercase mb-3">
            Value Proposition
          </h2>
          <h3 className="font-sans text-3xl font-extrabold tracking-tight sm:text-5xl">
            Why Hire Me
          </h3>
          <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {valuesData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glassmorphism rounded-3xl p-8 border border-white/5 hover:border-accent-purple/30 shadow-glass-sm hover:shadow-glow-purple transition-all duration-300 flex space-x-6 items-start group"
              >
                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-purple flex-shrink-0 group-hover:bg-gradient-to-tr group-hover:from-accent-blue group-hover:to-accent-purple group-hover:text-white transition-all duration-300">
                  <Icon size={20} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-sans text-lg font-bold text-white">
                    {item.title}
                  </h4>
                  <p className="font-sans text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
