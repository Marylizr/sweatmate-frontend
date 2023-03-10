import React from 'react';
import NavBar from '../../components/navBar/navBar';
import styles from '../healthy/healthy.module.css';
import meditation from '../../utils/meditation.jpg'
import fruits from '../../utils/fruits.jpg'
import lean from '../../utils/lean_protein.jpg'
import grain from '../../utils/whole_grain.jpg'

const HealthyTips = () => {
  return (
    <div className={styles.container}>
      <NavBar />
      <h2>
         HealthyTips
      </h2>
      <div className={styles.tips}>
            <img src={meditation} alt=''/>
            <ul>
               <li> Eat a variety of fruits and vegetables every day to ensure you're getting a range of nutrients.</li>
               <li> Drink plenty of water to stay hydrated and support healthy bodily functions.</li>
               <li> Incorporate whole grains into your diet, such as brown rice, quinoa, and whole-wheat bread.</li>
               <li> Limit your consumption of processed and packaged foods, which are often high in salt, sugar, and unhealthy fats.</li>
               <li> Include lean sources of protein in your meals, such as chicken, fish, tofu, and legumes.</li>
            </ul>
            <img src={lean} alt=''/>
            <ul>
               <li> Aim to get at least 30 minutes of physical activity most days of the week.</li>
               <li> Practice stress-reducing techniques such as meditation, yoga, or deep breathing exercises.</li>
               <li> Get enough sleep, which is usually 7-8 hours per night for most adults.</li>
               <li> Limit your alcohol intake, and avoid smoking and recreational drugs.</li>
               <li>Choose healthy fats such as avocado, nuts, and olive oil instead of saturated and trans fats found in fried 
                  and processed foods.</li>
            </ul>
            <img src={fruits} alt='' />
            <ul>
               <li>Take breaks from sitting throughout the day and move your body regularly.</li>
               <li>Eat mindfully, paying attention to your hunger and fullness cues, and savoring your food.</li>
               <li>Cook meals at home using fresh ingredients and herbs and spices to add flavor.</li>
               <li>Plan your meals and snacks in advance to help you make healthy choices and avoid impulsively eating unhealthy foods.</li>
               <li>Practice good hygiene, including washing your hands frequently and avoiding touching your face.</li>
            </ul>
            <img src={grain} alt=''/>
            <ul>
               <li>Take a multivitamin or supplement if you're not getting enough nutrients from your diet.</li>
               <li>Stay socially connected with friends and family to support your mental and emotional well-being.</li>
               <li>Try new activities or hobbies to keep your brain active and engaged.</li>
               <li>Use sunscreen to protect your skin from harmful UV rays.</li>
               <li>Practice gratitude by focusing on the positive aspects of your life and expressing appreciation 
                  for the things you have.
               </li>
            </ul>
            
      </div>
    </div>
  )
}

export default HealthyTips