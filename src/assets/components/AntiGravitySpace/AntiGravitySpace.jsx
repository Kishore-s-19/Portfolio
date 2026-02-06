import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { antiGravityCards } from '../../../data/portfolio';

// Register plugins
gsap.registerPlugin(ScrollTrigger, Draggable);

const AntiGravitySpace = ({ isActive }) => {
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const contentRef = useRef(null);
    const diveOverlayRef = useRef(null);
    const cardsRef = useRef([]);
    const portalWrapperRef = useRef(null);
    const cardsContainerRef = useRef(null);
    const boundsRef = useRef(null);
    const [portalReady, setPortalReady] = useState(false);


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

            // Simple Entry Animation
            const tl = gsap.timeline();

            tl.add(() => {
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
                        }
                    });
                });
            });

            // 2. Initialize Draggables
            cardsRef.current.forEach((card, i) => {
                if (!card) return;

                const cardInfo = antiGravityCards[i] || { l: 50, t: 50, r: 0 };

                gsap.set(card, {
                    left: `${cardInfo.l}%`,
                    top: `${cardInfo.t}%`,
                    rotation: cardInfo.r,
                    xPercent: -50,
                    yPercent: -50,
                    z: -3000,
                    scale: 0.1,
                    opacity: 0,
                    transformPerspective: 1000
                });


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
                            duration: duration,
                            ease: "power3.out" // Decelerate to stop
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
                {antiGravityCards.map((item, index) => {
                    return (
                        <div
                            key={index}
                            ref={el => cardsRef.current[index] = el}
                            className="absolute select-none will-change-transform"
                            style={{
                                opacity: 0, // initially hidden
                                cursor: 'grab',
                                transformStyle: 'preserve-3d',
                                backfaceVisibility: 'hidden',
                                width: `${item.w}px`,
                                zIndex: item.zi || 10
                            }}
                        >
                            {item.type === 'project' ? (
                                <div className="rounded-[22px] overflow-hidden bg-white border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] group w-full" style={{ backfaceVisibility: 'hidden' }}>
                                    <div className="h-40 md:h-48 overflow-hidden relative transition-colors duration-300 group-hover:bg-black/5 group-active:bg-black/10">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-opacity duration-300"
                                            draggable="false"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-6 relative z-20">
                                        <h3 className="text-black text-[19px] font-bold tracking-tight mb-1">{item.title}</h3>
                                        <p className="text-[#86868b] text-[14px] font-medium leading-relaxed line-clamp-2">{item.description}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full group cursor-pointer pointer-events-auto" style={{ backfaceVisibility: 'hidden' }}>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-auto transition-transform duration-300 group-active:scale-[0.98] drop-shadow-2xl"
                                        draggable="false"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
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
                {/* Clean Minimal Background */}
                <div
                    ref={bgRef}
                    className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
                    style={{
                        backgroundColor: '#fff',
                        willChange: 'transform'
                    }}
                >
                    {/* Large Hero Background Text */}
                    <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                        <h1 className="text-[14vw] md:text-[16vw] font-black text-[#f5f5f7] leading-none tracking-[-0.07em] select-none">
                            About me
                        </h1>
                    </div>
                </div>

                <div ref={contentRef} className="absolute top-12 w-full text-center pointer-events-none z-10">
                    <p className="text-[#86868b] text-[14px] md:text-[17px] font-normal tracking-normal opacity-90">
                        Interactable Zone , Hold & drag the content
                    </p>
                </div>
            </div>
            {floatingCards}
        </>
    );
};

export default AntiGravitySpace;
