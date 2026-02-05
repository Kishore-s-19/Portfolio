import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { projectsData, menuItems } from '../../../data/portfolio';

// Register plugins
gsap.registerPlugin(ScrollTrigger, Draggable);

const AntiGravitySpace = ({ isActive }) => {
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const contentRef = useRef(null);
    const cardsRef = useRef([]);
    const animationsRef = useRef([]);

    // Combine data for floating items
    const floatingItems = [
        ...projectsData.map(p => ({ type: 'project', ...p })),
        ...menuItems.map(m => ({ type: 'tech', ...m }))
    ];

    useEffect(() => {
        if (!isActive) return;

        // 1. Entry Animation when Active
        const ctx = gsap.context(() => {
            // Fade in and slide up slightly
            gsap.fromTo(containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 1.5, ease: "power2.inOut" }
            );

            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power2.out" }
            );

            // 2. Initialize Draggables and Idle Animation
            cardsRef.current.forEach((card, i) => {
                if (!card) return;

                // Random Initial Position logic
                const randomX = Math.random() * 80 + 10;
                const randomY = Math.random() * 80 + 10;
                const randomRot = Math.random() * 20 - 10;

                gsap.set(card, {
                    left: `${randomX}%`,
                    top: `${randomY}%`,
                    rotation: randomRot,
                    xPercent: -50,
                    yPercent: -50,
                    scale: 0
                });

                // Pop-in animation
                gsap.to(card, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.5 + Math.random() * 0.5,
                    ease: "back.out(1.7)"
                });

                // Idle Floating
                const floatTween = gsap.to(card, {
                    x: `+=${Math.random() * 60 - 30}`,
                    y: `+=${Math.random() * 60 - 30}`,
                    rotation: `+=${Math.random() * 10 - 5}`,
                    duration: 4 + Math.random() * 4,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: Math.random() * 2
                });
                animationsRef.current[i] = floatTween;

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
                        floatTween.pause();
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

                        gsap.to(this.target, {
                            rotation: this.deltaX * 0.5,
                            duration: 0.5,
                            ease: "power2.out"
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
                            rotation: `+=${vX * 300}`,
                            duration: duration,
                            ease: "power3.out", // Decelerate to stop
                            onComplete: () => {
                                // Resume gentle random float after stopping
                                if (!this.isPressed) floatTween.resume();
                            }
                        });
                    },
                    modifiers: {
                        x: (x) => {
                            const w = containerRef.current ? containerRef.current.offsetWidth : window.innerWidth;
                            const buffer = 300;
                            return gsap.utils.wrap(-buffer, w + buffer, parseFloat(x)) + "px";
                        },
                        y: (y) => {
                            const h = containerRef.current ? containerRef.current.offsetHeight : window.innerHeight;
                            const buffer = 300;
                            return gsap.utils.wrap(-buffer, h + buffer, parseFloat(y)) + "px";
                        }
                    }
                });
            });

        }, containerRef);

        return () => {
            ctx.revert();
            animationsRef.current.forEach(t => t && t.kill());
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div
            id="anti-gravity-section"
            ref={containerRef}
            className="relative w-full h-[120vh] z-50" // Increased z-index, removed overflow-hidden to allow cards to go over other sections
            style={{
                isolation: 'isolate',
                touchAction: 'none'
            }}
        >
            {/* Deep Space Gradient Background - keeping it contained to this section */}
            <div
                ref={bgRef}
                className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden" // Background stays contained
                style={{
                    background: 'radial-gradient(ellipse at bottom, #111 0%, #000000 100%)',
                }}
            >
                {/* CSS Stars / Noise */}
                <div className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                        mixBlendMode: 'overlay'
                    }}
                />
            </div>

            <div ref={contentRef} className="absolute top-20 w-full text-center pointer-events-none z-10">
                <h2 className="text-white/20 font-outfit text-2xl tracking-widest uppercase">
                    Zero Gravity
                </h2>
                <p className="text-white/10 text-sm mt-2 font-light">Drag to explore</p>
            </div>

            {/* Floating Cards Area */}
            <div className="absolute inset-0 w-full h-full"> {/* Removed overflow-hidden */}
                {floatingItems.map((item, index) => (
                    <div
                        key={index}
                        ref={el => cardsRef.current[index] = el}
                        className={`absolute select-none will-change-transform ${item.type === 'project' ? 'w-64 md:w-80 z-20' : 'w-20 md:w-28 z-10'}`}
                        style={{
                            opacity: 0, // initially hidden
                            cursor: 'grab'
                        }}
                    >
                        {item.type === 'project' ? (
                            <div className="rounded-2xl overflow-hidden bg-[#1a1a1a]/40 border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/30 group">
                                <div className="h-40 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                        draggable="false"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-4 relative z-20">
                                    <h3 className="text-white text-lg font-bold truncate mb-1">{item.title}</h3>
                                    <p className="text-gray-400 text-xs truncate">{item.description}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm shadow-lg aspect-square hover:bg-white/10 transition-colors">
                                <img
                                    src={item.image}
                                    alt={item.text}
                                    className="w-full h-full object-contain mb-1 drop-shadow-lg"
                                    draggable="false"
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AntiGravitySpace;
