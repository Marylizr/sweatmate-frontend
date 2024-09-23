import styles from '../card/card.module.css'
import React, { useState} from 'react'
import customFetch from '../../../api';


const Card = ({ item }) => {

     const [selected, setSelected ] = useState([])

     const onSubmit = () => {
          const data = {
               type: item.type,
               name: item.name,
               description: item.description,
               picture: item.picture,
               video: item.video
            }
     
            customFetch( "POST", "designedByPt", {body:data})
            .then(() => {
               setSelected(selected);
               
            })
            .catch((e) => {
            e = new Error('cannot get this info')
            });
             
            alert(`workout ${data.name}`)
    }



console.log('yo soy esto:', item)
     return(
        <div className={styles.container} onClick={(e) => { 
          onSubmit()
          e.preventDefault(); 
          e.stopPropagation();   
     }}> 
          <div className={styles.info}>
               <video controls src={item.video} alt='workout'/>
               <div className={styles.descrip}>
                    <p className={styles.bold}>name:</p><p>{item.name}</p>
                    <p className={styles.bold}>description:</p><p>{item.description}</p>
               </div> 
          </div>
          </div>
     )
};

export default Card;