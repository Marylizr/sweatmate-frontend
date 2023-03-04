import React, {useState, useEffect} from 'react';
import customFetch from '../../api';
import CardWorkout from '../../components/card/CardWorkouts';
import styles from '../../pages/dashboard/dashboard.module.css';

const Prueba = () => {
   const [filteredData, setFilteredData] = useState([]);
   const [data, setData] = useState([]);


   useEffect(() => {
      if (data.length) {
        setFilteredData(data);
      }
    }, [data, setFilteredData]);

    useEffect(() => {
        customFetch("GET", "workouts")
       
        .then((json) => {
         setData(json);
        })
        .catch((error) => {
           console.log(error);
        })
    }, [setFilteredData]);

   console.log(filteredData)
  return (
   <div className={styles.productList} >
   {
      filteredData && filteredData.length > 0 && filteredData.filter(item => item.frontpage).map( item => 
        <CardWorkout item={item} id={item._id} key={item._id}
        />)}

</div>
  )
}

export default Prueba;