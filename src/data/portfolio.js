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
import newImageCard from './images/IMG_3276.webp';
import portfolio2026 from './images/portfolio 2026.avif';
import arrowImage from './images/arrow.avif';
import createImage from './images/create.avif';
import designProgressImage from './images/design progress.avif';
import faceidImage from './images/faceid.avif';
import whyAmIHereImage from './images/why am i here.avif';

// Manual configuration for Anti-Gravity cards
// l: Left position (% of screen width)
// t: Top position (% of screen height)
// r: Rotation (degrees)
// w: Width (pixels)
export const antiGravityCards = [
    {
        type: 'image',
        title: 'Creative Shot',
        image: newImageCard,
        l: 25,
        t: 35,
        r: 0,
        w: 260
    },
    {
        type: 'image',
        title: 'Portfolio 2026',
        image: portfolio2026,
        l: 50,
        t: 70,
        r: 0,
        w: 220
    },
    {
        type: 'image',
        title: 'Arrow',
        image: arrowImage,
        l: 50,
        t: 55,
        r: 0,
        w: 30,
        zi: 20
    },
    {
        type: 'image',
        title: 'Create',
        image: createImage,
        l: 75,
        t: 25,
        r: 0,
        w: 180
    },
    {
        type: 'image',
        title: 'Design Progress',
        image: designProgressImage,
        l: 45,
        t: 50,
        r: 0,
        w: 300
    },
    {
        type: 'image',
        title: 'FaceID',
        image: faceidImage,
        l: 30,
        t: 20,
        r: 0,
        w: 150
    },
    {
        type: 'image',
        title: 'Why am I here?',
        image: whyAmIHereImage,
        l: 65,
        t: 45,
        r: 0,
        w: 200
    }
];
