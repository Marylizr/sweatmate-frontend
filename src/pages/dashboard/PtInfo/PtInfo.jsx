import { useEffect, useState, useRef } from "react";
import customFetch from '../../../api';
import styles from './ptinfo.module.css';
import persona from '../../../assets/person_1.svg';


const PtInfo = () => {
 

  const [user, setUser] = useState({
    name: "name",
    email: "email",
    password: "pass",
    image: "image",
    age: "age",
    degree: "",
    experience: "",
    specializations: "",
    bio: "",
    location: ""
  });

  const getUser = () => {
    customFetch("GET", "user/me")
      .then((json) => {
        setUser({ ...json, password: "" });
      })
      .catch(err => console.log(err, 'Cannot retrieve user information'));
  }

  useEffect(() => {
    getUser();
  }, []);

  const onSubmit = async () => {
    const imageUrl = await fileUpload();
    const data = {
      name: user.name,
      email: user.email,
      password: user.password,
      image: imageUrl ? imageUrl : user.image,
      age: user.age,
      degree: user.degree,
      experience: user.experience,
      specializations: user.specializations,
      bio: user.bio,
      location: user.location
    };

    customFetch("PUT", "user", { body: data })
      .then(() => alert('Information Updated'))
      .catch(err => console.log(err, 'Unable to update information'));
  }

  const fileUpload = async () => {
    const files = inputFile.current.files;
    if (files.length === 0) return null;

    const formData = new FormData();
    const url = `https://api.cloudinary.com/v1_1/da6il8qmv/image/upload`;
    let imageUrl = null;

    formData.append("file", files[0]);
    formData.append("upload_preset", 'h9rhkl6h');

    await fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    })
    .then(response => response.json())
    .then(photo => {
      imageUrl = photo.url;
    })
    .catch((error) => {
      console.log(error, 'Error uploading the image');
    });

    return imageUrl;
  }

  const inputFile = useRef(null);

  return (
    <div className={styles.container}>
      <form className={styles.form}>
      
          <div className={styles.userimage}>
            <img src={user.image ? user.image : persona} alt="userImage" />

            <input type='file' ref={inputFile} 
            onChange={(e) => setUser({...user, image: URL.createObjectURL(e.target.files[0])}) }
            className={styles.uploading} />
            
          </div>

        <div className={styles.namesinput}>
          <input
            type='text'
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            placeholder='Name'
          />

          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder='Email'
          />

          <input
            type="number"
            onChange={(e) => setUser({ ...user, age: e.target.value })}
            placeholder={`${user.age} years old `}
          />

          <input
            type="text"
            onChange={(e) => setUser({ ...user, degree: e.target.value })}
            placeholder={`Degree: ${user.degree} `} 
            />

          <input
            type="number"
            onChange={(e) => setUser({ ...user, experience: e.target.value })}
            placeholder={`${user.experience} Years of Experience `}
          />

          <input
            type="text"
            onChange={(e) => setUser({ ...user, specializations: e.target.value })}
            placeholder={`Specializations: ${user.specializations} `} 
            />
          

          <textarea
            value={user.bio}
            onChange={(e) => setUser({ ...user, bio: e.target.value })}
            placeholder='Short Bio'
            rows="4"
          />

          <input
            type="text"
            onChange={(e) => setUser({ ...user, location: e.target.value })}
            placeholder={`Location: ${user.location} `} 
            
          />
       
          <input
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Password"
          />
          
         <button
            className={styles.submit}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSubmit(); }}
         > Save
         </button>
        </div>

      </form>
    </div>
  );
}

export default PtInfo;
