import React from 'react';
import customFetch from '../../api';
import {useForm} from 'react-hook-form';
import { useState, useEffect } from 'react';
import styles from '../card/card.module.css'


const Formulario = () => {
   const {register, handleSubmit } = useForm();
   const [favs, setFavs] = useState();
  
   
   useEffect(() => {
      customFetch("GET", "fav")
        .then((json) => {
        setFavs(json);
        })
        .catch((error) => {
          console.log(error);
        })
    }, []);

   const addToFav = (item) => {       
      setFavs([...favs, item]);
  }

   const onSubmit = (data) => {

      setFavs(data)
      const onFav = () => {   

           console.log(data)
           customFetch("POST", "fav", {body: data})
           .then(() => {
              addToFav()
           })
           .then(alert('are you sure that you want to save this workout?'))
           .then(() => {
           window.location.reload()
           })
           .catch((error) => {
           console.log(error);
        })
      }
      onFav()
   };



  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                     <br/>
                     
                     <input type="number" placeholder='Number of reps' {...register("reps")} />
                     <br/>
                    
                     <input type="number" placeholder='Number of series' {...register("series")} />
                     <br/>
                    
                     <input type="date" placeholder='Workout date' {...register("date")} />
                     <br/>
                    
                     <input type="number"  placeholder='Weight Lifted' {...register("lifted")} />
                    
                     
                     <div className={styles.buttons}>
                        <input className={styles.send} type="submit" value="Save"  />
                        
                     </div>    
                  </form>
    </div>

  )
}

export default Formulario