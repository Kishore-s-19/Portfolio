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
import portfolio2026 from './images/portfolio 2026(1).avif';
import arrowImage from './images/arrow.avif';
import createImage from './images/create(1).avif';
import designProgressImage from './images/design progress(1).avif';
import faceidImage from './images/faceid(1).avif';
import whyAmIHereImage from './images/why am i here(1).avif';
import portraitShot from './images/IMG_3293.png';
import hansZimmerMusic from './music/Man of Steel Soundtrack ｜ What Are You Going to Do When You Are Not Saving the World？ - Hans Zimmer.mp3';
import cornfieldChaseMusic from './music/Interstellar Official Soundtrack ｜ Cornfield Chase – Hans Zimmer ｜ WaterTower.mp3';
import canYouHearTheMusic from './music/Can You Hear The Music.mp3';
import aboutMeVideo from './video/ScreenRecording_02-07-2026 00-46-07_1_1.mp4';

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
        l: 52.5,
        t: 55,
        r: 0,
        w: 30,
        zi: 20
    },
    {
        type: 'image',
        title: 'Create',
        image: createImage,
        l: 85,
        t: 31.2,
        r: 18,
        w: 115,
        zi: 35
    },
    {
        type: 'image',
        title: 'Design Progress',
        image: designProgressImage,
        l: 45,
        t: 50,
        r: 0,
        w: 380
    },
    {
        type: 'image',
        title: 'FaceID',
        image: faceidImage,
        l: 25.5,
        t: 29,
        r: 0,
        w: 130
    },
    {
        type: 'apple',
        tracks: [
            {
                title: 'What Are You Going To Do When You Are Not Saving The World?',
                artist: 'Hans Zimmer',
                image: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/81/e4/f1/81e4f187-cfde-607d-a4f2-50985495456e/794043169724.jpg/600x600bb.jpg',
                audioUrl: hansZimmerMusic,
                trackUrl: 'https://music.apple.com/in/song/what-are-you-going-to-do-when-you-are-not-saving-the-world/1454398394'
            },
            {
                title: 'Cornfield Chase',
                artist: 'Hans Zimmer',
                image: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f4/5b/73/f45b735a-8d7a-9713-b217-0f8e1593c28b/794043201943.jpg/592x592bb.webp',
                audioUrl: cornfieldChaseMusic,
                trackUrl: 'https://music.apple.com/in/song/cornfield-chase/1533984393'
            },
            {
                title: 'Can You Hear The Music',
                artist: 'Ludwig Göransson',
                image: 'https://is1-ssl.mzstatic.com/image/thumb/Video126/v4/1a/5c/ac/1a5cacf0-9cec-623b-7627-e729e416cd5a/Job85a5e805-e111-49d6-8d17-69054cb02f6d-152847553-PreviewImage_Preview_Image_Intermediate_nonvideo_sdr_291457807_1503330704-Time1689395212724.png/592x592bb.webp',
                audioUrl: canYouHearTheMusic,
                trackUrl: 'https://music.apple.com/in/song/can-you-hear-the-music/1697599275'
            }
        ],
        l: 23.5,
        t: 78,
        r: 0,
        w: 380,
        zi: 40,
        delay: 0.4
    },
    {
        type: 'image',
        title: 'Portrait',
        image: portraitShot,
        l: 10.8,
        t: 66.5,
        r: 0,
        w: 200,
        zi: 50,
        delay: 0.1
    },
    {
        type: 'image',
        title: 'Why am I here?',
        image: whyAmIHereImage,
        l: 85,
        t: 75,
        r: 0,
        w: 220
    },
    {
        type: 'video',
        title: 'About me',
        video: aboutMeVideo,
        l: 75,
        t: 45,
        r: 0,
        w: 300,
        zi: 30
    }
];
