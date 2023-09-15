import React, { useRef, useState, useEffect} from 'react';
import customFetch from '../../api';
import pen from '../../pages/UserAccount/images/pen.svg';
import pic from "../../utils/back1.jpg";
import FollowCard from '../card/FollowCard';
import styles from '../followUp/followUp.module.css';
import NavBar from '../navBar/navBar';



const FollowUp = () => {

  
    const [progresses, setProgresses] = useState([]);
    const [historials, setHistorial ] = useState([]);

  const onSubmit = async () => {

    const imagen = fileUpload();

    let isUploaded;
    await imagen.then(result => { isUploaded = result; });

    const data = {
      weight: progresses.weight,
      waist: progresses.waist,
      hips: progresses.hips,
      chest: progresses.chest,
      bodyFat: progresses.bodyFat,
      date: progresses.date,
      picture: isUploaded ? isUploaded : progresses.picture,
    };


    customFetch("POST", "progress", { body: data })
      .catch(err => console.log(err))
      .then(alert('are you sure that you want to save this setting?'))
      .then(window.location.reload())
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

  const handleOnClick = () => {
   window.location.reload();
 };

 useEffect(() => {
   customFetch("GET", "progress")
     .then((json) => {
     setHistorial(json);
     })
     .catch((error) => {
       console.log(error);
     })
 }, [setHistorial]);

  return (
    <div className={styles.container}>
       <NavBar />
       <h1>My Progress</h1>
       <div className={styles.wrapper}>
         
         <div className={styles.editbox}>
            <form className={styles.form}>
               <h2>Add Messuremnts</h2>

               <div className={styles.images}>
                  <div className={styles.userimage}><img src={progresses ? progresses.image : pic} 
                  className={styles.imagen} alt="userImage" /></div>

                  <label>
                     <input type='file' ref={inputFile}
                        onChange={(e) => setProgresses({ ...progresses, image: URL.createObjectURL(e.target.files[0]) })}
                        className={styles.uploading}></input>
                     <img src={pen} alt="penlogo" />
                  </label>
               </div>

               <div className={styles.progressinput}>

                  <input type='text'
                  onChange={(e) => setProgresses({ ...progresses, weight: e.target.value })} placeholder="weight">
                  </input>

                  <input type="text"
                  onChange={(e) => setProgresses({ ...progresses, waist: e.target.value })} placeholder="waist">
                  </input>

                  <input type="text"
                  onChange={(e) => setProgresses({ ...progresses, bodyFat: e.target.value })} placeholder="bodyfat">
                  </input>

                  <input type="text"
                  onChange={(e) => setProgresses({ ...progresses, hips: e.target.value })} placeholder="hips">
                  </input> 

                  <input type="text"
                  onChange={(e) => setProgresses({ ...progresses, chest: e.target.value })} placeholder="chest">
                  </input> 

                  <input type="date"
                  onChange={(e) => setProgresses({ ...progresses, date: e.target.value })} placeholder="date">
                  </input> 

                  <textarea placeholder='note' rows={2} cols={40}
                  onChange={(e) => setProgresses({ ...progresses, note: e.target.value })} />

               </div>
               
               <div className={styles.buttons}>
                  <button className={styles.save} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSubmit(); } }>Save</button>
                  <button className={styles.reload} onClick={() => { handleOnClick(); } }>reset</button>
               </div>
            </form>
      </div>

      <div className={styles.historial}>
      {
      historials && historials.length > 0 && historials.map( item => 
        <FollowCard item={item} id={item._id} key={item._id}
       />)
    }

      </div>

       </div>
      
    </div>
  )
}

export default FollowUp;