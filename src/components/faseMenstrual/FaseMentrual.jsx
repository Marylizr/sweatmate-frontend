import React, { useState } from 'react';
import styles from '../faseMenstrual/fase.module.css';

const FaseMenstrual = () => {
  const [ultimoDiaMenstruacion, setUltimoDiaMenstruacion] = useState('');
  const [cicloMensual, setCicloMensual] = useState('');
  const [fase, setFase] = useState('');

  const calcularFases = () => {
   const fechaUltimoDia = new Date(ultimoDiaMenstruacion);
   const hoy = new Date();
   const diferenciaDias = (hoy - fechaUltimoDia) / parseInt(1000 * 60 * 60 * 24);
   
 
   const ciclo = Math.floor(diferenciaDias >= 21 ? 21 : diferenciaDias);
   
   setCicloMensual(ciclo);
 
   if (ciclo >= 1 && ciclo <= 7) {
     setFase('Fase 1: Menstruación');
   } else if (ciclo >= 8 && ciclo <= 14) {
     setFase('Fase 2: Follicular');
   } else {
     setFase('Fase 3: Luteal');
   }
 };
 

  return (
    <div className={styles.container}>
      <h3>Seguimiento del Ciclo Menstrual</h3>
      <form className={styles.inputFase}>
        <label>Último Día de la Menstruación:</label>
        <input 
          type="date"
          value={ultimoDiaMenstruacion}
          onChange={(e) => setUltimoDiaMenstruacion(e.target.value)}
        />
        <button type="button" onClick={calcularFases}>Calcular Fases</button>

        {cicloMensual && (
          <div>
            <h3>Ciclo Menstrual: {cicloMensual} días</h3>
            <p>Fase Actual: {fase}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default FaseMenstrual;
