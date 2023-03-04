import styles from '../card/card.module.css'
import customFetch from '../../api';
import { useModal } from "../../hooks/useModal";
import { useState } from 'react';
import Modal from "../Modal/Modal";
import { Link } from 'react-router-dom';
import {useForm} from 'react-hook-form';



const Card = ({ item, isInFav=false, addToFav }) => {
     const [isOpenModal, openModal, closeModal] = useModal(false);
     const [selectedItem, setSelectedItem] = useState();
     const {register, handleSubmit } = useForm();


     const onSubmit = (data) => {
        setSelectedItem(data)
        customFetch("POST", "saveworkout", {body: data})
         .then(alert('are you sure that you want to save this workout?'))
         .then(() => {
           window.location.reload()
           })
          .catch((error) => {
             console.log(error);
          })
     };

     const onFav = () => {   
          const data ={
            type: item.type,
            name: item.name,
            description: item.description,
            reps: item.reps,
            series: item.series,
            picture: item.picture,
            video: item.video
          }
          customFetch("POST", "fav", {body: data})
          .then(() => {
               addToFav()
               openModal() 
          })
          .catch(error => {
               console.error(error);
          })
     }


     return(
        <div className={styles.container}  >
               <div className={styles.info}>
                    <video controls src={item.video} alt='workout'/>
                    {/* <img src={item.picture} alt='workout'/> */}
                    <div className={styles.descrip}>
                         <p className={styles.bold}>name:</p><p>{item.name}</p>
                         <p className={styles.bold}>description:</p><p>{item.description}</p>
                    </div> 
               </div>
               {!isInFav && 
                    <button onClick={() => {
                         onFav()
                         setSelectedItem(item); 
                         openModal()  
                         }}> Save Workout
                    </button>}
            {selectedItem && 
               <Modal isOpen={isOpenModal} closeModal={closeModal}>
                    <h2>your {selectedItem.type} workout</h2>
                    <img src={selectedItem.picture} alt="img"/> 
                    <p>Type: {selectedItem.type}</p>
                    <p>Name: {selectedItem.name}</p>

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                     <br/>
                     <label>Number of reps</label>
                     <input type="number"  {...register("reps")} />
                     <br/>
                     <label>Number of series</label>
                     <input type="number"  {...register("series", { required: true })} />
                     <br/>
                     <label>Date</label>
                     <input type="date" {...register("date")} />
                     <br/>
                     <label>Weight Lifted</label>
                     <input type="number"  {...register("weight", { required: true })} />
                    
                     
                     <div className={styles.buttons}>
                        <input className={styles.send} type="submit" value="Save"  />
                        <button className={styles.save}><Link to="/fav"> my WorkOuts </Link> </button>
                     </div>    
                  </form>
                    
               </Modal>}
          </div>
     )
};

export default Card;