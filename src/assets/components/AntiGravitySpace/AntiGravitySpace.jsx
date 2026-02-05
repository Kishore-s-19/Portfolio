import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { projectsData, menuItems } from '../../../data/portfolio';
import spaceBg from './background/wp3493593-black-space-wallpaper-hd.webp';

// Register plugins
gsap.registerPlugin(ScrollTrigger, Draggable);

const AntiGravitySpace = ({ isActive }) => {
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const contentRef = useRef(null);
    const diveOverlayRef = useRef(null);
    const cardsRef = useRef([]);
    const animationsRef = useRef([]);
    const portalWrapperRef = useRef(null);
    const cardsContainerRef = useRef(null);
    const boundsRef = useRef(null);
    const [portalReady, setPortalReady] = useState(false);

    // Combine data for floating items
    const floatingItems = [
        ...projectsData.map(p => ({ type: 'project', ...p })),
        ...menuItems.map(m => ({ type: 'tech', ...m }))
    ];

    // Update clip-path and position using GSAP ticker (no React re-renders)
    useEffect(() => {
        if (!isActive) return;

        const updatePortalPosition = () => {
            if (!containerRef.current || !portalWrapperRef.current || !cardsContainerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const scrollY = window.scrollY;

            // Store bounds in ref (not state) to avoid re-renders
            boundsRef.current = {
                top: rect.top + scrollY,
                bottom: rect.bottom + scrollY,
                left: rect.left,
                width: rect.width,
                height: rect.height
            };

            // Update clip-path: clip only at bottom
            const bottomClip = Math.max(0, window.innerHeight - rect.bottom);
            portalWrapperRef.current.style.clipPath = `inset(-9999px -9999px ${bottomClip}px -9999px)`;

            // Use transform for GPU-accelerated positioning (no layout thrashing)
            cardsContainerRef.current.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
            cardsContainerRef.current.style.width = `${rect.width}px`;
            cardsContainerRef.current.style.height = `${rect.height}px`;
        };

        // Use GSAP ticker for smooth 60fps updates without React re-renders
        gsap.ticker.add(updatePortalPosition);

        // Initial update
        updatePortalPosition();

        return () => {
            gsap.ticker.remove(updatePortalPosition);
        };
    }, [isActive]);

    // Initialize animations ONCE when portal is ready
    useEffect(() => {
        if (!isActive || !portalReady) return;

        // 1. Entry Animation when Active
        const ctx = gsap.context(() => {
            // Fade in and slide up slightly
            gsap.fromTo(containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 1.5, ease: "power2.inOut" }
            );

            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, delay: 2, ease: "power2.out" }
            );

            // Cinematic Dive Timeline
            const tl = gsap.timeline();

            // Initial setup for dive
            gsap.set(bgRef.current, { scale: 3, filter: 'blur(20px)' });
            gsap.set(diveOverlayRef.current, { opacity: 1, scale: 1 });

            tl.to(diveOverlayRef.current, {
                scale: 0,
                duration: 2,
                ease: "power4.inOut"
            })
                .to(bgRef.current, {
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 2.5,
                    ease: "expo.out"
                }, "-=1.5")
                .to(diveOverlayRef.current, {
                    opacity: 0,
                    duration: 0.5
                }, "-=1")
                .add(() => {
                    // Define startFloating once for all cards
                    const startFloating = (index) => {
                        const card = cardsRef.current[index];
                        if (!card) return;

                        // Kill existing if any to prevent conflicts
                        if (animationsRef.current[index]) animationsRef.current[index].kill();

                        animationsRef.current[index] = gsap.to(card, {
                            x: `+=${Math.random() * 60 - 30}`,
                            y: `+=${Math.random() * 30 - 15}`,
                            rotation: `+=${Math.random() * 10 - 5}`,
                            duration: 4 + Math.random() * 4,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut",
                            delay: Math.random() * 0.5
                        });
                    };

                    // Fly-in cards from Z-space
                    cardsRef.current.forEach((card, i) => {
                        if (!card) return;
                        gsap.to(card, {
                            z: 0,
                            scale: 1,
                            opacity: 1,
                            duration: 1.5,
                            delay: Math.random() * 0.5,
                            ease: "power3.out",
                            onStart: () => {
                                // Ensure card is visible when starting
                                gsap.set(card, { opacity: 1 });
                            },
                            onComplete: () => {
                                startFloating(i);
                            }
                        });
                    });
                }, "-=1.5");

            // 2. Initialize Draggables (No immediate floating)
            cardsRef.current.forEach((card, i) => {
                if (!card) return;

                // Random Initial Position logic
                const randomX = Math.random() * 80 + 10;
                const randomY = Math.random() * 60 + 10;
                const randomRot = Math.random() * 20 - 10;

                gsap.set(card, {
                    left: `${randomX}%`,
                    top: `${randomY}%`,
                    rotation: randomRot,
                    xPercent: -50,
                    yPercent: -50,
                    z: -3000,
                    scale: 0.1,
                    opacity: 0,
                    transformPerspective: 1000
                });

                // Helper for Draggable to restart floating
                const restartFloating = () => startFloating(i);

                Draggable.create(card, {
                    type: "x,y",
                    bounds: null,
                    inertia: false, // Custom physics
                    edgeResistance: 0,
                    dragResistance: 0,
                    cursor: "grab",
                    activeCursor: "grabbing",
                    onPress: function () {
                        // Kill any active drift
                        if (this.driftTween) this.driftTween.kill();

                        // Kill the idle animation completely so we don't fight it
                        if (animationsRef.current[i]) animationsRef.current[i].kill();

                        gsap.to(this.target, { scale: 1.05, duration: 0.2 });

                        // Reset velocity tracking
                        this.lastTime = Date.now();
                        this.velocityX = 0;
                        this.velocityY = 0;
                    },
                    onDrag: function () {
                        const now = Date.now();
                        const dt = now - this.lastTime;

                        if (dt > 0) {
                            // Calculate velocity (pixels per ms)
                            // Smoothing factor for less jitter
                            const alpha = 0.5;
                            const vX = this.deltaX / dt;
                            const vY = this.deltaY / dt;

                            this.velocityX = this.velocityX * alpha + vX * (1 - alpha);
                            this.velocityY = this.velocityY * alpha + vY * (1 - alpha);
                        }

                        this.lastTime = now;

                        gsap.set(this.target, {
                            rotation: `+=${this.deltaX * 0.1}`, // Cumulative rotation (rolling effect)
                            overwrite: 'auto'
                        });
                    },
                    onRelease: function () {
                        gsap.to(this.target, { scale: 1, duration: 0.2 });

                        // Physics with friction: Slide and stop
                        let vX = this.velocityX || 0;
                        let vY = this.velocityY || 0;

                        // Sensitivity factor (how far it slides)
                        const slideFactor = 300; // Reduced from 800 for better control

                        const duration = Math.min(Math.max(Math.sqrt(vX * vX + vY * vY) * 20, 1), 2.5);

                        this.driftTween = gsap.to(this.target, {
                            x: `+=${vX * slideFactor}`,
                            y: `+=${vY * slideFactor}`,
                            rotation: `+=${vX * 50}`,
                            duration: duration,
                            ease: "power3.out", // Decelerate to stop
                            onComplete: () => {
                                // Start a FRESH float from the NEW position/rotation
                                if (!this.isPressed) restartFloating();
                            }
                        });
                    },
                    modifiers: {
                        x: (x) => {
                            const w = cardsContainerRef.current ? cardsContainerRef.current.offsetWidth : window.innerWidth;
                            const buffer = 300;
                            return gsap.utils.wrap(-buffer, w + buffer, parseFloat(x)) + "px";
                        },
                        y: (y) => {
                            const h = cardsContainerRef.current ? cardsContainerRef.current.offsetHeight : window.innerHeight;
                            const yVal = parseFloat(y);
                            // Allow going up (negative/small values), but clamp at bottom to prevent scroll
                            if (yVal > h - 50) return (h - 50) + "px"; // Stop 50px before bottom edge
                            return y;
                        }
                    }
                });
            });

        }, cardsContainerRef);

        return () => {
            ctx.revert();
            animationsRef.current.forEach(t => t && t.kill());
        };
    }, [isActive, portalReady]); // Only depends on isActive and portalReady (not sectionBounds)

    // Set portal ready after first render
    useEffect(() => {
        if (isActive) {
            // Small delay to ensure portal is mounted
            const timer = setTimeout(() => setPortalReady(true), 50);
            return () => clearTimeout(timer);
        } else {
            setPortalReady(false);
        }
    }, [isActive]);

    if (!isActive) return null;

    // Floating Cards rendered via Portal
    const floatingCards = createPortal(
        <div
            ref={portalWrapperRef}
            className="pointer-events-none"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
                clipPath: 'inset(-9999px -9999px 0px -9999px)', // Initial, updated by ticker
                pointerEvents: 'none'
            }}
        >
            <div
                ref={cardsContainerRef}
                className="pointer-events-auto"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '120vh',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    perspective: 1000,
                    transformStyle: 'preserve-3d'
                }}
            >
                {floatingItems.map((item, index) => (
                    <div
                        key={index}
                        ref={el => cardsRef.current[index] = el}
                        className={`absolute select-none will-change-transform ${item.type === 'project' ? 'w-64 md:w-80 z-20' : 'w-20 md:w-28 z-10'}`}
                        style={{
                            opacity: 0, // initially hidden
                            cursor: 'grab',
                            transformStyle: 'preserve-3d',
                            backfaceVisibility: 'hidden'
                        }}
                    >
                        {item.type === 'project' ? (
                            <div className="rounded-[22px] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] group" style={{ backfaceVisibility: 'hidden' }}>
                                <div className="h-40 md:h-48 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                        draggable="false"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-5 relative z-20 font-apple">
                                    <h3 className="text-white text-lg font-semibold tracking-tight truncate mb-1">{item.title}</h3>
                                    <p className="text-white/50 text-[13px] font-normal leading-snug line-clamp-2">{item.description}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-4 rounded-[22px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl aspect-square hover:bg-white/10 transition-colors group">
                                <img
                                    src={item.image}
                                    alt={item.text}
                                    className="w-[80%] h-[80%] object-contain mb-1 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-500"
                                    draggable="false"
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>,
        document.body
    );

    return (
        <>
            <div
                id="anti-gravity-section"
                ref={containerRef}
                className="relative w-full h-[120vh] z-50 overflow-hidden" // overflow-hidden for background only
                style={{
                    isolation: 'isolate',
                    touchAction: 'none'
                }}
            >
                {/* Deep Space Galaxy Background Image */}
                <div
                    ref={bgRef}
                    className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
                    style={{
                        backgroundImage: `url("${spaceBg}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: '#000',
                        willChange: 'transform, filter'
                    }}
                >
                </div>

                {/* Cinematic Black Hole Dive Overlay */}
                <div
                    ref={diveOverlayRef}
                    className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden"
                    style={{ opacity: 0 }}
                >
                    <div className="w-[300vw] h-[300vh] rounded-full bg-black flex-shrink-0"
                        style={{
                            boxShadow: 'inset 0 0 200px rgba(255,255,255,0.05)',
                            background: 'radial-gradient(circle, transparent 20%, black 60%)'
                        }}
                    />
                </div>

                <div ref={contentRef} className="absolute top-24 w-full text-center pointer-events-none z-10 font-apple">
                    <h2 className="text-white/40 font-semibold text-[13px] tracking-[0.3em] uppercase">
                        Zero Gravity
                    </h2>
                    <p className="text-white/20 text-xs mt-3 font-normal tracking-wide">Drag to explore the void</p>
                </div>
            </div>
            {floatingCards}
        </>
    );
};

export default AntiGravitySpace;
