import React, {useEffect, useState } from 'react'
import customFetch from '../../api';
import styles from '../fav/fav.module.css';
import CardDeleteFavs from '../../components/card/CardDeleteFavs';


const SavedWorkouts = () => {
  const [saved, setSaved] = useState([]);

  const [email, setEmail] = useState()

  useEffect(() => {
      const getGender = () => {
         customFetch( "GET", "user/me")
         .then((json) => {
         setEmail(json.email)
         })
         .catch((e) => {
         console.log(e, 'cannot retrieve user gender')
         });
      }
      getGender()
  }, [])
  

  useEffect(() => {
    customFetch("GET", "fav")
      .then((json) => {
      setSaved(json);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [setSaved]);

  function ordenarPorFecha() {
    // Usamos el método sort con una función de comparación
    saved.sort((a, b) => {
        // Comparamos las fechas, asegurándonos de que sean objetos Date
        const fechaA = new Date(a.date);
        const fechaB = new Date(b.date);

        // Comparamos las fechas en orden descendente (más reciente primero)
        return fechaB - fechaA;
    });

    return saved;
  }
  const elementosOrdenados = ordenarPorFecha(saved);
  console.log(elementosOrdenados); 


  return (
    <div className={styles.container} >
      <h1>All past workouts</h1>
      <div className={styles.wrap}>
        {
          elementosOrdenados && elementosOrdenados.length > 0 && elementosOrdenados.filter( item => item.userName === `${email}`).map( item => 
            <CardDeleteFavs  item={item} id={item._id} key={item._id}
             />)
        }
      </div>
    </div>
    
  )
}

export default SavedWorkouts;

