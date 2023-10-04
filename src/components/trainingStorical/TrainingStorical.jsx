import React from 'react';
// import customFetch from '../../api';


const TrainingStorical = ({item, cantidadEntrenamientos }) => {

 
  const fecha = new Date(item.date);
    const diaSemana = fecha.getDay();

    const trainingDays = () => {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return daysOfWeek[diaSemana];
    };
    const myTrainDays = trainingDays(cantidadEntrenamientos);
    
    
  return (
    <div>
      {myTrainDays}  

    </div> 
  )
}

export default TrainingStorical;
