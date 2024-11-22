import React from 'react';
import styles from '../mealPlans/MealPlans.module.css';
import fruit from '../../../assets/fruit.svg';
import { Link } from 'react-router-dom';

const MealPlans = () => {
  return (
    <div className={styles.container}>
      <Link to='/main/mealplan'> 
        <img src={fruit} alt='fruit-icon'/>
        <h2>Meal Plan </h2>
      </Link>
    </div>
  )
}

export default MealPlans;