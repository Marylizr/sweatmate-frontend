import { createContext } from 'react';
import { useState } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
   
   const [name, setName] = useState("");
   const [galery, setGalery] = useState([]);
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

   
   const sharedValues = {
      name, setName,
      galery, setGalery,
      workout, setWorkout
   }

   return(
      <UserContext.Provider value={sharedValues}>
         {children}
      </UserContext.Provider>

   )
}

