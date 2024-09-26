import styles from '../card/card.module.css'
import customFetch from '../../api';
import { useModal } from "../../hooks/useModal";
import { useState, useEffect } from 'react';
import Modal from "../Modal/Modal";
import {useForm} from 'react-hook-form';



const CardPt = ({ item }) => {
     const [isOpenModal, openModal, closeModal] = useModal(false);
     const {register, handleSubmit } = useForm();
     const [favs, setFavs] = useState()
     const [user, setUser] = useState();


     useEffect(() => {
     customFetch("GET", "user/me")
     .then((json) => {
     setUser(json);
     })
   }, [setUser]);

     const onSubmit = (data) => {
          setFavs(data)
          setUser(user)
          const onFav = () => {   
<<<<<<< HEAD
               customFetch("POST", "personaltrainer", {body: data})
=======
               customFetch("POST", "designedByPt", {body: data})
>>>>>>> refs/remotes/origin/original
               .then(alert('are you sure that you want to save this workout?'))
               .then(window.location.reload())
               .catch((error) => {
               console.log(error);
            })
          }
          onFav()
       };

       console.log('card pt', item)
  
     return(
        <div className={styles.container}  >
               <div className={styles.info}>
                    <video controls src={item.video} alt='workout'/>
                    
                    <div className={styles.descrip}>
                         <p className={styles.bold}>name:</p><p>{item.name}</p>
                         <p className={styles.bold}>description:</p><p>{item.description}</p>
                    </div> 
               </div>
                    <button onClick={() => {
                         setFavs(item); 
                         setUser(user)
                         openModal()  
                         }}> Save
                    </button>
            {favs && 
               <Modal isOpen={isOpenModal} closeModal={closeModal}>
                    <h2>your {favs.type} workout</h2>
                    <img src={favs.picture} alt="img"/> 

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    
                     <input type='hidden' value={user.email}  {...register("userName")} />

                     <input type="hidden" alt='' value={favs.picture} {...register("picture")} />
                    
                     <input type="text" value= {favs.name} {...register("name")}/>
                     
                     <input type="number" placeholder='Number of reps' {...register("reps")} />
                     
                     <input type="number" placeholder='Number of series' {...register("series")} />
                     
                     <input type="number"  placeholder='Weight Lifted' {...register("lifted")} />
                    
                     <input type="date" placeholder='Workout date' {...register("date")} />
                     
                     <div className={styles.buttons}>
                        <input className={styles.send} type="submit" value="Save"  />
                        
                     </div>    
                  </form>
                    
               </Modal>}
          </div>
     )
};

export default CardPt;