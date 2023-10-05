import React, { useEffect, useState } from 'react';
import customFetch from '../../api';
import styles from '../fav/fav.module.css';
import CardDeleteFavs from '../../components/card/CardDeleteFavs';

const SavedWorkouts = () => {
  const [saved, setSaved] = useState([]);
  const [email, setEmail] = useState();
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show)
  }
   

  useEffect(() => {
    const getEmail = () => {
      customFetch("GET", "user/me")
        .then((json) => {
          setEmail(json.email)
        })
        .catch((e) => {
          console.log(e, 'cannot retrieve user gender')
        });
    }
    getEmail()
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

  function groupByMonth() {
    return saved.reduce((acc, item) => {
      const fecha = new Date(item.date);
      const month = fecha.getMonth();
      const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(fecha);
      if (item.userName === email) {
        if (!acc[monthName]) {
          acc[monthName] = [];
        }
        acc[monthName].push(item);
      }
      return acc;
    }, {});
  }

  const entrenamientosPorMes = groupByMonth();
  

  return (
    <div className={styles.container} >
      <h1>All past workouts</h1>
      <div className={styles.wrap}>
        {Object.entries(entrenamientosPorMes).map(([mes, entrenamientos]) => (
          <div key={mes} className={styles.click}>
            <h2 onClick={handleShow}>{ show ? ' Hide ' : ' Show '} {mes} | </h2>
          { show &&
            <div className={styles.block}>
              {
                entrenamientos && entrenamientos.length > 0 &&
                entrenamientos.map(item =>
                  <CardDeleteFavs item={item} id={item._id} key={item._id} />
                )
              }
            </div>
          }
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavedWorkouts;
