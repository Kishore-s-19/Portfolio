import React, { useEffect, useRef, useState, useCallback, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { FaPlay, FaPause, FaPlus, FaEllipsisH, FaSpotify, FaBackward, FaForward, FaVolumeUp, FaStar } from 'react-icons/fa';
import { MdAirplay } from 'react-icons/md';
import { IoMusicalNotesOutline } from 'react-icons/io5';
import { antiGravityCards } from '../../../data/portfolio';

// Sub-component for Spotify Card to manage its own audio state
const SpotifyCard = ({ item }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [showMore, setShowMore] = useState(false);

    const togglePlay = (e) => {
        e.stopPropagation();
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTrackRedirect = (e) => {
        e.stopPropagation();
        window.open(item.trackUrl, '_blank');
    };

    const handleMoreClick = (e) => {
        e.stopPropagation();
        setShowMore(true);
    };

    const handleCloseMore = (e) => {
        e.stopPropagation();
        setShowMore(false);
    };

    const handleAction = (e, action) => {
        e.stopPropagation();
        if (action === 'copy') {
            navigator.clipboard.writeText(item.trackUrl);
        } else {
            window.open(item.trackUrl, '_blank');
        }
    };

    return (
        <div className="w-full h-[80px] bg-[#53748d]/90 backdrop-blur-md rounded-[12px] p-2 flex items-center gap-3 shadow-xl relative group pointer-events-auto border border-white/10 hover:border-white/20 transition-all overflow-hidden font-apple">
            {/* Spotify Audio Element */}
            <audio ref={audioRef} src={item.audioUrl} onEnded={() => setIsPlaying(false)} />

            {/* Album Art */}
            <div className="w-[64px] h-[64px] rounded-[8px] overflow-hidden shrink-0 shadow-lg relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Info Container */}
            <div className="flex-grow min-w-0 flex flex-col justify-center">
                <h3
                    onClick={handleTrackRedirect}
                    className="text-white text-[15px] font-bold tracking-tight truncate leading-tight cursor-pointer hover:underline decoration-2 underline-offset-2"
                >
                    {item.title}
                </h3>
                <p className="text-white/70 text-[12px] font-medium truncate mb-1.5">{item.artist}</p>

                <div className="flex items-center gap-3">
                    <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px] uppercase tracking-wider">Preview</span>
                    <div className="flex items-center gap-3 ml-auto pr-1">
                        <FaPlus className="text-white/60 hover:text-white transition-colors cursor-pointer text-[12px]" />
                        <div className="relative group/more-btn">
                            <FaEllipsisH
                                onClick={handleMoreClick}
                                className="text-white/60 hover:text-white transition-colors cursor-pointer text-[12px]"
                            />
                            {/* Simple tooltip like the reference image */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#282828] text-white text-[11px] px-2 py-1 border border-white/20 opacity-0 group-hover/more-btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                More
                            </div>
                        </div>
                        <button
                            onClick={togglePlay}
                            className="w-8 h-8 bg-[#8db5d4] rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            {isPlaying ? <FaPause className="text-[11px]" /> : <FaPlay className="ml-0.5 text-[11px]" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Logo in top right */}
            <FaSpotify className="absolute top-2 right-2 text-white/40 text-[16px]" />

            {/* More Overlay */}
            <div className={`absolute inset-0 bg-[#121212]/98 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 z-50 ${showMore ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <button
                    onClick={handleCloseMore}
                    className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors p-1"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className="flex flex-col items-center gap-2 px-2 w-full select-none">
                    <div className="flex items-center gap-1.5 text-white text-[11px] font-bold">
                        <button onClick={(e) => handleAction(e, 'play')} className="hover:underline">Play on Spotify</button>
                        <span className="text-white/30">•</span>
                        <button onClick={(e) => handleAction(e, 'save')} className="hover:underline">Save on Spotify</button>
                    </div>

                    <div className="flex items-center gap-1.5 text-white/90 text-[11px] font-bold">
                        <span className="text-white/30">•</span>
                        <button onClick={(e) => handleAction(e, 'copy')} className="hover:underline">Copy link</button>
                    </div>

                    <div className="flex items-center gap-1.5 text-white/30 text-[9px] font-bold mt-1">
                        <span className="cursor-default">Privacy Policy</span>
                        <span>•</span>
                        <span className="cursor-default">Terms & Conditions</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component for Apple Music Card
const AppleMusicCard = ({ item, onAudioData }) => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const tracks = item.tracks || [item];
    const currentTrack = tracks[currentTrackIndex];

    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [isDragging, setIsDragging] = useState(false);
    const [favoritedTracks, setFavoritedTracks] = useState({});
    const progressBarRef = useRef(null);
    const controlsRef = useRef(null);
    const starRef = useRef(null);

    // Audio Analysis for Cinematic Effect
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const animationFrameRef = useRef(null);
    const connectedAudioRef = useRef(null); // Track which audio element is connected

    // Initialize Audio Analysis when playing starts
    useEffect(() => {
        if (!isPlaying || !audioRef.current) {
            // Stop analysis when not playing
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            return;
        }

        // Initialize AudioContext on first play
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 256;
                analyserRef.current.smoothingTimeConstant = 0.8;
            } catch (e) {
                console.warn('AudioContext not supported:', e);
                return;
            }
        }

        // Connect audio element to analyser
        // Re-connect if audio element has changed (shouldn't happen now without key)
        if (audioRef.current && connectedAudioRef.current !== audioRef.current) {
            try {
                // Disconnect old source if exists
                if (sourceNodeRef.current) {
                    try { sourceNodeRef.current.disconnect(); } catch (e) { }
                }
                sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
                sourceNodeRef.current.connect(analyserRef.current);
                analyserRef.current.connect(audioContextRef.current.destination);
                connectedAudioRef.current = audioRef.current;
                console.log('[AudioAnalysis] Connected to audio element');
            } catch (e) {
                console.warn('[AudioAnalysis] Connection error:', e.message);
            }
        }

        // Resume context if suspended
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        // Start analysis loop
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        let lastPeak = 0;

        const analyze = () => {
            if (!isPlaying || !analyserRef.current) return;

            analyserRef.current.getByteFrequencyData(dataArray);

            // Calculate bass energy (first ~10 bins = low frequencies)
            const bassRange = dataArray.slice(0, 12);
            const bassEnergy = bassRange.reduce((a, b) => a + b, 0) / (bassRange.length * 255);

            // Calculate overall energy
            const totalEnergy = dataArray.reduce((a, b) => a + b, 0) / (dataArray.length * 255);

            // Detect peaks (sudden increases)
            const currentPeak = Math.max(bassEnergy, totalEnergy * 1.5);
            const peakDelta = currentPeak - lastPeak;
            const peak = peakDelta > 0.1 ? Math.min(currentPeak + peakDelta, 1) : currentPeak * 0.9;
            lastPeak = currentPeak * 0.95; // Decay

            // Send data to parent if callback exists
            if (onAudioData) {
                onAudioData({
                    energy: totalEnergy,
                    bassEnergy: bassEnergy,
                    peak: peak,
                    trackTitle: currentTrack.title,
                    currentTime: audioRef.current ? audioRef.current.currentTime : 0,
                    duration: audioRef.current ? audioRef.current.duration : 0
                });
            }

            animationFrameRef.current = requestAnimationFrame(analyze);
        };

        analyze();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying, onAudioData, currentTrack.title]);

    const handleFavorite = (e) => {
        if (e) e.stopPropagation();

        // Toggle state
        const isCurrentlyFavorited = favoritedTracks[currentTrackIndex];
        setFavoritedTracks(prev => ({
            ...prev,
            [currentTrackIndex]: !isCurrentlyFavorited
        }));

        // GSAP Animation: Zoom for a sec and return
        // Apple-style pop animation
        gsap.timeline()
            .to(starRef.current, { scale: 1.4, duration: 0.1, ease: "power2.out" })
            .to(starRef.current, { scale: 1, duration: 0.5, ease: "elastic.out(1.5, 0.5)" });
    };

    // Handle track changes - load new source
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load(); // Load the new src
            if (isPlaying) {
                audioRef.current.play().catch(() => { }); // Resume if was playing
            }
        }
    }, [currentTrackIndex]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleForward = (e) => {
        if (e) e.stopPropagation();
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        setCurrentTrackIndex(nextIndex);
        setCurrentTime(0);
        if (isPlaying) {
            setTimeout(() => {
                if (audioRef.current) audioRef.current.play();
            }, 50);
        }
    };

    const handleBackward = (e) => {
        if (e) e.stopPropagation();
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        setCurrentTrackIndex(prevIndex);
        setCurrentTime(0);
        if (isPlaying) {
            setTimeout(() => {
                if (audioRef.current) audioRef.current.play();
            }, 50);
        }
    };

    const togglePlay = (e) => {
        e.stopPropagation();
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (!isDragging) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const updateProgress = useCallback((clientX) => {
        if (!duration || !progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
        const newTime = percentage * duration;
        setCurrentTime(newTime);
        audioRef.current.currentTime = newTime;
    }, [duration]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                updateProgress(e.clientX);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, updateProgress]);

    useEffect(() => {
        const bar = progressBarRef.current;
        const controls = controlsRef.current;
        if (!bar || !controls) return;

        const onProgressDown = (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (e.type === 'mousedown') e.preventDefault();
            setIsDragging(true);
            updateProgress(e.clientX);
        };

        const onControlsDown = (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
        };

        bar.addEventListener('mousedown', onProgressDown, true);
        bar.addEventListener('pointerdown', onProgressDown, true);
        controls.addEventListener('mousedown', onControlsDown, true);
        controls.addEventListener('pointerdown', onControlsDown, true);

        return () => {
            bar.removeEventListener('mousedown', onProgressDown, true);
            bar.removeEventListener('pointerdown', onProgressDown, true);
            controls.removeEventListener('mousedown', onControlsDown, true);
            controls.removeEventListener('pointerdown', onControlsDown, true);
        };
    }, [updateProgress]);

    const handleTrackRedirect = (e) => {
        if (e) e.stopPropagation();
        if (currentTrack.trackUrl) window.open(currentTrack.trackUrl, '_blank');
    };

    return (
        <div className="w-full bg-black rounded-[24px] p-4 flex flex-col gap-4 shadow-2xl relative border border-white/5 pointer-events-auto font-apple select-none overflow-hidden group">
            <audio
                ref={audioRef}
                src={currentTrack.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => handleForward()}
            />

            {/* Top section: Art and Info */}
            <div className="flex items-center gap-4">
                <div
                    onClick={handleTrackRedirect}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="w-[60px] h-[60px] rounded-lg overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.4)] border border-white/10 shrink-0 cursor-pointer hover:scale-[1.05] transition-transform duration-300"
                >
                    <img src={currentTrack.image} alt={currentTrack.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-grow min-w-0">
                    <h3
                        onClick={handleTrackRedirect}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="text-white text-[17px] font-bold truncate leading-tight tracking-tight cursor-pointer"
                    >
                        {currentTrack.title}
                    </h3>
                    <p
                        onClick={handleTrackRedirect}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="text-[#8e8e93] text-[16px] font-medium truncate cursor-pointer hover:text-white/60 transition-colors"
                    >
                        {currentTrack.artist}
                    </p>
                </div>

                <div className="shrink-0" data-clickable="true">
                    <IoMusicalNotesOutline className="text-white/20 text-[20px]" />
                </div>
            </div>

            {/* Middle section: Progress Bar */}
            <div className="flex items-center gap-2.5 px-0.5 mt-1">
                <span className="text-[13px] text-white/40 font-semibold tabular-nums min-w-[32px]">
                    {formatTime(currentTime)}
                </span>

                <div
                    ref={progressBarRef}
                    data-clickable="true"
                    className="relative flex-grow h-[7px] bg-white/10 rounded-full overflow-hidden cursor-pointer active:opacity-80"
                >
                    <div
                        className="absolute left-0 top-0 h-full bg-white/40"
                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                    />
                </div>

                <span className="text-[13px] text-white/40 font-semibold tabular-nums min-w-[32px] text-right">
                    -{formatTime(duration - currentTime)}
                </span>
            </div>

            {/* Bottom section: Controls */}
            <div
                ref={controlsRef}
                className="flex items-center justify-between px-1.5 pb-0.5"
                data-clickable="true"
            >
                <div
                    ref={starRef}
                    onClick={handleFavorite}
                    className="cursor-pointer active:scale-90" // added active state for immediate feedback
                >
                    <FaStar
                        className={`text-[17px] transition-colors duration-300 ${favoritedTracks[currentTrackIndex]
                            ? 'text-white/40'
                            : 'text-white/20 hover:text-white/40'
                            }`}
                    />
                </div>

                <div className="flex items-center gap-10">
                    <FaBackward
                        onClick={handleBackward}
                        className="text-white text-[19px] hover:text-white/80 active:scale-90 transition-all cursor-pointer"
                    />
                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 flex items-center justify-center text-white active:scale-90 transition-all cursor-pointer"
                    >
                        {isPlaying ? <FaPause className="text-[28px]" /> : <FaPlay className="text-[26px] ml-0.5" />}
                    </button>
                    <FaForward
                        onClick={handleForward}
                        className="text-white text-[19px] hover:text-white/80 active:scale-90 transition-all cursor-pointer"
                    />
                </div>

                <MdAirplay className="text-white text-[19px] opacity-40 hover:opacity-60 cursor-pointer" />
            </div>

            {/* Subtle gloss effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        </div>
    );
};

// Sub-component for Instagram-style Heart
const InstagramHeart = forwardRef(({ variant = 1, ...props }, ref) => (
    <svg width="100" height="100" viewBox="0 0 24 24" ref={ref} {...props}>
        <defs>
            <linearGradient id="instaScale1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#833AB4" />
                <stop offset="50%" stopColor="#FD1D1D" />
                <stop offset="100%" stopColor="#FCAF45" />
            </linearGradient>
            <linearGradient id="instaScale2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF0080" />
                <stop offset="50%" stopColor="#FF66B2" />
                <stop offset="100%" stopColor="#FF99CC" />
            </linearGradient>
            <linearGradient id="instaScale3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D4D" />
                <stop offset="50%" stopColor="#FF8533" />
                <stop offset="100%" stopColor="#FFCC00" />
            </linearGradient>
        </defs>
        <path fill={`url(#instaScale${variant})`} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
));

// Sub-component for Mac-Style Video Card
const MacVideoCard = ({ item }) => {
    const heartRef = useRef(null);
    const containerRef = useRef(null);
    const [heartVariant, setHeartVariant] = useState(1);

    const handleLike = (e) => {
        e.stopPropagation(); // Prevent drag interference

        const heart = heartRef.current;
        if (!heart) return;

        // Shuffle heart variant (ensure it's different from current if possible, or just random)
        const nextVariant = Math.floor(Math.random() * 3) + 1;
        setHeartVariant(nextVariant);

        // Reset and animate
        gsap.killTweensOf(heart);

        const tl = gsap.timeline();

        // Random rotation for natural feel (-15 to 15 deg)
        const randomRotation = (Math.random() * 30) - 15;

        // Calculate click position relative to video container
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Initial set - Position at click coordinates
        gsap.set(heart, {
            scale: 0,
            opacity: 0,
            rotation: randomRotation,
            left: x,
            top: y,
            xPercent: -50,
            yPercent: -50,
            y: 0 // Reset transform y
        });

        // Pop in
        tl.to(heart, {
            scale: 1, // Smaller scale (was 1.2)
            opacity: 1,
            rotation: 0,
            duration: 0.4,
            ease: "elastic.out(1.2, 0.5)"
        })
            // Float away/fade out
            .to(heart, {
                scale: 1.2,
                opacity: 0,
                y: -60,
                duration: 0.6,
                ease: "power2.out"
            }, "+=0.1"); // Small hold before fade
    };

    return (
        <div
            ref={containerRef}
            className="w-full bg-[#f5f5f7] rounded-[12px] overflow-hidden shadow-2xl border border-black/10 pointer-events-auto font-apple select-none relative group"
        >
            {/* Mac Title Bar */}
            <div className="h-7 bg-[#eaeaea] border-b border-[#dcdcdc] flex items-center px-3 relative">
                {/* Traffic Lights */}
                <div className="flex items-center gap-1.5 z-10">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
                </div>
                {/* Title */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[#4d4d4d] text-[13px] font-semibold opacity-80">About me in short</span>
                </div>
            </div>

            {/* Video Content */}
            <div
                className="relative w-full h-44 bg-black overflow-hidden cursor-pointer"
                onClick={handleLike}
            >
                <video
                    src={item.video}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    draggable="false"
                />

                {/* Instagram Heart */}
                <div className="absolute inset-0 pointer-events-none z-20">
                    <InstagramHeart
                        ref={heartRef}
                        variant={heartVariant}
                        className="w-14 h-14 drop-shadow-lg opacity-0 absolute" // Added absolute
                    />
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// CINEMATIC OVERLAY - Beat-Synced Superman Effect
// ============================================================================
const CinematicOverlay = ({ audioDataRef, isActive }) => {
    const overlayRef = useRef(null);
    const atmosphereRef = useRef(null);
    const flashRef = useRef(null);
    const energyFieldRef = useRef(null);
    const grainRef = useRef(null);
    const parasiteRef = useRef(null);
    const vignetteRef = useRef(null);
    const strikeTriggeredRef = useRef(false);

    useEffect(() => {
        if (!isActive || !overlayRef.current) return;

        // Fade in the overlay
        gsap.to(overlayRef.current, {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out"
        });

        // GSAP ticker for smooth 60fps beat-reactive updates
        const updateVisuals = () => {
            if (!audioDataRef?.current || !isActive) return;

            const { energy, peak, bassEnergy, currentTime = 0, duration = 0, trackTitle = "" } = audioDataRef.current;

            // --- THEME DETECTION ---
            const isSuperman = trackTitle === "What Are You Going To Do When You Are Not Saving The World?";
            const isOppenheimer = trackTitle === "Can You Hear The Music";
            const isInterstellar = trackTitle === "Cornfield Chase";

            // --- SCRIPTED SEQUENCE LOGIC ---
            let scriptedDarkness = 0;
            let flickerSuppression = 1.0;
            let parasiteScale = 1.8; // Edge of screen
            let parasiteOpacity = 0;
            let isTransitioning = false;

            // Superman Timings (134s - 158s spread, 158s-160.5s dark, 160.5s+ reveal)
            if (isSuperman) {
                if (currentTime < 158) strikeTriggeredRef.current = false;

                if (currentTime >= 134 && currentTime < 158) {
                    const progress = (currentTime - 134) / 24;
                    scriptedDarkness = Math.min(progress * 1.1, 1);
                    parasiteScale = 1.8 - (progress * 0.8);
                    parasiteOpacity = Math.min(progress * 1.5, 1);
                    if (progress > 0.5) flickerSuppression = Math.max(0, 1.0 - ((progress - 0.5) * 2));
                } else if (currentTime >= 158 && currentTime < 160.5) {
                    scriptedDarkness = 1.0; parasiteScale = 1.0; parasiteOpacity = 1.0; flickerSuppression = 0; isTransitioning = true;
                } else if (currentTime >= 160.5 && currentTime < 172) {
                    const revealProgress = (currentTime - 160.5) / 11.5;
                    scriptedDarkness = 1.0 - revealProgress;
                    parasiteScale = 1.0 + (revealProgress * 1.5);
                    parasiteOpacity = 1.0 - revealProgress;
                    flickerSuppression = revealProgress;
                }
            }
            // Oppenheimer & Interstellar Timings (0s - 42s spread, 42s-43s dark/depth, 43s+ reveal)
            else if (isOppenheimer || isInterstellar) {
                if (currentTime < 42) strikeTriggeredRef.current = false;

                if (currentTime >= 0 && currentTime < 42) {
                    const progress = currentTime / 42; // Build over the first 42 seconds
                    scriptedDarkness = Math.min(progress * 1.1, 1);
                    parasiteScale = 1.8 - (progress * 0.8);
                    parasiteOpacity = Math.min(progress * 1.5, 1);
                    if (progress > 0.5) flickerSuppression = Math.max(0, 1.0 - ((progress - 0.5) * 2));
                } else if (currentTime >= 42 && currentTime < 43) {
                    scriptedDarkness = 1.0; parasiteScale = 1.0; parasiteOpacity = 1.0; flickerSuppression = 0; isTransitioning = true;
                } else if (currentTime >= 43 && currentTime < 55) {
                    const revealProgress = (currentTime - 43) / 12;
                    scriptedDarkness = 1.0 - revealProgress;
                    parasiteScale = 1.0 + (revealProgress * 1.5);
                    parasiteOpacity = 1.0 - revealProgress;
                    flickerSuppression = revealProgress;
                }
            }

            // --- END OF SONG FADE OUT ---
            let finalFadeOut = 1.0;
            if (duration > 0 && currentTime > duration - 5) {
                finalFadeOut = Math.max(0, (duration - currentTime) / 5);
            }

            // --- THEMED VISUALS ---
            let themeColors = {
                flash: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 70%)',
                energy: 'radial-gradient(circle at 50% 60%, rgba(100, 100, 100, 0.5) 0%, rgba(50, 50, 50, 0.3) 40%, transparent 70%)',
                atmosphere: '#000',
                vignette: 'rgba(0, 0, 0, 0.7)'
            };

            if (isOppenheimer) {
                themeColors = {
                    ...themeColors,
                    energy: 'radial-gradient(circle at 50% 60%, rgba(255, 170, 0, 0.4) 0%, rgba(255, 80, 0, 0.2) 40%, transparent 70%)',
                    atmosphere: '#1a0500',
                    vignette: 'rgba(26, 5, 0, 0.8)'
                };
            } else if (isInterstellar) {
                themeColors = {
                    ...themeColors,
                    energy: 'radial-gradient(circle at 50% 60%, rgba(100, 200, 255, 0.3) 0%, rgba(0, 100, 255, 0.1) 40%, transparent 70%)',
                    atmosphere: '#000814', // Deep Space Navy
                    vignette: 'rgba(0, 8, 20, 0.8)'
                };
            }

            const amplifiedBass = Math.min(bassEnergy * 5, 1.5);
            const amplifiedEnergy = Math.min(energy * 8, 1.5);

            // Energy Field
            if (energyFieldRef.current) {
                const baseScale = 1 + (amplifiedBass * 0.8);
                const opacity = (0.2 + (amplifiedBass * 0.8)) * flickerSuppression * finalFadeOut;
                energyFieldRef.current.style.background = themeColors.energy;
                energyFieldRef.current.style.transform = `scale(${baseScale})`;
                energyFieldRef.current.style.opacity = opacity;
            }

            // Thunder Flash
            if (flashRef.current) {
                if (isTransitioning || finalFadeOut === 0) {
                    flashRef.current.style.opacity = 0;
                } else {
                    const flashOpacity = (bassEnergy > 0.1 ? 0.6 + (bassEnergy * 0.4) : (bassEnergy > 0.05 ? 0.3 + (bassEnergy * 0.3) : 0)) * flickerSuppression * finalFadeOut;
                    if (flashOpacity > 0) {
                        flashRef.current.style.background = themeColors.flash;
                        flashRef.current.style.opacity = flashOpacity;
                        gsap.to(flashRef.current, {
                            opacity: 0,
                            duration: bassEnergy > 0.1 ? 0.08 : 0.2,
                            ease: bassEnergy > 0.1 ? "power4.out" : "power2.out"
                        });
                    }
                }
            }

            // Atmosphere
            if (atmosphereRef.current) {
                const baseDarkness = Math.max(0.7, scriptedDarkness);
                const atmosphereOpacity = Math.min(baseDarkness + (amplifiedEnergy * 0.3), 1) * finalFadeOut;
                atmosphereRef.current.style.backgroundColor = themeColors.atmosphere;
                atmosphereRef.current.style.opacity = atmosphereOpacity;

                const scaleBoost = 1 + (amplifiedEnergy * 0.08) + (scriptedDarkness * 0.1);
                atmosphereRef.current.style.transform = `scale(${scaleBoost})`;
            }

            // Vignette
            if (vignetteRef.current) {
                vignetteRef.current.style.background = `radial-gradient(circle at 50% 50%, transparent 30%, ${themeColors.vignette} 100%)`;
            }

            // Parasite Spread Layer
            if (parasiteRef.current) {
                parasiteRef.current.style.background = isOppenheimer
                    ? `radial-gradient(circle at 50% 50%, transparent 20%, ${themeColors.atmosphere} 70%, ${themeColors.atmosphere} 100%)`
                    : 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 1) 100%)';
                parasiteRef.current.style.transform = `scale(${parasiteScale})`;
                parasiteRef.current.style.opacity = parasiteOpacity * finalFadeOut;
            }
        };

        gsap.ticker.add(updateVisuals);

        return () => {
            gsap.ticker.remove(updateVisuals);
            if (overlayRef.current) {
                gsap.to(overlayRef.current, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.in"
                });
            }
        };
    }, [isActive, audioDataRef]);

    if (!isActive) return null;

    return (
        <div
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 1, opacity: 0 }} // zIndex 1 to be above bg but below content
        >
            {/* Base Cinematic Atmosphere - Pure Black for "Complete Dark" effect */}
            <div
                ref={atmosphereRef}
                className="absolute inset-0 transition-opacity duration-150"
                style={{
                    backgroundColor: '#000',
                    opacity: 0.7,
                    willChange: 'transform, opacity'
                }}
            />

            {/* Energy Field - Neutral grey gravity ripple (More Light) */}
            <div
                ref={energyFieldRef}
                className="absolute inset-0 transition-transform"
                style={{
                    background: 'radial-gradient(circle at 50% 60%, rgba(100, 100, 100, 0.5) 0%, rgba(50, 50, 50, 0.3) 40%, transparent 70%)',
                    transform: 'scale(1)',
                    opacity: 0.1,
                    willChange: 'transform, opacity'
                }}
            />

            {/* Thunder Flash - Centered Bright Burst */}
            <div
                ref={flashRef}
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 70%)',
                    opacity: 0,
                    willChange: 'opacity'
                }}
            />

            {/* Parasite Spread Layer (Venom/Viral Capture) */}
            <div
                ref={parasiteRef}
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 1) 100%)',
                    transform: 'scale(1.8)',
                    opacity: 0,
                    willChange: 'transform, opacity'
                }}
            />

            {/* Vignette - Cinematic frame */}
            <div
                ref={vignetteRef}
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.7) 100%)'
                }}
            />

            {/* Film Grain - Subtle IMAX texture */}
            <div
                ref={grainRef}
                className="absolute inset-0 opacity-[0.1]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                }}
            />

            {/* Subtle Horizontal Artifacts - IMAX feel */}
            <div
                className="absolute left-0 w-full h-[1px] bg-white/5 blur-[4px] animate-pulse"
                style={{ top: '30%' }}
            />
            <div
                className="absolute left-0 w-full h-[1px] bg-white/5 blur-[4px] animate-pulse"
                style={{ top: '70%', animationDelay: '1s' }}
            />
        </div>
    );
};

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
    const [isMobile, setIsMobile] = useState(false);

    // Cinematic Effect State
    const [cinematicMode, setCinematicMode] = useState(false);
    const audioDataRef = useRef({ energy: 0, bassEnergy: 0, peak: 0 });

    // Handle audio data from AppleMusicCard
    const handleAudioData = useCallback((data) => {
        // Update the ref (no re-render)
        audioDataRef.current = data;

        // Check if this is a track with a cinematic sequence
        const isManOfSteel = data.trackTitle === "What Are You Going To Do When You Are Not Saving The World?";
        const isOppenheimer = data.trackTitle === "Can You Hear The Music";
        const isInterstellar = data.trackTitle === "Cornfield Chase";
        const hasCinematicSequence = isManOfSteel || isOppenheimer || isInterstellar;

        // Only update state if it changes (to avoid re-renders)
        setCinematicMode(prevMode => {
            if (hasCinematicSequence && data.energy > 0) {
                return true;
            } else if (!hasCinematicSequence || data.energy === 0) {
                return false;
            }
            return prevMode;
        });
    }, []);

    // Initial check for mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);


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
                    const cardInfo = antiGravityCards[i];
                    const scaleFactor = isMobile ? 0.65 : 1;

                    gsap.to(card, {
                        z: 0,
                        scale: scaleFactor, // Target scale (1 on desktop, 0.65 on mobile)
                        opacity: 1,
                        duration: 1.5,
                        delay: cardInfo?.delay !== undefined ? cardInfo.delay : Math.random() * 0.5,
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

                // Mobile Adjustments
                // 1. Scale W/H down to 60-70%
                // 2. Clamp Left to be visible (10% - 90%)
                const scaleFactor = isMobile ? 0.65 : 1;
                let targetLeft = cardInfo.l;
                let targetTop = cardInfo.t;

                if (isMobile) {
                    // Compress horizontal spread towards center
                    targetLeft = 50 + (targetLeft - 50) * 0.7; // Reduce spread by 30%

                    // Spread vertically a bit more to avoid bunching if needed
                    // (Optional, can leave as is for now)
                }

                gsap.set(card, {
                    left: `${targetLeft}%`,
                    top: `${targetTop}%`,
                    rotation: cardInfo.r,
                    xPercent: -50,
                    yPercent: -50,
                    z: -3000,
                    scale: 0.1 * scaleFactor, // Initial scale logic handled separately? No, start small
                    opacity: 0,
                    transformPerspective: 1000
                });


                Draggable.create(card, {
                    type: "x,y",
                    bounds: null,
                    inertia: false,
                    edgeResistance: 0,
                    dragResistance: 0,
                    cursor: "grab",
                    activeCursor: "grabbing",
                    dragClickables: true,
                    allowEventDefault: true,
                    onPress: function (e) {
                        // Kill drag if clicking something that should be clickable
                        if (e.target.closest('[data-clickable="true"]') || e.target.closest('button')) {
                            this.endDrag();
                            return;
                        }

                        // Kill any active drift
                        if (this.driftTween) this.driftTween.kill();

                        gsap.to(this.target, { scale: 1.05, duration: 0.2 });

                        // Reset velocity tracking
                        this.lastTime = Date.now();
                        this.velocityX = 0;
                        this.velocityY = 0;
                    },
                    onDragStart: function (e) {
                        if (e.target.closest('[data-clickable="true"]') || e.target.closest('button')) {
                            this.endDrag();
                        }
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
                            {item.type === 'spotify' ? (
                                <SpotifyCard item={item} />
                            ) : item.type === 'apple' ? (
                                <AppleMusicCard item={item} onAudioData={handleAudioData} />
                            ) : item.type === 'video' ? (
                                <MacVideoCard item={item} />
                            ) : item.type === 'project' ? (
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

                {/* Cinematic Background Effect - Support for Superman & Oppenheimer */}
                <CinematicOverlay audioDataRef={audioDataRef} isActive={cinematicMode} />

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
