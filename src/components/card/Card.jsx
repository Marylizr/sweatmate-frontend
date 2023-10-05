import styles from '../card/card.module.css'
import React, { useState, useEffect} from 'react'
import customFetch from '../../api';
import {useForm} from 'react-hook-form';

const Card = ({ item }) => {

     const [selected, setSelected ] = useState([])
     const [email, setEmail] = useState()
     const {register, handleSubmit } = useForm();

     useEffect(() => {
          customFetch("GET", "user/me")
          .then((json) => {
          setEmail(json.email);
          })
        }, [setEmail]);

         
     const onSubmit = () => {

          const data = {
               userName: email,
               name: item.name,
               description: item.description,
               picture: item.picture,
               video: item.video
          }

          customFetch( "POST", "saveworkout", {body:data})
          .then(() => {
               setSelected(selected);
               alert('workout selected')
          })
          .catch((e) => {
           e = new Error('cannot get this info')
          });
    }


    console.log(email)

     return(
        <div className={styles.container} onClick={(e) => { 
          onSubmit()
          setEmail(email)
          e.preventDefault(); 
          e.stopPropagation();   
     }}> 
          <div className={styles.info}>
               <video controls src={item.video} alt='workout'/>
               <div className={styles.descrip}>
               <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                     <br/>
                     <input type='hidden' value={email}  {...register("userName")} />   
                  </form>
                    <p className={styles.bold}>name:</p><p>{item.name}</p>
                    <p className={styles.bold}>description:</p><p>{item.description}</p>
               </div> 
          </div>
          </div>
     )
};

export default Card;