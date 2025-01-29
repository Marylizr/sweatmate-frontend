import React, { useState, useEffect } from 'react';
import styles from '../healthy/healthy.module.css';
import customFetch from '../../api';
import HealthyCard from '../healthy/healthyTipsCard/HealthyCard';
import NavBar from '../../components/navBar/navBar';


const HealthyTips = () => {

  const [response, setResponse] = useState([])

  useEffect(() => {
  
    customFetch("GET", "savePrompt")
    .then((json) => {
    setResponse(json);
    })
    .catch((error) => {
      console.log(error);
    })
  }, [setResponse])


    function ordenarPorFecha() {
      // Usamos el método sort con una función de comparación
      response.sort((a, b) => {
          // Comparamos las fechas, asegurándonos de que sean objetos Date
          const fechaA = new Date(a.date);
          const fechaB = new Date(b.date);

          // Comparamos las fechas en orden descendente (más reciente primero)
          return fechaA - fechaB;
      });

      return response;
    }
    const elementosOrdenados = ordenarPorFecha(response);
    console.log(elementosOrdenados);        

  return (
    <div className={styles.container}>
      <NavBar />
     
      <div className={styles.cardWrap}>
        {
          response && response.length > 0 && response.map( (item) => 
          <HealthyCard  item={item} id={item._id} key={item._id}/>)
        }

      </div>
    </div>
  )
}

export default HealthyTips