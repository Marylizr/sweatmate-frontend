import React, {useState} from 'react'
import Galery from '../../components/galery/galery';
import Upload from '../../components/uploads/uploads';

const AddWorkout = () => {

   const [photos, setPhotos] = useState([]);


  //  const addPhoto = (data) => {
  //    setPhotos([...photos, data])
  //  };

  
  return (
    <div>
      <Upload setPhotos={setPhotos}/>
      <Galery photos={photos}/>
    </div>
  )
}

export default AddWorkout