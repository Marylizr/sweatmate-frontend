import React, {useState} from 'react'
import Galery from '../../components/galery/galery';
import Upload from '../../components/uploads/uploads';

const AddWorkout = () => {

   const [photos, setPhotos] = useState([]);


   const addPhoto = (data) => {
     setPhotos([...photos, data])
   };
  return (
    <div>
      <Upload addPhoto={addPhoto}/>
      <Galery photos={photos}/>
    </div>
  )
}

export default AddWorkout