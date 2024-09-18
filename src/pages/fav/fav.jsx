import React, { useEffect, useState } from 'react';
import customFetch from '../../api';
import styles from '../fav/fav.module.css';
import CardDeleteFavs from '../../components/card/CardDeleteFavs';



const SavedWorkouts = ({ show, setShow }) => {

  const [saved, setSaved] = useState([]);
  const [email, setEmail] = useState();


  const handleShow = (month) => {
    setShow(prevShow => (prevShow === month ? null : month));
  }

  useEffect(() => {
    const getEmail = () => {
      customFetch("GET", "user/me")
        .then((json) => {
          setEmail(json.email)
        })
        .catch((e) => {
          console.log(e, 'cannot retrieve user email')
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

  const groupByMonth = () => {
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
      <div className={styles.wrap}>
        {Object.entries(entrenamientosPorMes).map(([month, entrenamientos]) => (
          <div key={month} className={styles.click}>
            <p onClick={() => handleShow(month)}>{ show === month ? ' Hide ' : ' Show '} {month} | </p>
            {show === month && (
              <div className={styles.block}>
                {entrenamientos && entrenamientos.length > 0 && entrenamientos.map(item =>
                  <CardDeleteFavs item={item} id={item._id} key={item._id} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavedWorkouts;
