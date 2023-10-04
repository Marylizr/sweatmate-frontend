import React, { useState, useEffect, useCallback } from 'react';
import styles from './training.module.css';
import customFetch from '../../api';
import TrainingStorical from './TrainingStorical';

const WeekStorical = () => {
 
  const [cantidadEntrenamientosSemanaActual, setCantidadEntrenamientosSemanaActual] = useState(0);
  const [name, setName ] = useState()

  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    customFetch("GET", "user/me")
    .then((json) => {
    setName(json.name);
    })
  }, [name, setName]);

  useEffect(() => {
    customFetch("GET", "fav")
      .then((json) => {
      setHistorial(json);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [setHistorial]);

    
  const obtenerSemanasDeEntrenamiento  = useCallback(() => {
    const semanasDeEntrenamiento = [];
    let semanaActual;
    historial.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    historial.forEach(myTrainDays => {
      const fechaEntrenamiento = new Date(myTrainDays.date);
      const diaSemanaEntrenamiento = fechaEntrenamiento.getDay();
     
      if (diaSemanaEntrenamiento === 1) {
        semanaActual = { Monday: fechaEntrenamiento, Sunday: null, historial: [] };
      }
      
      if (semanaActual) {
        semanaActual.Sunday = fechaEntrenamiento;
        semanaActual.historial.push(myTrainDays);
      }
  
      if (diaSemanaEntrenamiento === 0 && semanaActual) {
        semanasDeEntrenamiento.push(semanaActual);
        semanaActual = null;
      }
    });
    return semanasDeEntrenamiento;
  } , [historial]); 
 

  useEffect(() => {
    const semanasDeEntrenamiento = obtenerSemanasDeEntrenamiento();
    const semanaActual = semanasDeEntrenamiento[0]; // La primera semana es la actual
    
    if (semanaActual) {
      const cantidadEntrenamientos = semanaActual.historial.length;
      setCantidadEntrenamientosSemanaActual(cantidadEntrenamientos);
    }
  }, [obtenerSemanasDeEntrenamiento]);
  

     return (
       <div className={styles.container}>
         <h2>Weekly Workouts</h2>
         <p>Haz entrenado: {cantidadEntrenamientosSemanaActual} dias esta semana!</p>

         
        {historial.filter( item => item.userName === `${name}`).map(item => (
           <TrainingStorical 
              key={item._id}  
              item={item} 
              id={item._id} 
              historial={historial}
              cantidadEntrenamientos={cantidadEntrenamientosSemanaActual}
           />
         ))}
         
       </div>
     );
   };
   
  
export default WeekStorical;