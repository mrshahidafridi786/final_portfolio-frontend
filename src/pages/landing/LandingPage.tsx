import { useState } from 'react';
import Loader from '../../components/common/Loader';
import Navbar from '../../components/common/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Services from './components/Services';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import Process from './components/Process';
import WhyMe from './components/WhyMe';
import Achievements from './components/Achievements';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from '../../components/common/Footer';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <Loader onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="relative min-h-screen bg-[#050816] text-[#ffffff] overflow-x-hidden antialiased">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Skills />
            <Services />
            <Projects />
            <Testimonials />
            <Process />
            <WhyMe />
            <Achievements />
            <Blog />
            <Contact />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
