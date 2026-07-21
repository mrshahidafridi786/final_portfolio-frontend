import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsLoaded(true);
            setTimeout(onComplete, 600); // Wait for exit animations
          }, 400);
          return 100;
        }
        // Rapid loading progress simulation
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050816]"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -100,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* Glowing center emblem */}
          <div className="relative mb-8 flex items-center justify-center">
            {/* Pulsing ring */}
            <motion.div 
              className="absolute h-24 w-24 rounded-full border border-accent-blue/30"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            {/* Spinning hexagon outer */}
            <motion.div 
              className="absolute h-20 w-20 rounded-xl border border-accent-purple/40"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            />
            
            {/* Center Logo text initials */}
            <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light border border-white/10 shadow-glow-blue">
              <span className="font-sans text-2xl font-bold tracking-tight text-white">SA</span>
            </div>
          </div>

          {/* Loading status text */}
          <motion.div 
            className="mb-4 text-sm font-medium tracking-widest text-text-secondary uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Engineering Premium Experience
          </motion.div>

          {/* Loading Progress Bar */}
          <div className="relative h-[2px] w-64 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-purple"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>

          {/* Progress Percent Counter */}
          <motion.div 
            className="mt-3 font-sans text-xl font-bold tracking-wide text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {progress}%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
