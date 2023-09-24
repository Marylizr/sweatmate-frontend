import React, { useState } from 'react';
import styles from '../macroCalculator/macroCalculator.module.css';
import Modal from "../Modal/Modal";
import { useModal } from "../../hooks/useModal";



function MacroCalculator() {
  const [proteins, setProteins] = useState();
  const [carbs, setCarbs] = useState();
  const [fats, setFats] = useState();
  const [calories, setCalories] = useState();
  const [isOpenModal, openModal, closeModal] = useModal(false);


  const calcularCalorias = () => {
    const caloriesProteins = proteins * 4;
    const caloriesCarbs = carbs * 4;
    const caloriesFats = fats * 9;

    const totalCalories = caloriesProteins + caloriesCarbs + caloriesFats;

    setCalories(totalCalories);
  };

  return (
    <div className={styles.macros}>
      <h3> Macronutrients Calculator</h3>
      <form className={styles.form}>
        
            <input type="number" value={proteins} placeholder={`proteins grams`}
            onChange={(e) => setProteins(e.target.value)}
            />
        
            <input type="number" value={carbs} placeholder={`carbs grams `}
            onChange={(e) => setCarbs(e.target.value)}
            />
        
            <input type="number" value={fats} placeholder={`fats grams`}
            onChange={(e) => setFats(e.target.value)}
            />
        
        <button onClick={(e) => {
            calcularCalorias(); 
            openModal(false);
            e.preventDefault(); 
            e.stopPropagation();   
            }}> Calculate
       </button>
      </form>


         {calories > 0 && 
         <Modal isOpen={isOpenModal} closeModal={closeModal}>
            <div>
            <p>Calories: {calories} kcal</p>
            </div>
         </Modal>
         
         
         }

      
    </div>
  );
}

export default MacroCalculator;
