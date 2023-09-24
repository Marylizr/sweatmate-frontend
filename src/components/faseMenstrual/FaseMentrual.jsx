import React, { useState } from 'react';
import styles from '../faseMenstrual/fase.module.css';
import Modal from "../Modal/Modal";
import { useModal } from "../../hooks/useModal";



const FaseMenstrual = () => {
  const [ultimoDiaMenstruacion, setUltimoDiaMenstruacion] = useState('');
  const [cicloMensual, setCicloMensual] = useState('');
  const [fase, setFase] = useState('');
  const [isOpenModal, openModal, closeModal] = useModal(false);
    
  

  const calcularFases = () => {
   const fechaUltimoDia = new Date(ultimoDiaMenstruacion);
   const hoy = new Date();
   const diferenciaDias = (hoy - fechaUltimoDia) / parseInt(1000 * 60 * 60 * 24);
   const ciclo = Math.floor(diferenciaDias >= 21 ? 21 : diferenciaDias);
   
   setCicloMensual(ciclo);
 
   if (ciclo >= 1 && ciclo <= 7) {
     setFase('Menstruación');
   } else if (ciclo >= 8 && ciclo <= 14) {
     setFase('Follicular');
   } else {
     setFase('Luteal');
   }
 };
 

  return (
    <div className={styles.container}>
      <h3>Menstrual Cicle</h3>
      <form className={styles.inputFase}>
        <label>last day of menstruation:</label>
        <input 
          type="date"
          value={ultimoDiaMenstruacion}
          onChange={(e) => setUltimoDiaMenstruacion(e.target.value)}
        />
          <button onClick={(e) => {
            calcularFases(); 
            openModal(false);
            e.preventDefault(); 
            e.stopPropagation();   
            }}> Save
       </button>
      </form>


      { 
        cicloMensual && 
          <Modal isOpen={isOpenModal} closeModal={closeModal}>
            <div>
                <h3>Menstrual Cicle: {cicloMensual} days</h3>
                <p>Current Fase: {fase}</p>
                <p>
                  As you are at the {fase} fase, would you like me
                  to recommend you a workout?
                </p>
                <div className={styles.faseButtons}>
                  <button className={styles.yes}>Yes, let´s go!</button>
                  <button className={styles.no}
                  onClick={closeModal}>not today... </button>
                </div>
            </div>
          </Modal>
        }
    </div>
  );
};

export default FaseMenstrual;
