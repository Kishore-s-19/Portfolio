// src/App.jsx
import React, { useState, useRef, useEffect, memo } from 'react';
import './index.css'; // Changed from App.css to index.css for Tailwind v4
import PaperShaderBackground from './assets/components/ShaderBackground/PaperShaderBackground.jsx';
import portraitImage from './assets/images/IMG_2566.PNG';
import FlowingMenu from './assets/components/FlowingMenu';
import SkillsSection from './assets/components/SkillsSection/SkillsSection';
import { FaInstagram, FaLinkedin, FaGithub, FaFacebook, FaDiscord } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { NaukriIcon } from './assets/components/LogoLoop/icon.jsx';

// Import LogoLoop correctly from the new file
import LogoLoop from './assets/components/LogoLoop/Logoloop.jsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MemoFlowingMenu = memo(FlowingMenu);
const MemoLogoLoop = memo(LogoLoop);

// Menu items data for FlowingMenu
const menuItems = [
  { text: 'Java', image: 'https://i.pinimg.com/736x/36/3e/ae/363eae82e52a8a5681622235ea4a38d7.jpg' },
  { text: 'Python', image: 'https://www.pngmart.com/files/23/Python-Logo-PNG-Image.png' },
  { text: 'MySQL', image: 'https://www.freepnglogos.com/uploads/logo-mysql-png/logo-mysql-development-mysql-logo-code-icon-9.png' },
  { text: 'GitHub', image: 'https://cdn-icons-png.flaticon.com/512/25/25231.png' },
  { text: 'SpringBoot', image: 'https://img.icons8.com/color/480/spring-logo.png' },
  { text: 'JavaScript', image: 'https://seekvectors.com/files/download/JAVASCRIPT%20Logo.png' },
  { text: 'React', image: 'https://www.agilesparks.com/wp-content/uploads/2021/08/react-1024x1024.png' },
  { text: 'PremierePro', image: 'https://vectorseek.com/wp-content/uploads/2022/02/Adobe-Premiere-Pro-Logo-Vector-768x768.jpg' }
];

import ecommerceImage from './assets/images/Screenshot 2025-12-12 002820.png';

// Project data with images
const projectsData = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'Personal portfolio to showcase my design and coding projects.',
    tags: ['HTML', 'CSS', 'React'],
    github: 'https://github.com/Kishore-s-19',
    live: 'https://live-demo.com',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Weather App',
    description: 'Responsive app showing real-time weather data using API integration.',
    tags: ['HTML', 'CSS', 'API', 'JavaScript'],
    github: 'https://github.com/Kishore-s-19',
    live: 'https://live-demo.com',
    image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'E-commerce Platform',
    description: 'Full-featured online store with cart, checkout, and payment integration.',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    github: 'https://github.com/Kishore-s-19',
    live: 'https://cfq33lpc-5500.inc1.devtunnels.ms/',
    image: ecommerceImage
  },
  {
    id: 4,
    title: 'Task Management App',
    description: 'Collaborative task management with real-time updates and team features.',
    tags: ['Vue.js', 'Firebase', 'WebSockets'],
    github: 'https://github.com/Kishore-s-19',
    live: 'https://live-demo.com',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

// Contact LogoLoop data (Social Media Icons)
const contactLogos = [
  { node: <FaInstagram style={{ color: '#E4405F', fontSize: '64px' }} />, title: "Instagram", href: "https://www.instagram.com/kishoree._.21/", ariaLabel: "Instagram Profile" },
  { node: <FaLinkedin style={{ color: '#0A66C2', fontSize: '64px' }} />, title: "LinkedIn", href: "https://www.linkedin.com/in/kishore-s-20a861224/", ariaLabel: "LinkedIn Profile" },
  { node: <SiGmail style={{ color: '#EA4335', fontSize: '64px' }} />, title: "Gmail", href: "mailto:youremail@gmail.com", ariaLabel: "Send Email" },
  { node: <FaGithub style={{ color: '#FFFFFF', fontSize: '64px' }} />, title: "GitHub", href: "https://github.com/Kishore-s-19", ariaLabel: "GitHub Profile" },
  { node: <NaukriIcon style={{ color: '#0B9B4D', fontSize: '64px' }} />, title: "Naukri", href: "https://www.naukri.com/mnjuser/profile?id=&altresid", ariaLabel: "Naukri Profile" },
  { node: <FaFacebook style={{ color: '#1877F2', fontSize: '64px' }} />, title: "Facebook", href: "https://facebook.com/yourusername", ariaLabel: "Facebook Profile" },
  { node: <FaDiscord style={{ color: '#5865F2', fontSize: '64px' }} />, title: "Discord", href: "https://discord.com/users/kishore6851", ariaLabel: "Discord Profile" }
];

const aboutLines = [
  "I'm just a 21 year old kid with a",
  "keyboard, a sketchpad, and an",
  "endless curiosity for the world. I code",
  "and develop softwares, and design",
  "like every pixel tells a story.",
  "", // Spacer
  "Tech isn't just what I do—it's how I see the world,",
  "a playground where I build, break, and reinvent.",
  "Adaptable? Always. Enthusiast? Absolutely."
];

function App() {
  const [showAboutPage, setShowAboutPage] = useState(false);
  const aboutPageRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const landingRef = useRef(null);
  const [isProjectsVisible, setIsProjectsVisible] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [isLandingVisible, setIsLandingVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [useShaderBackground, setUseShaderBackground] = useState(true);

  useEffect(() => {
    const detectWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        setUseShaderBackground(!!gl);
      } catch (e) {
        setUseShaderBackground(false);
      }
    };
    detectWebGL();

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    if (!showAboutPage) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.target === landingRef.current) setIsLandingVisible(entry.isIntersecting);
          if (entry.target === projectsRef.current && entry.isIntersecting) setIsProjectsVisible(true);
          if (entry.target === contactRef.current && entry.isIntersecting) setIsContactVisible(true);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    landingRef.current && observer.observe(landingRef.current);

    projectsRef.current && observer.observe(projectsRef.current);
    contactRef.current && observer.observe(contactRef.current);

    return () => observer.disconnect();
  }, [showAboutPage]);

  // GSAP Scroll Reveal for About Text
  useEffect(() => {
    if (!showAboutPage) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray('.reveal-word');

      gsap.to(words, {
        scrollTrigger: {
          trigger: aboutPageRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
        color: '#ffffff',
        opacity: 1,
        stagger: 0.1,
      });

      // Refresh ScrollTrigger after a short delay
      setTimeout(() => ScrollTrigger.refresh(), 500);
    }, aboutPageRef);

    return () => ctx.revert();
  }, [showAboutPage]);

  const handleLearnMoreClick = () => {
    setShowAboutPage(true);
    setTimeout(() => {
      aboutPageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setShowAboutPage(false);
      setIsProjectsVisible(false);
      setIsContactVisible(false);
    }, 600);
  };

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden bg-black font-commissioner">
      {/* Main Landing Page */}
      <section className="w-screen h-screen relative transition-opacity duration-700 overflow-hidden font-outfit" ref={landingRef}>
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
          {useShaderBackground && isLandingVisible ? <PaperShaderBackground /> : (
            <div className="absolute inset-0 w-full h-full bg-black bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,255,255,0.15)_0%,transparent_40%),radial-gradient(ellipse_at_80%_80%,rgba(255,255,255,0.12)_0%,transparent_40%),radial-gradient(ellipse_at_40%_20%,rgba(255,255,255,0.1)_0%,transparent_40%)] animate-pulse" />
          )}
        </div>

        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-white pointer-events-none">
          <div className="text-center flex flex-col items-center gap-10 pointer-events-auto">
            <h1 className="text-7xl md:text-8xl font-bold leading-tight m-0 bg-white bg-clip-text text-transparent animate-bounce-slow">
              Kishore S<br />Portfolio
            </h1>
            <button
              className="bg-white/10 border-2 border-white/30 text-white/90 py-4 px-12 rounded-full text-xl font-semibold cursor-pointer transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:-translate-y-1 backdrop-blur-md outline-none"
              onClick={handleLearnMoreClick}
            >
              About Me
            </button>
          </div>
        </div>
      </section>

      {showAboutPage && (
        <div className="opacity-0 animate-fade-in fill-mode-forwards">
          <section className="w-full min-h-screen relative bg-black" ref={aboutPageRef}>
            <div className="relative z-10 min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-[5%] max-w-[1400px] mx-auto gap-10 font-commissioner">
              <div className="flex-1 text-[26px] md:text-[32px] leading-snug font-medium tracking-wide max-w-[600px] pt-32 pb-10">
                {aboutLines.map((line, i) => (
                  line === "" ? <div key={i} className="h-8" /> : (
                    <p key={i} className="mb-2 overflow-hidden">
                      {line.split(' ').map((word, j) => (
                        <span key={j} className="reveal-word inline-block mr-2 opacity-20 text-white/20 transition-colors duration-300">
                          {word}
                        </span>
                      ))}
                    </p>
                  )
                ))}
              </div>

              <div className="w-full md:w-3/5 h-[90vh] flex justify-center items-center opacity-0 translate-x-24 scale-95 animate-portrait-in fill-mode-forwards relative">
                <div className="relative w-full max-h-[90vh] aspect-[4/5] overflow-hidden md:translate-x-12">
                  <div
                    className="w-full h-full"
                    style={{
                      maskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
                      WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
                      willChange: 'transform'
                    }}
                  >
                    <img src={portraitImage} alt="Portrait" className="w-full h-full object-cover grayscale brightness-90 contrast-110 transition-all duration-700 hover:scale-105" />
                  </div>
                  {/* Subtle edge glow/blend overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
                </div>
              </div>
            </div>
          </section>

          <button
            className="fixed bottom-10 right-10 bg-white/10 border-2 border-gray-400/70 text-gray-400/70 py-3 px-8 rounded-full text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:-translate-y-1 backdrop-blur-md z-[9999]"
            onClick={handleBackToTop}
          >
            Back to Top
          </button>

          <section className="w-screen py-10 relative bg-black z-20">
            <MemoFlowingMenu items={menuItems} />
          </section>

          <SkillsSection />

          <section className="w-full min-h-screen relative bg-black px-[5%] py-10 z-30 font-outfit" ref={projectsRef}>
            <div className="max-w-[1400px] mx-auto">
              <div className={`transition-all duration-1000 transform ${isProjectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} mb-10`}>
                <h2 className="text-6xl text-white mb-5 bg-white bg-clip-text text-transparent tracking-wider font-bold">Featured Work</h2>
                <p className="text-white/80 text-xl leading-relaxed max-w-3xl">
                  A showcase of my recent projects demonstrating expertise in full-stack,
                  digital creation, modular design, and scalable system solutions.
                </p>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 transition-all duration-1000 delay-300 transform ${isProjectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {projectsData.map((project, index) => (
                  <div key={project.id} className="max-w-[380px] mx-auto bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/40 hover:bg-white/10 transition-all duration-500 group">
                    <div className="relative w-full h-[220px] overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 opacity-70 group-hover:opacity-50 transition-opacity duration-500" />
                    </div>

                    <div className="p-6 flex-grow flex flex-col bg-black/50">
                      <div className="mb-5">
                        <h3 className="text-white text-2xl font-bold mb-3 tracking-wide">{project.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, i) => (
                            <span key={i} className="bg-white/15 text-white/90 py-1.5 px-3.5 rounded-xl text-xs font-medium border border-white/30 group-hover:border-white/50 group-hover:-translate-y-0.5 transition-all duration-300">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-white/80 leading-relaxed mb-6 text-sm">{project.description}</p>
                      <div className="flex gap-4 mt-auto">
                        <a href={project.github} className="flex items-center gap-2 text-white/70 py-2.5 px-5 border border-white/20 rounded-full text-xs transition-all duration-400 bg-white/5 hover:text-white hover:border-white/60 hover:bg-white/10 hover:-translate-y-0.5" target="_blank" rel="noopener noreferrer">
                          <span className="text-base transition-transform group-hover:rotate-6">⚡</span> GitHub
                        </a>
                        <a href={project.live} className="flex items-center gap-2 text-white/70 py-2.5 px-5 border border-white/20 rounded-full text-xs transition-all duration-400 bg-white/5 hover:text-white hover:border-white/60 hover:bg-white/10 hover:-translate-y-0.5" target="_blank" rel="noopener noreferrer">
                          <span className="text-base transition-transform group-hover:rotate-6">🌐</span> Live Demo
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full min-h-[80vh] px-[5%] py-10 bg-black relative z-40 font-outfit" ref={contactRef}>
            <div className="max-w-[1400px] mx-auto text-center">
              <div className={`transition-all duration-800 ${isContactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} mb-10`}>
                <h2 className="text-5xl md:text-6xl text-white mb-5 bg-white bg-clip-text text-transparent font-bold">Connect With Me</h2>
                <p className="text-white/70 text-lg leading-relaxed max-w-xl mx-auto">
                  Feel free to reach out through any of these platforms.
                </p>
              </div>

              <div className={`transition-all duration-800 delay-300 ${isContactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} h-30 overflow-hidden mb-10 px-4 md:px-40 relative`}>
                <MemoLogoLoop
                  logos={contactLogos}
                  speed={60}
                  direction="left"
                  logoHeight={isMobile ? 48 : 64}
                  gap={isMobile ? 40 : 80}
                  hoverSpeed={20}
                  fadeOut
                  fadeOutColor="#000000"
                  scaleOnHover
                />
              </div>

              <div className={`transition-all duration-800 delay-500 ${isContactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <p className="text-white/80 text-xl font-medium mb-6">Click on any icon above to connect with me directly</p>
                <div className="space-y-2">
                  <p className="text-white/70 text-lg"><strong>Email:</strong> kdkishore315@gmail.com</p>
                  <p className="text-white/70 text-lg"><strong>Response Time:</strong> Typically within 24 hours</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;

