import React from 'react';
import styles from '../mealPlans/MealPlans.module.css';
import fruit from '../../../assets/fruit.svg';


const MealPlans = () => {
  return (
    <div className={styles.container}>
      <img src={fruit} alt='fruit-icon'/>
      <h2>Meal Plan </h2>
    </div>
  )
}

export default MealPlans;