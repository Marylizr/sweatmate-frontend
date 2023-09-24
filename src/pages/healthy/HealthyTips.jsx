import React, { useState, useEffect } from 'react';
import NavBar from '../../components/navBar/navBar';
import styles from '../healthy/healthy.module.css';
import customFetch from '../../api';
import HealthyCard from '../healthy/healthyTipsCard/HealthyCard';


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

console.log(response)

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