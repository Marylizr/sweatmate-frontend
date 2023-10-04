import { createContext } from 'react';
import { useState, useEffect } from "react";
import customFetch from '../../api';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
   
   const [name, setName] = useState("");

   useEffect(() => {
         customFetch( "GET", "user/me")
         .then((json) => {
         setName(json.name)
         })
         .catch((e) => {
         console.log(e, 'cannot retrieve user name')
         });
      
  }, [setName])

  const [role, setRole] = useState("");

  useEffect(() => {
        customFetch( "GET", "user/me")
        .then((json) => {
        setRole(json.role)
        })
        .catch((e) => {
        console.log(e, 'cannot retrieve user role')
        });
     
 }, [setRole])

   const [users, setUsers] = useState([]);

   useEffect(() => {
      customFetch( "GET", "user")
      .then((json) => {
      setUsers(json)
      })
      .catch((e) => {
      console.log(e, 'cannot retrieve user')
      });
   
}, [setUsers])



   const [workout, setWorkout] = useState(
      { 
         type: "type",
         name: "name",
         description: "description",
         reps: "reps",
         series: "series",
         picture: "picture",
         video: "video"
      }
   )
   useEffect(() => {
     customFetch("GET", "workouts")
       .then((json) => {
       setWorkout(json);
       })
       .catch((error) => {
         console.log(error);
       })
   }, [setWorkout]);


   const [gender, setGender] = useState()

   useEffect(() => {
     const getGender = () => {
        customFetch( "GET", "user/me")
        .then((json) => {
        setGender(json.gender)
        })
        .catch((e) => {
        console.log(e, 'cannot retrieve user gender')
        });
     }
     getGender()
 }, [])
   
   const sharedValues = {
      name, setName,
      users, setUsers,
      workout, setWorkout,
      gender, setGender,
      role, setRole
   }

   return(
      <UserContext.Provider value={sharedValues}>
         {children}
      </UserContext.Provider>

   )
}

