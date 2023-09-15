import React, {useEffect, useState } from 'react'
import customFetch from '../../api';
import styles from './userProfile.module.css';
import CardMessages from '../../components/card/cardMessages';
import Modal from "../../components/Modal/Modal";
import { useModal } from "../../hooks/useModal";

const UserProfile = () => {

  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState()
  const [getUser, setGetUser] = useState([])
  const [isOpenModal, openModal, closeModal] = useModal(false);

  useEffect(() => {
    customFetch("GET", "user")
      .then((json) => {
      setData(json);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [setData]);


  const onSubmit = async () => {
    
    const data = {
      name: getUser.name, 
      email:getUser.email, 
      age:getUser.age,
      height: getUser.height,
      weight:getUser.weight,
      goal:getUser.goal
    };
 
    customFetch("PUT", "user", { body: data })
      .catch(err => console.log(err))
      .then((json) => {
         setGetUser(json)
      })
      .then(alert('UPDATED!'))
      .then(window.location.reload(true))
  };

console.log(data)
  return (
    <div className={styles.container}>
      <div className={styles.small_header}> 
        <h2>Users Profile</h2>
      </div>
      <div className={styles.wrap}>
      {
        data && data.length > 0 && data.map( user => 
          <CardMessages user={user} id={user._id} key={user._id}
          onClick={() => {
            setSelectedItem(user); 
            openModal(false)  
        }}/>)
           
      }
      </div>

      {selectedItem &&  
      
      <Modal isOpen={isOpenModal} closeModal={closeModal}>

            <form className= {styles.form} >
                <p>Edit {selectedItem.name}´s Profile </p>

                <div className= {styles.namesinput}>
                <input className = {styles.names} type='text' 
                  onChange={(e) =>setGetUser({...getUser,name: e.target.value })} placeholder={`${selectedItem.name}`}/>

                <input className= {styles.email} type="email" 
                onChange={(e) =>setGetUser({...getUser,email: e.target.value})} placeholder={selectedItem.email} />

                <input className= {styles.names} type="number"
                  onChange={(e) =>setGetUser({...getUser, age: e.target.value})} placeholder={`${selectedItem.age} years old`} />

                <input className= {styles.names} type="number"  
                  onChange={(e) =>setGetUser({...getUser, height: e.target.value})} placeholder={`${selectedItem.height} Cm`} />

                <input className= {styles.names} type="number"   
                  onChange={(e) =>setGetUser({...getUser, weight: e.target.value})} placeholder={`${selectedItem.weight} Kg`} />

                <select className= {styles.names} type="text" onChange={(e) =>setGetUser({...getUser, goal: e.target.value})} >
                  <option value="Fat-Lost">Fat Lost</option>
                  <option value="Gain-Muscle-Mass">Gain Muscle Mass</option>
                  <option value="Manteninance">Manteninance</option>
                </select>    

                </div>

                <button className = {styles.submit} 
                onClick={(e) => {e.preventDefault();e.stopPropagation();onSubmit()}}>Save</button>
          </form> 
      </Modal>}
    </div> 
  )
}

export default UserProfile;


          