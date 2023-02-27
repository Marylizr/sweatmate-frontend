import { createContext } from 'react';
import { useState } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
   const [name, setName] = useState("");
   const [photo, setPhoto] = useState("");

   
   const sharedValues = {
       name, setName,
       photo, setPhoto,
   }

   return(
      <UserContext.Provider value={sharedValues}>
         {children}
      </UserContext.Provider>

   )
}

