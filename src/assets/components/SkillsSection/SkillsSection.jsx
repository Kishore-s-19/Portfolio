import React, { useEffect, useRef } from 'react';
import './SkillsSection.css';
import {
    FaGitAlt, FaGithub, FaAws, FaFigma
} from 'react-icons/fa';
import {
    SiVercel, SiPostman, SiRailway, SiRender, SiAdobepremierepro, SiEclipseide, SiBlender
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
    {
        title: "Tools & Technologies",
        color: "#ffffff", // Heading color remains white
        skills: [
            { name: "Figma", level: "Intermediate", desc: "UI/UX design and prototyping", icon: <FaFigma />, brandColor: "#F24E1E" },
            { name: "Railway", level: "Intermediate", desc: "Cloud infrastructure and hosting", icon: <SiRailway />, brandColor: "#0B0D0E" },
            { name: "Render", level: "Intermediate", desc: "Cloud platform for modern web apps", icon: <SiRender />, brandColor: "#46E3B7" },
            { name: "Adobe Premiere Pro", level: "Advanced", desc: "Professional video editing", icon: <SiAdobepremierepro />, brandColor: "#9999FF" },
            { name: "Git", level: "Intermediate", desc: "Version control, branching, collaboration", icon: <FaGitAlt />, brandColor: "#F05032" },
            { name: "GitHub", level: "Intermediate", desc: "Code hosting, CI/CD, project management", icon: <FaGithub />, brandColor: "#333333" },
            { name: "AWS", level: "Intermediate", desc: "EC2, RDS, S3, cloud deployment", icon: <FaAws />, brandColor: "#FF9900" },
            { name: "Vercel", level: "Intermediate", desc: "Frontend deployment, serverless functions", icon: <SiVercel />, brandColor: "#000000" },
            { name: "Postman", level: "Intermediate", desc: "API testing and documentation", icon: <SiPostman />, brandColor: "#FF6C37" },
            { name: "VS Code", level: "Advanced", desc: "Primary IDE with custom setup", icon: <VscVscode />, brandColor: "#007ACC" },
            { name: "Eclipse IDE", level: "Advanced", desc: "Java development environment", icon: <SiEclipseide />, brandColor: "#2C2255" },
            { name: "Blender", level: "Beginner", desc: "3D modeling and animation", icon: <SiBlender />, brandColor: "#EA7600" },
        ]
    }
];

const SkillsSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation
            gsap.from(".skills-header", {
                scrollTrigger: {
                    trigger: ".skills-header",
                    start: "top 90%",
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: "power3.out"
            });

            // Animate each category group
            skillCategories.forEach((_, idx) => {
                const selector = `.category-group-${idx}`;

                // Animate category title and underline
                gsap.from(selector, {
                    scrollTrigger: {
                        trigger: selector,
                        start: "top 95%",
                    },
                    opacity: 0,
                    y: 20,
                    duration: 0.8,
                    ease: "power3.out",
                    clearProps: "all"
                });

                // Animate cards with stagger
                gsap.from(`${selector} .skill-card`, {
                    scrollTrigger: {
                        trigger: selector,
                        start: "top 95%",
                    },
                    opacity: 0,
                    y: 40,
                    scale: 0.9,
                    stagger: 0.1,
                    duration: 1,
                    ease: "power4.out",
                    clearProps: "all",
                    delay: 0.1
                });
            });

            // Double check refresh
            ScrollTrigger.refresh();

            // Refresh ScrollTrigger after a delay to ensure correct positioning
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 600);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="skills-section font-outfit" ref={sectionRef}>
            <div className="skills-container">
                <div className="skills-header">
                    <h2 className="skills-title">Technical Skills</h2>
                    <p className="skills-subtitle">Technologies and tools I work with</p>
                    <div className="skills-underline"></div>
                </div>

                {skillCategories.map((category, catIdx) => (
                    <div key={catIdx} className={`skills-category category-group-${catIdx}`}>
                        <h3 className="category-title" style={{ color: '#ffffff' }}>
                            {category.title}
                        </h3>
                        <div className="skills-grid">
                            {category.skills.map((skill, skillIdx) => (
                                <div key={skillIdx} className="skill-card">
                                    <div className="skill-icon-wrapper" style={{ '--accent-color': skill.brandColor }}>
                                        <div className="skill-icon">{skill.icon}</div>
                                    </div>
                                    <div className="skill-info">
                                        <h4 className="skill-name">{skill.name}</h4>
                                        <span className="skill-level">{skill.level}</span>
                                        <p className="skill-desc">{skill.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SkillsSection;
