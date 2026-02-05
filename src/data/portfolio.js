import portfolioImage from '../assets/images/portfolio1.png';
import hersheyImage from '../assets/images/site pic.png';
import groomupImage from '../assets/images/groomup.png';
import menuarImage from '../assets/images/menuar.png';

export const menuItems = [
    { text: 'Java', image: 'https://i.pinimg.com/736x/36/3e/ae/363eae82e52a8a5681622235ea4a38d7.jpg' },
    { text: 'Python', image: 'https://www.pngmart.com/files/23/Python-Logo-PNG-Image.png' },
    { text: 'MySQL', image: 'https://www.freepnglogos.com/uploads/logo-mysql-png/logo-mysql-development-mysql-logo-code-icon-9.png' },
    { text: 'GitHub', image: 'https://cdn-icons-png.flaticon.com/512/25/25231.png' },
    { text: 'SpringBoot', image: 'https://img.icons8.com/color/480/spring-logo.png' },
    { text: 'JavaScript', image: 'https://seekvectors.com/files/download/JAVASCRIPT%20Logo.png' },
    { text: 'React', image: 'https://www.agilesparks.com/wp-content/uploads/2021/08/react-1024x1024.png' },
    { text: 'PremierePro', image: 'https://vectorseek.com/wp-content/uploads/2022/02/Adobe-Premiere-Pro-Logo-Vector-768x768.jpg' }
];

export const projectsData = [
    {
        id: 1,
        title: 'Portfolio Website',
        description: 'Personal portfolio to showcase my design and coding projects.',
        tags: ['React', 'TailwindCSS', 'Framer', 'JavaScript'],
        github: 'https://github.com/Kishore-s-19/Portfolio',
        live: 'https://live-demo.com',
        image: portfolioImage
    },
    {
        id: 2,
        title: 'Hershey-Product-site',
        description: 'A premium scrollytelling e-commerce experience for Hershey’s, transforming a static product page into an immersive narrative. Built using Next.js 14 and Framer Motion',
        tags: ['Next.js 14', 'javascript', 'Framer motion', 'vercel'],
        github: 'https://github.com/Kishore-s-19/Product-site_Hershey',
        live: 'https://product-site-hershey.vercel.app/',
        image: hersheyImage
    },
    {
        id: 3,
        title: 'E-commerce Platform',
        description: 'Groomup is a full-stack grooming service platform that enables users to explore services, book appointments, and make secure online payments.',
        tags: ['React', 'Springboot', 'MySQL', 'Razorpay'],
        github: 'https://github.com/Kishore-s-19/GroomupApp',
        live: 'https://groomup-app.vercel.app/',
        image: groomupImage
    },
    {
        id: 4,
        title: 'MenuAR – QR-Based Augmented Reality Menu',
        description: 'MenuAR is a QR-based web application that lets restaurant customers view dishes in augmented reality before ordering',
        tags: ['Java', 'Springboot', 'React', 'MySql'],
        github: 'https://github.com/Kishore-s-19/MenuAR',
        live: 'https://menu-ar-tau.vercel.app/restaurant',
        image: menuarImage
    }
];
// Manual coordinates for Anti-Gravity cards (4 projects + 8 tech icons)
// l: Left (position from left as % of screen width)
// t: Top (position from top as % of screen height)
// r: Rotation (initial tilt in degrees)
export const antiGravityPositions = [
    { l: 25, t: 25, r: 0 },   // 1. Portfolio Website
    { l: 75, t: 28, r: 0 },  // 2. Hershey-Product-site
    { l: 22, t: 72, r: 0 },  // 3. E-commerce Platform (Groomup)
    { l: 78, t: 75, r: 0 },  // 4. MenuAR
    { l: 50, t: 50, r: 0 },   // 5. Java (Tech)
    { l: 15, t: 50, r: 15 },  // 6. Python (Tech)
    { l: 85, t: 48, r: -12 }, // 7. MySQL (Tech)
    { l: 50, t: 18, r: -5 },  // 8. GitHub (Tech)
    { l: 52, t: 82, r: 8 },   // 9. SpringBoot (Tech)
    { l: 38, t: 42, r: -10 }, // 10. JavaScript (Tech)
    { l: 62, t: 58, r: 5 },   // 11. React (Tech)
    { l: 42, t: 68, r: -15 }, // 12. PremierePro (Tech)
    { l: 12, t: 22, r: -5 }   // 13. AirDrop Card (Portrait)
];
