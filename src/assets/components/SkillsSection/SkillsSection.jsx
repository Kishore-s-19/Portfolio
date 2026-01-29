import React, { useEffect, useRef } from 'react';
import './SkillsSection.css';
import {
    FaGitAlt, FaGithub, FaAws, FaFigma
} from 'react-icons/fa';
import {
    SiVercel, SiPostman
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
    {
        title: "Tools & Technologies",
        color: "#ffffff", // Changed to white per user request
        skills: [
            { name: "Figma", level: "Intermediate", desc: "UI/UX design and prototyping", icon: <FaFigma /> },
            { name: "Git", level: "Intermediate", desc: "Version control, branching, collaboration", icon: <FaGitAlt /> },
            { name: "GitHub", level: "Intermediate", desc: "Code hosting, CI/CD, project management", icon: <FaGithub /> },
            { name: "AWS", level: "Intermediate", desc: "EC2, RDS, S3, cloud deployment", icon: <FaAws /> },
            { name: "Vercel", level: "Intermediate", desc: "Frontend deployment, serverless functions", icon: <SiVercel /> },
            { name: "Postman", level: "Intermediate", desc: "API testing and documentation", icon: <SiPostman /> },
            { name: "VS Code", level: "Advanced", desc: "Primary IDE with custom setup", icon: <VscVscode /> },
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

                // Animate the category container
                gsap.from(selector, {
                    scrollTrigger: {
                        trigger: selector,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    },
                    opacity: 0,
                    y: 40,
                    duration: 1,
                    ease: "power3.out"
                });

                // Animate the cards inside the category
                gsap.from(`${selector} .skill-card`, {
                    scrollTrigger: {
                        trigger: selector,
                        start: "top 95%",
                    },
                    opacity: 0,
                    scale: 0.9,
                    y: 20,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "back.out(1.7)"
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
                        <h3 className="category-title" style={{ color: category.color }}>
                            {category.title}
                        </h3>
                        <div className="skills-grid">
                            {category.skills.map((skill, skillIdx) => (
                                <div key={skillIdx} className="skill-card">
                                    <div className="skill-icon-wrapper" style={{ '--accent-color': category.color }}>
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
