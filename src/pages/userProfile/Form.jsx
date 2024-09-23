import React, {useState} from 'react';
import styles from './userProfile.module.css';
import customFetch from '../../api';

const Form = ({selectedItem}) => {

   const [getUser, setGetUser] = useState([])

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


   
  return (
    <div classname={styles.wrap_form}>
      <p>Edit {selectedItem.name}´s Profile </p>
      
      <form className= {styles.form} >
        <div className= {styles.namesinput}>
        <label>Name</label>
        <input className = {styles.names} type='text' 
          onChange={(e) =>setGetUser({...getUser,name: e.target.value })} placeholder={`${selectedItem.name}`}/>

        <label>Email</label>
        <input className= {styles.email} type="email" 
          onChange={(e) =>setGetUser({...getUser,email: e.target.value})} placeholder={selectedItem.email} />

        <label>Age</label>
        <input className= {styles.names} type="number"
          onChange={(e) =>setGetUser({...getUser, age: e.target.value})} placeholder={`${selectedItem.age} years old`} />

        <label>Height</label>
        <input className= {styles.names} type="number"  
          onChange={(e) =>setGetUser({...getUser, height: e.target.value})} placeholder={`${selectedItem.height} Cm`} />

        <label>Weight</label>
        <input className= {styles.names} type="number"   
          onChange={(e) =>setGetUser({...getUser, weight: e.target.value})} placeholder={`${selectedItem.weight} Kg`} />

        <label>Goal</label>
        <select className= {styles.names} type="text" onChange={(e) =>setGetUser({...getUser, goal: e.target.value})} >
          <option value="Fat-Lost">Fat Lost</option>
          <option value="Gain-Muscle-Mass">Gain Muscle Mass</option>
           <option value="Manteninance">Manteninance</option>
        </select>    

      </div>

        <button className = {styles.submit} 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSubmit()}}>Save
        </button>
      </form> 

    </div>
  )
}

export default Form;