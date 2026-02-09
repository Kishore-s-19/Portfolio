// src/App.jsx
import React, { useState, useRef, useEffect, memo } from 'react';
import './index.css'; // Changed from App.css to index.css for Tailwind v4
import PaperShaderBackground from './assets/components/ShaderBackground/PaperShaderBackground.jsx';
import portraitImage from './assets/images/IMG_2566.PNG';
import msgImage from './data/images/msg.avif';
import FlowingMenu from './assets/components/FlowingMenu';
import SkillsSection from './assets/components/SkillsSection/SkillsSection';
import { FaInstagram, FaLinkedin, FaGithub, FaFacebook, FaDiscord } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { NaukriIcon } from './assets/components/LogoLoop/Icon.jsx';

// Import LogoLoop correctly from the new file
import LogoLoop from './assets/components/LogoLoop/LogoLoop.jsx';
const AntiGravitySpace = React.lazy(() => import('./assets/components/AntiGravitySpace/AntiGravitySpace.jsx'));
const PhotographySpace = React.lazy(() => import('./assets/components/PhotographySpace/PhotographySpace.jsx'));
const PhotographyGallery = React.lazy(() => import('./assets/components/PhotographySpace/PhotographyGallery.jsx'));
import { Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MemoFlowingMenu = memo(FlowingMenu);

// Menu items data for FlowingMenu
// Import shared data
import { menuItems, projectsData } from './data/portfolio';

// Contact LogoLoop data (Social Media Icons)
const contactLogos = [
  { node: <FaInstagram style={{ color: '#E4405F', fontSize: '64px' }} />, title: "Instagram", href: "https://www.instagram.com/kishoree._.21/", ariaLabel: "Instagram Profile" },
  { node: <FaLinkedin style={{ color: '#0A66C2', fontSize: '64px' }} />, title: "LinkedIn", href: "https://www.linkedin.com/in/kishore-s-20a861224/", ariaLabel: "LinkedIn Profile" },
  { node: <SiGmail style={{ color: '#EA4335', fontSize: '64px' }} />, title: "Gmail", href: "mailto:kdkishore315@gmail.com", ariaLabel: "Send Email" },
  { node: <FaGithub style={{ color: '#FFFFFF', fontSize: '64px' }} />, title: "GitHub", href: "https://github.com/Kishore-s-19", ariaLabel: "GitHub Profile" },
  { node: <NaukriIcon style={{ color: '#0B9B4D', fontSize: '64px' }} />, title: "Naukri", href: "https://www.naukri.com/mnjuser/profile?id=&altresid", ariaLabel: "Naukri Profile" },
  { node: <FaFacebook style={{ color: '#1877F2', fontSize: '64px' }} />, title: "Facebook", href: "https://www.facebook.com/kishore.75945/", ariaLabel: "Facebook Profile" },
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
  // const [showAboutPage, setShowAboutPage] = useState(false); // State removed to allow scrolling
  const aboutPageRef = useRef(null);
  const aboutTextRef = useRef(null);
  const portraitRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const landingRef = useRef(null);
  const [isProjectsVisible, setIsProjectsVisible] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [isLandingVisible, setIsLandingVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [useShaderBackground, setUseShaderBackground] = useState(true);


  // Anti-Gravity Space Logic
  const [isSpaceActive, setIsSpaceActive] = useState(false);
  const pullProgressRef = useRef(0);
  const pullThreshold = 200; // Amount of pixels to "pull"

  useEffect(() => {
    // Only active if space is not already showing
    if (isSpaceActive) return;

    let touchStartY = 0;

    const handleWheel = (e) => {
      if (isSpaceActive) return;

      // check if at bottom (relaxed for better reliability)
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;

      if (scrolledToBottom && e.deltaY > 0) {
        // User is trying to scroll down while at receiver
        pullProgressRef.current += e.deltaY;

        if (pullProgressRef.current > pullThreshold * 3) { // Higher threshold for wheel
          setIsSpaceActive(true);
          pullProgressRef.current = 0;
        }
      } else {
        pullProgressRef.current = 0;
      }
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isSpaceActive) return;
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

      if (scrolledToBottom) {
        const touchCurrentY = e.touches[0].clientY;
        const deltaY = touchStartY - touchCurrentY; // Positive if dragging up (scrolling down)

        if (deltaY > 0) {
          pullProgressRef.current += deltaY * 0.5; // slow down sensitivity
          if (pullProgressRef.current > pullThreshold) {
            setIsSpaceActive(true);
            pullProgressRef.current = 0;
          }
        }
      }
    };

    const handleTouchEnd = () => {
      pullProgressRef.current = 0;
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isSpaceActive]);

  // Auto-scroll to space when activated
  useEffect(() => {
    if (isSpaceActive) {
      setTimeout(() => {
        const section = document.getElementById('anti-gravity-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [isSpaceActive]);

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
    // if (!showAboutPage) return; // Removed

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.target === landingRef.current) setIsLandingVisible(entry.isIntersecting);
          if (entry.target === projectsRef.current && entry.isIntersecting) setIsProjectsVisible(true);
          if (entry.target === contactRef.current) {
            if (entry.isIntersecting) setIsContactVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    landingRef.current && observer.observe(landingRef.current);

    projectsRef.current && observer.observe(projectsRef.current);
    contactRef.current && observer.observe(contactRef.current);

    return () => observer.disconnect();
  }, []); // Removed showAboutPage dependency

  // GSAP Scroll Reveal for About Text
  useEffect(() => {
    // if (!showAboutPage) return; // Removed

    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray('.reveal-char');

      gsap.to(letters, {
        scrollTrigger: {
          trigger: aboutTextRef.current,
          start: 'top 80%',
          end: 'bottom 40%',
          scrub: 1,
        },
        color: '#ffffff',
        duration: 0.1,
        stagger: 0.02,
        ease: "none"
      });

      // Animation for Portrait Slide-in
      gsap.fromTo(portraitRef.current,
        {
          opacity: 0,
          x: 60,
          scale: 0.95
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.5,
          ease: "expo.out",
          force3D: true,
          scrollTrigger: {
            trigger: portraitRef.current,
            start: "top 92%",
            toggleActions: "restart none none reverse"
          }
        }
      );

      // Refresh ScrollTrigger after a short delay
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1000);
    }, aboutPageRef);

    return () => ctx.revert();
  }, []); // Removed showAboutPage dependency

  const handleLearnMoreClick = () => {
    // setShowAboutPage(true); // Removed
    aboutPageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBackToTop = () => {
    setIsSpaceActive(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden bg-black font-apple">
      <main>
        {/* Main Landing Page */}
        <section className="w-full h-screen relative transition-opacity duration-700 overflow-hidden font-outfit" ref={landingRef} aria-label="Hero Section">
          <div className="absolute inset-0 z-0 w-full h-full overflow-hidden" aria-hidden="true">
            {useShaderBackground && isLandingVisible ? <PaperShaderBackground /> : (
              <div className="absolute inset-0 w-full h-full bg-black bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,255,255,0.15)_0%,transparent_40%),radial-gradient(ellipse_at_80%_80%,rgba(255,255,255,0.12)_0%,transparent_40%),radial-gradient(ellipse_at_40%_20%,rgba(255,255,255,0.1)_0%,transparent_40%)] animate-pulse" />
            )}
          </div>

          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-white pointer-events-none">
            <div className="text-center flex flex-col items-center gap-10 pointer-events-auto">
              <h1 className="text-6xl md:text-[7.2rem] font-bold leading-[1.05] m-0 bg-white bg-clip-text text-transparent tracking-tight px-4">
                Kishore S<br />Portfolio
              </h1>
              <nav className="flex flex-col md:flex-row gap-6" aria-label="Primary navigation">
                <button
                  aria-label="Scroll to About Me section"
                  className="bg-white/5 border border-white/20 text-white py-4 w-48 rounded-full text-[17px] font-medium cursor-pointer transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:-translate-y-1 backdrop-blur-xl outline-none flex justify-center items-center font-apple tracking-tight"
                  onClick={handleLearnMoreClick}
                >
                  About Me
                </button>
                <button
                  aria-label="Open Resume in a new tab"
                  className="bg-white/5 border border-white/20 text-white py-4 w-48 rounded-full text-[17px] font-medium cursor-pointer transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:-translate-y-1 backdrop-blur-xl outline-none flex justify-center items-center font-apple tracking-tight"
                  onClick={() => window.open('https://drive.google.com/file/d/1YJBHRP7CLYkAGEfLA0wKvh8ax_QFmBu1/view?usp=sharing', '_blank')}
                >
                  Resume
                </button>
              </nav>
            </div>
          </div>
        </section>

        <section className="w-full min-h-screen relative bg-black" ref={aboutPageRef} aria-labelledby="about-heading">
          <div className="relative z-10 min-h-screen flex flex-col md:flex-row items-center w-full px-[5%] font-apple font-bold overflow-hidden">
            <header className="sr-only">
              <h2 id="about-heading">About Kishore S</h2>
            </header>
            <div ref={aboutTextRef} className="w-full md:w-[55%] shrink-0 text-[28px] md:text-[45px] leading-tight tracking-tight pt-32 pb-10">
              {(() => {
                const paragraphs = [];
                let currentPara = [];
                aboutLines.forEach(line => {
                  if (line === "") {
                    if (currentPara.length > 0) paragraphs.push(currentPara);
                    paragraphs.push(""); // Spacer indicator
                    currentPara = [];
                  } else {
                    currentPara.push(line);
                  }
                });
                if (currentPara.length > 0) paragraphs.push(currentPara);

                return paragraphs.map((para, i) => (
                  para === "" ? <div key={i} className="h-6" /> : (
                    <p key={i} className="mb-4">
                      {para.join(' ').split(' ').map((word, wordIdx) => (
                        <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
                          {word.split('').map((char, charIdx) => (
                            <span key={charIdx} className="reveal-char text-[#2c2c2e]">
                              {char}
                            </span>
                          ))}
                        </span>
                      ))}
                    </p>
                  )
                ));
              })()}
            </div>

            <div ref={portraitRef} className="w-full md:w-[55%] md:-mr-[10%] h-[50vh] md:h-[95vh] flex justify-center items-center relative z-20" style={{ willChange: 'transform, opacity' }}>
              <div className="relative w-full max-h-[95vh] aspect-[4/5] overflow-hidden">
                <div
                  className="w-full h-full"
                  style={{
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
                    willChange: 'transform'
                  }}
                >
                  <img
                    src={portraitImage}
                    alt="Kishore S Portrait - UI/UX Designer and Developer"
                    className="w-full h-full object-cover grayscale brightness-90 contrast-110 transition-all duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {/* Subtle edge glow/blend overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
              </div>
            </div>
          </div>
        </section>



        <section className="w-full py-10 relative bg-black z-20" aria-label="Navigation Menu">
          <MemoFlowingMenu items={menuItems} />
        </section>

        <SkillsSection />

        <section className="w-full min-h-screen relative bg-black px-[5%] py-20 z-30 font-apple" ref={projectsRef} id="projects-section">
          <div className="max-w-[1400px] mx-auto">
            <div className={`transition-all duration-1000 transform ${isProjectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} mb-16`}>
              <h2 className="text-5xl md:text-[4rem] text-white mb-6 font-bold tracking-tighter leading-tight">Featured Work.</h2>
              <p className="text-[#86868b] text-xl md:text-2xl leading-relaxed max-w-2xl font-medium tracking-tight">
                A selection of recent projects built with a focus on
                interactive excellence and fluid experiences.
              </p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-all duration-1000 delay-300 transform ${isProjectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {projectsData.map((project, index) => (
                <article key={project.id} className="max-w-[380px] mx-auto bg-white/5 border border-white/10 rounded-[22px] overflow-hidden hover:border-white/30 hover:bg-white/10 transition-all duration-500 group flex flex-col h-full backdrop-blur-xl shadow-2xl">
                  <div className="relative w-full aspect-[16/10] overflow-hidden shrink-0">
                    <img src={project.image} alt={`Screenshot of ${project.title}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="p-8 flex-grow flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-white text-2xl font-semibold mb-3 tracking-tight">{project.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, i) => (
                          <span key={i} className="bg-white/5 text-[#86868b] py-1 px-3 rounded-full text-[12px] font-medium border border-white/10">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[#86868b] leading-relaxed mb-8 text-[17px] font-normal flex-grow line-clamp-3">{project.description}</p>
                    <div className="flex gap-3 mt-auto">
                      <a href={project.github} className="flex-1 flex items-center justify-center gap-2 text-white/80 py-2.5 px-4 border border-white/10 rounded-full text-[12px] font-medium transition-all duration-300 bg-white/5 hover:bg-white hover:text-black hover:border-white" target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub`}>
                        GitHub
                      </a>
                      <a href={project.live} className="flex-1 flex items-center justify-center gap-2 text-white/80 py-2.5 px-4 border border-white/10 rounded-full text-[12px] font-medium transition-all duration-300 bg-white/5 hover:bg-white hover:text-black hover:border-white" target="_blank" rel="noopener noreferrer" aria-label={`View live demo of ${project.title}`}>
                        Demo
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="bg-black px-[5%] py-20 pb-0">
          <section
            className="mx-auto bg-[#0c0c0c] rounded-[60px] py-14 px-4 md:px-12 relative z-40 font-apple"
            ref={contactRef}
            style={{
              width: '160%', // Adjust width here (e.g., 80%, 100%)
              maxWidth: '1200px', // Adjust max-width here (e.g., 1000px, 1400px)
              minHeight: '750px' // Adjust min-height here
            }}
          >
            <div className="w-full text-center">
              <div className={`transition-all duration-800 ${isContactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} mb-16`}>
                <h2 className="text-5xl md:text-[4rem] text-white mb-6 font-bold tracking-tighter leading-tight">Connect With Me.</h2>
                <p className="text-[#86868b] text-xl md:text-2xl leading-relaxed max-w-xl mx-auto font-medium tracking-tight">
                  Let's discuss your next project or just say hi.
                </p>
              </div>

              <div className={`transition-all duration-800 delay-300 ${isContactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} h-32 overflow-hidden mb-16 relative`}>
                <LogoLoop
                  logos={contactLogos}
                  speed={60}
                  direction="left"
                  logoHeight={isMobile ? 48 : 64}
                  gap={isMobile ? 40 : 80}
                  hoverSpeed={20}
                  fadeOut
                  fadeOutColor="#0c0c0c" // Matches card background
                  scaleOnHover
                />
              </div>

              <div className={`transition-all duration-800 delay-500 ${isContactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <p className="text-[#86868b] text-xl md:text-2xl font-medium mb-12 tracking-tight">Select an icon to start a conversation.</p>
                <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-24">
                  <div className="text-center md:text-left">
                    <p className="text-[#86868b] text-xs uppercase tracking-[0.2em] mb-3 font-semibold">Email Address</p>
                    <p className="text-white text-xl font-medium tracking-tight">kdkishore315@gmail.com</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-[#86868b] text-xs uppercase tracking-[0.2em] mb-3 font-semibold">Timezone</p>
                    <p className="text-white text-xl font-medium tracking-tight">IST (GMT +5:30)</p>
                  </div>
                </div>

                {/* Message Image - Centered below email info */}
                <div className="flex justify-center mt-12">
                  <img
                    src={msgImage}
                    alt="Message illustration"
                    className="w-auto h-32 md:h-48 object-contain opacity-90"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Signature Footer */}
        <section className="w-full md:pt-20 pt-10 pb-0 bg-black flex justify-center items-center overflow-hidden select-none relative z-10">
          <h1 className="font-apple font-bold text-[20vw] md:text-[18vw] leading-none text-[#1a1a1a] tracking-tight hover:text-[#222] transition-colors duration-700">
            Kishore
          </h1>
        </section>

        <div id="anti-gravity-section">
          {isSpaceActive && (
            <Suspense fallback={<div className="w-full h-screen bg-black flex justify-center items-center text-white/50 font-apple">Warping Space...</div>}>
              <AntiGravitySpace isActive={isSpaceActive} />
              <PhotographySpace />
              <PhotographyGallery />
            </Suspense>
          )}
        </div>
      </main>

      {/* Hidden SEO Content for Crawlers */}
      <div className="sr-only" aria-hidden="true">
        <h1>Kishore S | UI/UX Designer & Full-Stack Developer</h1>
        <p>
          I'm Kishore S, a 21-year-old developer and designer specializing in immersive UI/UX experiences and full-stack software development.
          My skills include React, Next.js, Web Development, Software Engineering, and creating cinematic web experiences.
          This portfolio showcases my featured work, including interactive projects built with GSAP, Three.js, and modern web technologies.
        </p>
        <h2>My Skills</h2>
        <ul>
          <li>UI/UX Design</li>
          <li>Full-Stack Development</li>
          <li>React & Next.js</li>
          <li>Animation & Interactivity (GSAP, Framer Motion)</li>
          <li>Creative Coding (Three.js, WebGL)</li>
        </ul>
        <h2>Experience & Projects</h2>
        <p>
          Explore my featured work which focuses on interactive excellence and fluid experiences.
          I build softwares and designs that tell a story through every pixel.
        </p>
      </div>

      {/* Footer Branding */}
      <footer className="sr-only">
        <p>© 2026 Kishore S. Immersive Portfolio Experience.</p>
      </footer>
    </div>
  );
}

export default App;
