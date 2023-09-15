import styles from '../card/card.module.css'
import customFetch from '../../api';
import { useModal } from "../../hooks/useModal";
import { useState } from 'react';
import Modal from "../Modal/Modal";
import {useForm} from 'react-hook-form';



const Card = ({ item, isInFav=false }) => {
     const [isOpenModal, openModal, closeModal] = useModal(false);
     
     const {register, handleSubmit } = useForm();
     const [favs, setFavs] = useState()

     
    const addToFav = (item) => {       
      setFavs([...favs, item]);
  }

     const onSubmit = (data) => {
          setFavs(data)
     
          const onFav = () => {   

               customFetch("POST", "fav", {body: data})
               .then(() => {
                  addToFav()
                  
               })
               .then(alert('are you sure that you want to save this workout?'))
               .then(window.location.reload())
               .catch((error) => {
               console.log(error);
            })
          }
          onFav()
       };
  

     return(
        <div className={styles.container}  >
               <div className={styles.info}>
                    <video controls src={item.video} alt='workout'/>
                    
                    <div className={styles.descrip}>
                         <p className={styles.bold}>name:</p><p>{item.name}</p>
                         <p className={styles.bold}>description:</p><p>{item.description}</p>
                    </div> 
               </div>
               {!isInFav && 
                    <button onClick={() => {
                         setFavs(item); 
                         openModal()  
                         }}> Save
                    </button>
               }
            {favs && 
               <Modal isOpen={isOpenModal} closeModal={closeModal}>
                    <h2>your {favs.type} workout</h2>
                    <img src={favs.picture} alt="img"/> 

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                     <br/>
                     
                     <input type="hidden" alt='' value={favs.picture} {...register("picture")} />
                    
                     <input type="text" value= {favs.name} {...register("name")}/>
                     
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
                    
               </Modal>}
          </div>
     )
};

export default Card;