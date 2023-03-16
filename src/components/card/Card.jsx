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
          customFetch("POST", "fav", {body: data})
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
            })
            .catch(error => {
                 console.error(error);
            })
       }
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
                         onFav()
                         setSelectedItem(item); 
                         openModal()  
                         }}> Open
                    </button>
               }
            {selectedItem && 
               <Modal isOpen={isOpenModal} closeModal={closeModal}>
                    <h2>your {selectedItem.type} workout</h2>
                    <img src={selectedItem.picture} alt="img"/> 
                    <p>Exercise Name: {selectedItem.name}</p>

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                     <br/>
                     
                     <input type="number" placeholder='Number of reps' {...register("reps")} />
                     <br/>
                    
                     <input type="number" placeholder='Number of series' {...register("series", { required: true })} />
                     <br/>
                    
                     <input type="date" placeholder='workout date' {...register("date")} />
                     <br/>
                    
                     <input type="number"  placeholder='Weight Lifted' {...register("weight", { required: true })} />
                    
                     
                     <div className={styles.buttons}>
                        <input className={styles.send} type="submit" value="Save"  />
                     </div>    
                  </form>
                    
               </Modal>}
          </div>
     )
};

export default Card;