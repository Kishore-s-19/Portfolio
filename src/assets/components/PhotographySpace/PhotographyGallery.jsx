import React from 'react';

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

/**
 * PhotographyGallery Component
 * A static masonry-style gallery showing all photography images in their default aspect ratio.
 */
const PhotographyGallery = () => {
    return (
        <section className="w-full bg-white px-[5%] py-24 pb-40 relative z-50 font-apple">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-16">
                    <h2 className="text-[40px] md:text-[56px] font-bold text-black tracking-tight mb-4" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                        Gallery
                    </h2>
                    <p
                        className="text-[#86868b] text-[14px] md:text-[17px] font-normal tracking-normal opacity-90 max-w-xl"
                        style={{ fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                    >
                        A collection of moments captured through the lens, displayed in their raw, natural form.
                    </p>
                </div>

                {/* Masonry Grid Layout using CSS Columns */}
                <div
                    className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
                    role="list"
                    aria-label="Photography Portfolio Gallery"
                >
                    {IMAGES.map((img, index) => (
                        <div
                            key={index}
                            className="break-inside-avoid shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-hidden bg-gray-50"
                            role="listitem"
                        >
                            <img
                                src={img}
                                alt={`High quality photography shot ${index + 1} by Kishore S`}
                                className="w-full h-auto object-contain block pointer-events-none"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PhotographyGallery;
