import React from 'react';
import styles from './training.module.css';

const WeekStorical = ({ historial }) => {

     if (!historial || historial.length === 0) {
       return <div className={styles.container}><p>No hay datos de historial disponibles.</p></div>;
     }
   
     const totalDias = historial.length;
     const progresoSemanal = historial.reduce((total, item) => total + parseInt(item.porcentaje), 0);
   
     const promedioPorcentaje = progresoSemanal / totalDias;
   
     return (
       <div className={styles.container}>
         <h2>Historial Semanal de Entrenamientos</h2>
         {historial.map(item => (
           <div key={item.dia}>
             <p>{item.dia}: {item.porcentaje}%</p>
             <div style={{ width: `${item.porcentaje}%`, backgroundColor: 'green', height: '20px' }}></div>
           </div>
         ))}
         <p>Promedio Semanal: {promedioPorcentaje.toFixed(2)}%</p>
       </div>
     );
   };
   
  
export default WeekStorical;
