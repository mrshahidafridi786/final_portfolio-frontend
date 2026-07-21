import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaBookOpen } from 'react-icons/fa';

interface Blog {
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  slug: string;
  isComingSoon: boolean;
}

const fallbackBlogs: Blog[] = [
  {
    title: 'Optimizing MongoDB Aggregations for Realtime React Apps',
    excerpt: 'Deep dive into caching strategies, projection tuning, and query indexing to achieve sub-10ms dashboard loads.',
    readTime: '6 min read',
    date: 'July 10, 2026',
    slug: 'optimizing-mongodb-aggregations',
    isComingSoon: false
  },
  {
    title: 'Building Interactive Canvas Interfaces with React and Socket.io',
    excerpt: 'A comprehensive step-by-step guide to synchronizing complex vectors across clients with minimal network overhead.',
    readTime: '8 min read',
    date: 'June 24, 2026',
    slug: 'interactive-canvas-react-socketio',
    isComingSoon: false
  },
  {
    title: 'Designing Fluid Micro-Interactions in React using Framer Motion',
    excerpt: 'How small layout-animations, smooth hover states, and spring dynamics create a premium feeling of trust.',
    readTime: '4 min read',
    date: 'Coming Soon',
    slug: 'designing-fluid-microinteractions',
    isComingSoon: true
  }
];

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>(fallbackBlogs);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setBlogs(data);
          }
        }
      } catch (err) {
        console.warn('API error fetching blogs. Falling back to local values.', err);
      }
    };
    fetchBlogs();
  }, []);

  const handleBlogClick = (blog: Blog) => {
    if (blog.isComingSoon) {
      alert("This article is coming soon! Shahid is actively drafting this piece.");
    } else {
      alert(`Opening blog article: "${blog.title}". Full article detail pages are ready for integration!`);
    }
  };

  return (
    <section id="blog" className="relative z-10 py-24 px-6 bg-primary-light/5">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-sans text-xs font-bold tracking-widest text-accent-cyan uppercase mb-3">
            Articles
          </h2>
          <h3 className="font-sans text-3xl font-extrabold tracking-tight sm:text-5xl">
            Latest Articles & Blog
          </h3>
          <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => {
            return (
              <motion.div
                key={blog.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => handleBlogClick(blog)}
                className={`glassmorphism rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between min-h-[250px] relative ${
                  blog.isComingSoon 
                    ? 'border-white/5 opacity-70 select-none cursor-default' 
                    : 'border-white/5 hover:border-accent-blue/30 cursor-pointer hover:shadow-glow-blue hover:-translate-y-2'
                }`}
              >
                {/* Coming Soon blur layer */}
                {blog.isComingSoon && (
                  <div className="absolute inset-0 bg-[#050816]/10 backdrop-blur-[2px] rounded-3xl pointer-events-none" />
                )}

                <div className="space-y-4">
                  {/* Header: Date and Read time */}
                  <div className="flex justify-between items-center text-xs font-sans text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <FaClock size={12} className="text-accent-cyan" />
                      <span>{blog.date}</span>
                    </span>
                    {!blog.isComingSoon && (
                      <span className="flex items-center gap-1.5">
                        <FaBookOpen size={12} className="text-accent-purple" />
                        <span>{blog.readTime}</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="font-sans text-lg font-extrabold text-white leading-snug">
                    {blog.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="font-sans text-sm text-text-secondary leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                {/* Footer badge status */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  {blog.isComingSoon ? (
                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-accent-purple bg-accent-purple/15 border border-accent-purple/30 rounded-full px-3 py-1">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="font-sans text-xs font-bold text-accent-cyan group-hover:underline flex items-center gap-1.5">
                      <span>Read Article</span>
                      <span>→</span>
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
