 import React,{ useEffect, useState, useRef}from 'react';
 import styles from './editWorkouts.module.css';
 import CardDelete from '../../components/card/cardDeleteWork'
 import customFetch from '../../api';
 import Modal from "../../components/Modal/Modal";
 import { useModal } from "../../hooks/useModal";
 import pen from '../../pages/UserDashboard/images/pen.svg';
import pic from "../../utils/back1.jpg";


 const Workouts = () => {
  const [selectedItem, setSelectedItem] = useState();
  const [data, setData] = useState([]);
  const [workout, setWorkout] = useState([]);
  const [isOpenModal, openModal, closeModal] = useModal(false);

  useEffect(() => {
    if (data.length) {
      setWorkout(data);
    }
  }, [data, setWorkout]);


  useEffect(() => {
    customFetch("GET", "workouts")
      .then((json) => {
      setData(json);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [setWorkout]);


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
 
 
    customFetch("PUT", "workouts", { body: data })
      .catch(err => console.log(err))
      .then((json) => {
         setWorkout(json)
      })
  };

  const handleOnClick = () => {
    window.location.reload();
  };

   return (
    <div className={styles.container}>
    <div className={styles.small_header}> 
      <h2>Edit Workouts</h2>
    </div>
    
    <div className={styles.wrap}>
      {
        workout && workout.length > 0 && workout.filter(item => item.type ).map( item => 
          <CardDelete item={item} id={item._id} key={item._id}
          onClick={() => {
            setSelectedItem(item); 
            openModal(false)  
        }}/>)
      }
    </div>
    {selectedItem &&  
        <Modal isOpen={isOpenModal} closeModal={closeModal}>
         <p>{selectedItem.name}</p>
            <div className={styles.containerModal}>
              <form className={styles.form}>
                  <div className={styles.images}>
                  <img src={selectedItem.picture ? selectedItem.picture : pic } 
                     alt="workout_Image" />
                  
                  <div className={styles.editimg}>
                     <label>
                     <input type='file' ref={inputFile}
                        onChange={(e) => setWorkout({ ...workout, image: URL.createObjectURL(e.target.files[0]) })}
                        className={styles.uploading}></input>
                     <img src={pen} alt="penlogo" />
                     </label>
                  </div>
                  </div>

               <div className={styles.worksinput}>
                  <input type='text'
                     onChange={(e) => setWorkout({ ...workout, type: e.target.value })} placeholder={selectedItem.type}>
                  </input>

                  <input type="text"
                     onChange={(e) => setWorkout({ ...workout, name: e.target.value })} placeholder={selectedItem.name}>
                  </input>

                  <textarea placeholder='description' rows={2} cols={40}
                     onChange={(e) => setWorkout({ ...workout, description: e.target.value })} />

                  <input type="text"
                     onChange={(e) => setWorkout({ ...workout, reps: e.target.value })} placeholder={selectedItem.reps}>
                  </input>

                  <input type="text"
                     onChange={(e) => setWorkout({ ...workout, series: e.target.value })} placeholder={selectedItem.series}>
                  </input> 

                    <video controls src={selectedItem.video}
                     className={styles.imagen} alt="userVideo" />

                     <label>
                     <input type='file' ref={inputFileVideo}
                        onChange={(e) => setWorkout({ ...workout, video: URL.createObjectURL(e.target.files[0]) })}
                        className={styles.uploading}></input>
                     <img src={pen} alt="penlogo" />
                     </label>
                  
               
               </div>
                  <div className={styles.buttons}>
                      <button className={styles.save} onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        onSubmit(); 
                        }}>Save</button>
                      <button className={styles.reload} onClick={() => { handleOnClick(); } }>reset</button>
                    </div>
                </form>
              </div>      
          </Modal>}

  </div>
   )
 }
 
 export default Workouts