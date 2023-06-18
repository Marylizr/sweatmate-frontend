import styles from '../card/card.module.css'
import customFetch from '../../api';
import { useModal } from "../../hooks/useModal";
import { useState } from 'react';
import Modal from "../Modal/Modal";
import {useForm} from 'react-hook-form';



const Card = ({ item, isInFav=false, addToFav }) => {
     const [isOpenModal, openModal, closeModal] = useModal(false);
     const [selectedItem, setSelectedItem] = useState();
     const {register, handleSubmit } = useForm();

     const onSubmit = (data) => {
          setSelectedItem(data)
          const onFav = () => {   
               const data = {
                 type: item.type,
                 name: item.name,
                 description: item.description,
                 reps: item.reps,
                 series: item.series,
                 weight: item.weight,
                 picture: item.picture,
                 date: item.date,
                 video: item.video
               }
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
  
       
console.log(item)

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
                         setSelectedItem(item); 
                         openModal()  
                         }}> Save
                    </button>
               }
            {selectedItem && 
               <Modal isOpen={isOpenModal} closeModal={closeModal}>
                    <h2>your {selectedItem.type} workout</h2>
                    <img src={selectedItem.picture} alt="img"/> 
                    <p> {selectedItem.name}</p>

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                     <br/>
                     
                     <input type="number" placeholder='Number of reps' {...register("reps")} />
                     <br/>
                    
                     <input type="number" placeholder='Number of series' {...register("series")} />
                     <br/>
                    
                     <input type="date" placeholder='workout date' {...register("date")} />
                     <br/>
                    
                     <input type="number"  placeholder='Weight Lifted' {...register("weight")} />
                    
                     
                     <div className={styles.buttons}>
                        <input className={styles.send} type="submit" value="Save"  />
                        
                     </div>    
                  </form>
                    
               </Modal>}
          </div>
     )
};

export default Card;