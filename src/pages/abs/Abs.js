import React, {useEffect, useState} from 'react'
import Galery from '../../components/galery/galery.jsx';
import customFetch from '../../api';

const Abs = () => {
  const[workouts, setWorkouts] = useState([]);
  const [favs, setFavs] = useState([]);


  useEffect(() => {
    customFetch( "GET", "workouts")
      .then((response) => {
         if (!response.ok){
            throw new Error("error")
         }
         return response.json();
      })
      .then((json) => {
       setWorkouts(json);
      })
      .catch((error) => {
         console.log(error);
      })
  }, [setWorkouts]);

  const addToFav = (item) => {       
    setFavs([...favs, item]);
}


  return (
    <div>
      <h1>Welcome to Abs workout</h1>

      {workouts.map( item => <Galery addToFav={addToFav} item={item} id={item._id} key={item._id} 
               />)}
       
    </div>
    
  )
}

export default Abs