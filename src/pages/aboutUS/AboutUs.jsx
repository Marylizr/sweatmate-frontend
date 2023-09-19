import React from 'react';
import NavBar from '../../components/navBar/navBar';
import styles from '../aboutUS/about.module.css';


export const AboutUs = () => {
  return (
    <div className={styles.container}>
      <NavBar />
      <h2>AboutUs</h2>
      <div className={styles.img}>
         <img src= 'https://res.cloudinary.com/da6il8qmv/image/upload/v1695127637/group5_rrew5h.png' alt=''/>
      </div>
      <div className={styles.wrap}>
      <p>
         Welcome to beFit, your ultimate online resource for all things fitness! 
         Our website is dedicated to providing you with accurate and reliable information on 
         everything related to health, fitness, and nutrition.
         Our team of experts is passionate about helping people achieve their health and 
         fitness goals, and we're committed to providing you with the most up-to-date and effective 
         fitness advice. Whether you're looking to lose weight, build muscle, or just improve your 
         overall health, we have the tools and resources you need to succeed.
      </p>
      
      <p>
         At beFit, we believe that fitness is not just about physical activity, but it's 
         also about mental and emotional well-being. That's why we offer a variety of articles, guides, 
         and resources to help you achieve a healthy balance in your life.
         Our website features a wide range of content, including workout plans, nutrition advice, healthy recipes, 
         and wellness tips. We also have a community forum where you can connect with other fitness enthusiasts, 
         share your progress, and get support and encouragement.
      </p>
      <p>
         Our team is composed of certified fitness trainers, nutritionists, and health experts who have years of 
         experience in the fitness industry. We pride ourselves on providing you with scientifically-backed 
         information, so you can be confident that you're getting the most accurate and effective advice.
         We're excited to be your go-to resource for all things fitness, and we look forward to helping you achieve 
         your health and wellness goals. Thanks for visiting beFit, and happy training!
      </p>
      </div>
     

    </div>
  )
}
