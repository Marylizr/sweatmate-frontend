import React, {useEffect, useState } from 'react';
import styles from '../training/training.module.css'
import Card from './card/Card';
import customFetch from '../../api';
import { useForm } from 'react-hook-form';


const Training = ({onClick}) => {

   const [selected, setSelected ] = useState([])
   const [users, setUsers] = useState([])
   const [data, setData] = useState([]);
   const [searchValue, setSearchValue] = useState('');
   const [email, setEmail] = useState('');


   useEffect(() => {
      customFetch("GET", "user")
      .then((json) => {
      setUsers(json);
      })
    }, [setUsers]);

    useEffect(() => {
      customFetch("GET", "user/me")
      .then((json) => {
      setEmail(json.email);
      })
    }, [setEmail, email]);


    //filter data from search box
    
     useEffect(() => {
          if (searchValue !== '') {
             setData(data.filter(({ type }) => {
               const regex = new RegExp(searchValue);
               return regex.test(type.toLocaleLowerCase());
             }))
                
          }
       }, [searchValue, setData, data]);

   
        useEffect(() => {
            customFetch("GET", "workouts")
            .then((json) => {
             setData(json);
            })
            .catch((error) => {
               console.log(error);
            })
        }, []);


      const { register, handleSubmit} = useForm();

      const onSubmit = () => {

         customFetch( "POST", "designedByPt", {body:data})
         .then(() => {
              setSelected(selected);
              setEmail(email)
              
         })
         .catch((e) => {
          e = new Error('cannot get this info')
         });
   }

  
    
  return (
    <div className={styles.container}>
      <h2>Design a Training Program</h2>

      <div className={styles.wrapper}>
       <form onSubmit={handleSubmit(onSubmit)} {...register("email")}>
         <select className={styles.search} id="user-select" >
            <option value="">Select a user</option>

               {users.map(user => (
                  <option key={user._id} value={user.email}>
                     {user.email}
                  </option>
               ))}
               </select>

               <div className={styles.search}> 
                  <input onChange={event => 
                     {const value = event.target.value;
                     setSearchValue(value) 
                     }} type="text" placeholder="Search Workout" />
               </div> 
                  <input type='hidden' value={email}  {...register("userName")} />  

               <div className={styles.wrap} onClick={() => {onClick()}}>
                  {
                     data && data.length > 0 && data.map( item => 
                        <Card item={item} id={item._id} key={item._id}
                        onClick={() => {onClick()}}/>)
                  }
               </div>

               <input className={styles.submit} type="submit" value="Save"
                  onClick={(e) => { 
                     onSubmit()
                     e.preventDefault(); 
                     e.stopPropagation();   
                     alert(`${email} workout has been sent`)
            }} />
         </form>
      </div>

     
      
    </div>
  )
}

export default Training