import React, { useState, useEffect, useRef, useCallback } from 'react';

// Import images
import img1 from './images/IMG_0961.jpeg';
import img2 from './images/IMG_3300.jpeg';
import img3 from './images/IMG_3301.jpeg';
import img4 from './images/IMG_3302.jpeg';
import img5 from './images/IMG_3303.jpeg';
import img6 from './images/IMG_3304.jpeg';
import img7 from './images/IMG_3305.jpeg';
import img8 from './images/IMG_3306.jpeg';
import img9 from './images/IMG_3307.jpeg';
import img10 from './images/IMG_3308.jpeg';
import img11 from './images/IMG_3309.jpeg';
import img12 from './images/IMG_3310.jpeg';
import img13 from './images/IMG_6632.jpeg';

const IMAGES = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13];

// Memoized background component to prevent re-renders during hovering
const BackgroundText = React.memo(() => (
    <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none select-none relative z-0">
        <h1
            className="text-[17vw] md:text-[15vw] leading-[0.8] font-bold text-[#f5f5f7] tracking-tighter"
            style={{
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
        >
            Photograph
        </h1>
        <h1
            className="text-[25vw] md:text-[22vw] leading-[0.8] font-bold text-[#f5f5f7] tracking-tighter"
            style={{
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
        >
            y
        </h1>
    </div>
));

/**
 * PhotographySpace Component
 * A full-screen section with huge background text and an interactive image trail on hover.
 */
const PhotographySpace = () => {
    const sectionRef = useRef(null);
    const [floatingImages, setFloatingImages] = useState([]);
    const lastPos = useRef({ x: 0, y: 0 });
    const imageIndex = useRef(0);
    const threshold = 180; // Exactly 90% visibility for 200px width (10% overlap)

    // Shuffle images on initial load
    const shuffledImages = useRef([...IMAGES].sort(() => Math.random() - 0.5));

    const addImage = useCallback((x, y) => {
        const id = Date.now() + Math.random();
        const imgUrl = shuffledImages.current[imageIndex.current];
        imageIndex.current = (imageIndex.current + 1) % shuffledImages.current.length;

        const newImage = {
            id,
            url: imgUrl,
            // Use translate3d for better performance
            x,
            y,
            jitterX: (Math.random() - 0.5) * 10,
            jitterY: (Math.random() - 0.5) * 10
        };

        setFloatingImages(prev => [...prev, newImage]);

        setTimeout(() => {
            setFloatingImages(prev => prev.filter(img => img.id !== id));
        }, 1000);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const dist = Math.hypot(x - lastPos.current.x, y - lastPos.current.y);

            if (dist > threshold) {
                addImage(x, y);
                lastPos.current = { x, y };
            }
        };

        const section = sectionRef.current;
        section?.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => section?.removeEventListener('mousemove', handleMouseMove);
    }, [addImage]);

    return (
        <section
            ref={sectionRef}
            className="w-full min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center font-apple"
            style={{ contain: 'layout paint size' }}
        >
            {/* Top Sub-header */}
            <div className="absolute top-12 w-full text-center z-10 pointer-events-none">
                <p
                    className="text-[#86868b] text-[14px] md:text-[17px] font-normal tracking-normal opacity-90"
                    style={{ fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                >
                    Hover to interact
                </p>
            </div>

            {/* Static Background Text (Memoized) */}
            <BackgroundText />

            {/* Floating Interactive Images */}
            {floatingImages.map((img) => (
                <div
                    key={img.id}
                    className="absolute top-0 left-0 pointer-events-none"
                    style={{
                        zIndex: 20,
                        width: '200px',
                        height: '260px',
                        // Combine base position and animation base center in one transform for performance
                        // We use a wrapper div for animation and this div for initial placement
                        transform: `translate3d(${img.x + img.jitterX}px, ${img.y + img.jitterY}px, 0)`,
                        willChange: 'transform, opacity'
                    }}
                >
                    <div
                        className="w-full h-full overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] bg-gray-100"
                        style={{
                            transform: 'translate(-50%, -50%)', // Centering the image relative to mouse
                            animation: 'photography-reveal-fade 1s ease-in-out forwards',
                            willChange: 'transform, opacity'
                        }}
                    >
                        <img
                            src={img.url}
                            alt="Photography"
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                    </div>
                </div>
            ))}

            <style jsx>{`
                @keyframes photography-reveal-fade {
                    0% { 
                        opacity: 0; 
                        transform: translate(-50%, -45%) scale(0.9); 
                    }
                    15% { 
                        opacity: 1; 
                        transform: translate(-50%, -50%) scale(1); 
                    }
                    60% { 
                        opacity: 1; 
                        transform: translate(-50%, -50%) scale(1); 
                    }
                    100% { 
                        opacity: 0; 
                        transform: translate(-50%, -50%) scale(0.5); 
                    }
                }
            `}</style>

            {/* Subtle Right Scrollbar indicator from reference */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-[30vh] bg-[#f5f5f7] rounded-full pointer-events-none" />
        </section>
    );
};

export default PhotographySpace;
