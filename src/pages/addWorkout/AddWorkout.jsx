import React, { useRef, useContext} from 'react';
import customFetch from '../../api';
import styles from '../addWorkout/addworkout.module.css';
import { UserContext } from '../../components/userContext/userContext';
// import fitness from '../../utils/fitness.png'
import pen from '../../pages/UserAccount/images/pen.svg';
const cloud = process.env.CLOUD_NAME;
const upload = process.env.UPLOAD;

const AddWorkout = () => {

  const { workout, setWorkout } = useContext(UserContext);

  const onSubmit = async() => {
    
    const imagen = fileUpload();
    let resultado;
    await imagen.then(result => { resultado = result; }) 
    const data = {
      type: workout.type,
      name: workout.name,
      description: workout.description,
      reps: workout.reps,
      series: workout.series,
      picture: resultado ? resultado : workout.image, 
      video: workout.video
    }

    customFetch("POST", "workouts", {body:data})
    .catch(err => console.log(err));      
  }

  const fileUpload = async () => {
      const files = inputFile.current.files;
      const formData = new FormData();
      const url = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;
      let imagen;
    
      let file = files[0];
      formData.append("file", file);
      formData.append("upload_preset", `${upload}`);
      console.log(formData, files)
      await fetch(url, {
        method: "POST",
        header: {
            'Content-Type': 'multipart/form-data'
        },
        body: formData
        
      })
      .then((response) => {
        console.log(response);
        return response.json();
        
      })
      .then((photo) => {
        imagen = photo.url;
     
      })
      .catch((data) => {
        console.log(data);
      });
     
      return imagen;
      
  }

  const inputFile = useRef(null);

  const handleOnClick = () => {
    window.location.reload()
  }
  
  return (
    <div>
     <div className = {styles.addWorkout}>
          <div className = {styles.editbox}>
              <form className= {styles.form} >
                  <h2>Add a Workout</h2>

                  <div className={styles.images}>
                    <div className={styles.userimage}><img src={workout.image } 
                    className = {styles.imagen} alt="userImage"/></div>
                    <div className={styles.editimg}>
                      
                      <label>
                        <input type='file' ref={inputFile} 
                        onChange={(e) => setWorkout({...workout, image: URL.createObjectURL(e.target.files[0])}) }
                        className={styles.uploading}></input>
                        <img src={pen} alt="penlogo"/>
                      </label>
                    </div>
                  </div>

                  <div className= {styles.worksinput}>
                    <input type='text' value={workout.type} 
                      onChange={(e) =>setWorkout({...workout, type: e.target.value })} placeholder="type">
                    </input>

                    <input type="text" value={workout.name} 
                      onChange={(e) =>setWorkout({...workout, name: e.target.value})} placeholder="name">
                    </input>
          
                    <textarea value={workout.description} rows={4} cols={40} 
                      onChange={(e) =>setWorkout({...workout, description: e.target.value})}/>

                    <input type="text" value={workout.reps}  
                      onChange={(e) =>setWorkout({...workout, reps: e.target.value})} placeholder="reps">
                    </input>

                    <input type="text" value={workout.series}  
                      onChange={(e) =>setWorkout({...workout, series: e.target.value})} placeholder="series">
                    </input>

                    <input type="text" value={workout.video}  
                      onChange={(e) =>setWorkout({...workout, video: e.target.value})} placeholder="video">
                    </input>

                  </div>
                  <div className={styles.buttons}>
                    <button  className={styles.save} onClick={(e) => {e.preventDefault();e.stopPropagation();onSubmit();}}>Save</button>
                    <button  className={styles.reload} onClick={() => {handleOnClick()}} >reset</button>
                  </div>
                  
              </form>
          </div>
          <div className={styles.profile}>
            <h3>new created workout</h3>
            <div className={styles.box}>
              <img src={workout.image} alt="workout_Image"/>
              <div className={styles.elements}>
                <p>workout name: {workout.name}</p>
                <p>workout type: {workout.type}</p> 
                <p>workout description: {workout.description}</p> 
              </div>
              
            </div>
          </div>

      </div>
    </div>
  )
}

export default AddWorkout