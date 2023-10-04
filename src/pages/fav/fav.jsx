import React, {useEffect, useState, useContext } from 'react'
import customFetch from '../../api';
import NavBar from '../../components/navBar/navBar';
import styles from '../fav/fav.module.css';
import { Link } from 'react-router-dom';
import arrow_left from '../../utils/arrow_left.svg';
import { UserContext } from '../../components/userContext/userContext';
import CardDeleteFavs from '../../components/card/CardDeleteFavs';


const SavedWorkouts = () => {
  const [saved, setSaved] = useState([]);
  const { name } = useContext(UserContext);
  const [email, setEmail] = useState()

  const [gender, setGender] = useState()

  useEffect(() => {
      const getGender = () => {
         customFetch( "GET", "user/me")
         .then((json) => {
         setGender(json.gender)
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
      <NavBar />
      <div className={styles.small_header}> 
      { gender === 'female' ? <Link to="/dashboard/female"><img src={arrow_left} alt='' /></Link> : 
      <Link to="/dashboard/male"><img src={arrow_left} alt='' /></Link> }
       
        <h2>{name}, Welcome to your WorkOut</h2>
      </div>
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

