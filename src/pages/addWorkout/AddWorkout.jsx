import React, { useRef, useContext} from 'react';
import customFetch from '../../api';
import styles from '../addWorkout/addworkout.module.css';
import { UserContext } from '../../components/userContext/userContext';
import pen from '../../pages/UserAccount/images/pen.svg';
import pic from "../../utils/back1.jpg";

const AddWorkout = () => {

  const { workout, setWorkout } = useContext(UserContext);

  const onSubmit = async () => {

    const imagen = fileUpload();
    const videoData = videoUpload();

    let resultado;
    await imagen.then(result => { resultado = result; });

    let VideoSet;
    await videoData.then(savedVideo => {VideoSet = savedVideo; }) ;

    const data = {
      type: workout.type,
      name: workout.name,
      description: workout.description,
      reps: workout.reps,
      series: workout.series,
      picture: resultado ? resultado : workout.picture,
      video: VideoSet ? VideoSet : workout.video,
      frontpage:workout.frontpage
    };

    console.log(data)

    customFetch("POST", "workouts", { body: data })
      .catch(err => console.log(err));
  };

  const fileUpload = async () => {
    const files = inputFile.current.files;
    const formData = new FormData();
    const url = `https://api.cloudinary.com/v1_1/da6il8qmv/image/upload`;

    let imagen;
    let file = files[0];
    formData.append("file", file);
    formData.append("upload_preset", 'h9rhkl6h');
    console.log(formData, files);
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
  };
  const inputFile = useRef(null);

//video upload

const videoUpload = async () => {
  const files = inputFileVideo.current.files;
  const formData = new FormData();
  const url = `https://api.cloudinary.com/v1_1/da6il8qmv/video/upload`;
 
  let videoLoaded;

  let file = files[0];
  formData.append("file", file);
  formData.append("upload_preset", 'h9rhkl6h');
  console.log(formData, files);
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
    .then((media) => {
      videoLoaded = media.url;
    })
    .catch((data) => {
      console.log(data);
    });

  return videoLoaded;
};
const inputFileVideo = useRef(null);


  const handleOnClick = () => {
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <h2>Add a Workout</h2>
      <div className={styles.wrap}>

        <form className={styles.form}>
          <div className={styles.media}>
            <div className={styles.images}>
              <div className={styles.userimage}><img src={workout.image ? workout.image : pic} 
                className={styles.imagen} alt="userImage" /></div>
              <div className={styles.editimg}>

                <label>
                  <input type='file' ref={inputFile}
                    onChange={(e) => setWorkout({ ...workout, image: URL.createObjectURL(e.target.files[0]) })}
                    className={styles.uploading}></input>
                  <img src={pen} alt="penlogo" />
                </label>
              </div>
            </div>

            <div className={styles.images}>
                <div className={styles.userimage}><video controls src={workout.video}
                  className={styles.imagen} alt="userVideo" /></div>

                <div className={styles.editimg}>
                  <label>
                    <input type='file' ref={inputFileVideo}
                      onChange={(e) => setWorkout({ ...workout, video: URL.createObjectURL(e.target.files[0]) })}
                      className={styles.uploading}></input>
                    <img src={pen} alt="penlogo" />
                  </label>
                </div>
              </div>
          </div>



          <div className={styles.worksinput}>
            <input type='text'
              onChange={(e) => setWorkout({ ...workout, type: e.target.value })} placeholder="type">
            </input>

            <input type="text"
              onChange={(e) => setWorkout({ ...workout, name: e.target.value })} placeholder="name">
            </input>

            <textarea placeholder='description' rows={2} cols={40}
              onChange={(e) => setWorkout({ ...workout, description: e.target.value })} />

            <input type="text"
              onChange={(e) => setWorkout({ ...workout, reps: e.target.value })} placeholder="reps">
            </input>

            <input type="text"
              onChange={(e) => setWorkout({ ...workout, series: e.target.value })} placeholder="series">
            </input> 

            <div className={styles.buttons}>
              <button className={styles.save} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSubmit(); } }>Save</button>
              <button className={styles.reload} onClick={() => { handleOnClick(); } }>reset</button>
            </div>
            
          </div>

        </form>
      
          <div className={styles.profile}>
            <h3>new created workout</h3>
            <div className={styles.box}>
              <img src={workout.image ? workout.image : pic} alt="workout_Image" />
              <div className={styles.elements}>
                <p>workout name: {workout.name}</p>
                <p>workout type: {workout.type}</p>
                <p>workout description: {workout.description}</p>
          </div>

          </div>
        </div>
      </div>
    </div>
);
}

export default AddWorkout;