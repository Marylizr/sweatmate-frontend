import React from "react";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import NavBar from "../../components/navBar/navBar";
import styles from "../aboutUS/about.module.css";

export const AboutUs = () => {
  return (
    <ParallaxProvider>
      <div className={styles.container}>
        <NavBar />

         <div className={styles.wrapper}>

            {/* Hero Section */}
            <header className={styles.header}>
               
                  <h1 className={styles.heroTitle}>Turning Passion Into Purpose</h1>
              
               <Parallax speed={-10}>
                  <img
                  src="https://res.cloudinary.com/da6il8qmv/image/upload/v1695127637/group5_rrew5h.png"
                  alt="About Us"
                  className={styles.headerImage}
                  />
               </Parallax>
            </header>

            {/* Story Section */}
            <section className={styles.section}>
               <Parallax speed={5}>
                  <h2>Our Story</h2>
               </Parallax>
               <Parallax speed={3}>
                  <p>
                  Over a decade ago, I embarked on a journey that would forever
                  transform my life. My fitness journey started as a personal goal
                  but quickly grew into something much bigger—a passion for
                  inspiring others to embrace a healthier and more fulfilling
                  lifestyle. Along the way, I shared my progress and tips on social
                  media, and soon, friends, family, and even acquaintances began
                  reaching out for advice on how they could achieve the same
                  results.
                  </p>
               </Parallax>
               <Parallax speed={1}>
                  <p>
                  At first, I was overjoyed to help. I created personalized routines
                  and adapted them to each person’s needs, but I soon realized this
                  approach wasn’t sustainable. Each person’s fitness journey is
                  unique, and I wanted to create something that could provide
                  lasting support—not just a one-time solution.
                  </p>
               </Parallax>
            </section>

            {/* Problem Section */}
            <section className={styles.section}>
               <Parallax speed={-5}>
                  <h2>The Problem We’re Solving</h2>
               </Parallax>
               <Parallax speed={-3}>
                  <p>
                  At the gym, I saw countless women and young adults who looked lost
                  and overwhelmed. They came with the best intentions but lacked
                  guidance—no workout plans, no clear starting point, and no idea
                  how to progress. This often led to frustration, discouragement,
                  and, ultimately, quitting before they ever had the chance to see
                  results.
                  </p>
               </Parallax>
               <Parallax speed={-1}>
                  <p>
                  On the flip side, personal trainers worked tirelessly but often
                  without structure. Most didn’t track their clients’ progress or
                  create personalized plans, making it difficult to celebrate
                  achievements or optimize workouts. This inspired me to build a
                  solution—a platform that bridges the gap between personal trainers
                  and clients, empowering both to achieve their goals.
                  </p>
               </Parallax>
            </section>

            {/* Mission Section */}
            <section className={styles.missionSection}>
               <Parallax speed={-7}>
                  <h2>Our Mission</h2>
               </Parallax>
               <Parallax speed={-5}>
                  <ul>
                  <li>
                     <strong>Guide and Inspire:</strong> Helping people start their
                     healthy journey with confidence.
                  </li>
                  <li>
                     <strong>Connect and Empower:</strong> Building a supportive
                     community where trainers and clients work together to achieve
                     incredible results.
                  </li>
                  <li>
                     <strong>Create Change:</strong> Helping as many people as
                     possible feel strong, positive, and capable of achieving their
                     best selves.
                  </li>
                  </ul>
               </Parallax>
            </section>

            {/* Vision Section */}
            <section className={styles.visionSection}>
               <Parallax speed={-10}>
                  <h2>A Vision for the Future</h2>
               </Parallax>
               <Parallax speed={-7}>
                  <p>
                  This app isn’t just a product—it’s a passion project born out of
                  love for health, fitness, and helping others. I dream of reaching
                  people across the world, changing lives one workout at a time, and
                  fostering a community where knowledge and encouragement flow
                  freely.
                  </p>
               </Parallax>
               <Parallax speed={-5}>
                  <p>
                  Your journey starts here, and I couldn’t be more excited to walk
                  this path with you. Together, let’s build a healthier, happier,
                  and stronger future.
                  </p>
               </Parallax>
            </section>

            {/* Call to Action */}
            <footer className={styles.footer}>
               <Parallax speed={-5}>
                  <p>
                  Ready to start your journey?{" "}
                  <a href="/signup" className={styles.ctaLink}>
                     Join Us Today!
                  </a>
                  </p>
               </Parallax>
            </footer>
         </div>
      </div>
    </ParallaxProvider>
  );
};

export default AboutUs;
