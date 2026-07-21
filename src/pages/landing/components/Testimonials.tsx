import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

const fallbackTestimonials: Testimonial[] = [
  {
    name: 'Sarah Jenkins',
    role: 'Founder & CEO',
    company: 'OptimaSaaS',
    content: 'Shahid transformed our slow dashboards into a lightning-fast experience. His MERN stack and UI design capabilities are absolute world-class. Our active user engagement increased by 30% after launch.',
    rating: 5
  },
  {
    name: 'David Chen',
    role: 'Lead Architect',
    company: 'NexusFlow',
    content: 'Working with Shahid was exceptional. He writes clean, modular code, respects deadlines, and brought our complex collaborative drawing editor to life in record time. His attention to smooth animations is unmatched.',
    rating: 5
  },
  {
    name: 'Amara Okafor',
    role: 'Product VP',
    company: 'Veloce Retail',
    content: 'Shahid engineered our high-traffic storefront from scratch. The transition to a modular MongoDB schema and React architecture solved all our data sync problems. A true senior engineer who gets business goals.',
    rating: 5
  }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setTestimonials(data);
          }
        }
      } catch (err) {
        console.warn('API error fetching testimonials. Using local values.', err);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto-play timer
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [currentIndex, testimonials.length]);

  const handlePrev = () => {
    setSlideDirection('left');
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSlideDirection('right');
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.5, ease: 'easeIn' },
    }),
  };

  const activeTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="relative z-10 py-24 px-6 bg-primary-light/5">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-sans text-xs font-bold tracking-widest text-accent-cyan uppercase mb-3">
            Endorsements
          </h2>
          <h3 className="font-sans text-3xl font-extrabold tracking-tight sm:text-5xl">
            What Clients Say
          </h3>
          <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
        </div>

        {/* Carousel Slider Panel */}
        <div className="relative glassmorphism rounded-3xl p-8 md:p-12 shadow-glass-md min-h-[320px] flex flex-col justify-between overflow-hidden">
          <FaQuoteLeft className="absolute top-8 left-8 text-accent-blue/15" size={80} />

          <div className="relative z-10">
            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
              {activeTestimonial && (
                <motion.div
                  key={currentIndex}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Rating Stars */}
                  <div className="flex space-x-1 text-yellow-400">
                    {[...Array(activeTestimonial.rating)].map((_, i) => (
                      <FaStar key={i} size={14} />
                    ))}
                  </div>

                  {/* Feedback Content */}
                  <p className="font-sans text-base md:text-xl italic text-white/95 leading-relaxed">
                    "{activeTestimonial.content}"
                  </p>

                  {/* Client Info */}
                  <div className="border-t border-white/5 pt-4">
                    <h4 className="font-sans font-bold text-white tracking-wide text-sm">
                      {activeTestimonial.name}
                    </h4>
                    <p className="font-sans text-xs text-text-secondary mt-0.5">
                      {activeTestimonial.role}, <span className="text-accent-cyan">{activeTestimonial.company}</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Slider Controls Footer */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/5 relative z-10">
            {/* Dots Indicator */}
            <div className="flex space-x-1.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSlideDirection(idx > currentIndex ? 'right' : 'left');
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-6 bg-accent-cyan' : 'w-2 bg-white/10'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Nav Arrows */}
            <div className="flex space-x-3">
              <button
                onClick={handlePrev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-secondary hover:text-white hover:border-white/20 transition-all"
                aria-label="Previous Review"
              >
                <FaChevronLeft size={14} />
              </button>
              <button
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-secondary hover:text-white hover:border-white/20 transition-all"
                aria-label="Next Review"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
