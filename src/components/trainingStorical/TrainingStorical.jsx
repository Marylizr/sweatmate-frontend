import React, { useState, useEffect } from 'react';
import customFetch from '../../api';


const TrainingStorical = ({item,  historial}) => {
 
  const fecha = new Date(item.date);
    const diaSemana = fecha.getDay();

    const trainingDays = () => {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return daysOfWeek[diaSemana];
    };
    
    const myTrainDays = trainingDays();
    


    historial.sort((a, b) => new Date(a.date) - new Date(b.date));

    function obtenerSemanasDeEntrenamiento() {
      const semanasDeEntrenamiento = [];
      let semanaActual;
    
    historial.forEach(entrenamiento => {
      const fecha = new Date(entrenamiento.date);
      const diaSemana = fecha.getDay();
  
      if (diaSemana === 1) {
        semanaActual = { Monday: fecha, Sunday: null, historial: [] };
      }
      
      if (semanaActual) {
        semanaActual.Sunday = fecha;
        semanaActual.historial.push(entrenamiento);
      }
  
      if (diaSemana === 0 && semanaActual) {
        semanasDeEntrenamiento.push(semanaActual);
        semanaActual = null;
      }
    });
  
      return semanasDeEntrenamiento;
    }

    useEffect(() => {
      obtenerSemanasDeEntrenamiento()
    }, );

  

  return (
    <div>
      {myTrainDays}
     
    </div> 
  )
}

export default TrainingStorical;

// .map(item => (
//   <TrainingStorical historial={historial} key={item._id}  item={item} id={item._id}