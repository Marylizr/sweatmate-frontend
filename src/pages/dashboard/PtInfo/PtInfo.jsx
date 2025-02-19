import { useEffect, useState, useRef } from "react";
import customFetch from '../../../api';
import styles from './ptinfo.module.css';
import persona from '../../../assets/person_1.svg';
import Cropper from 'react-easy-crop';

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

  const [croppedImage, setCroppedImage] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const inputFile = useRef(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    customFetch("GET", "user/me")
      .then((json) => {
        setUser({ ...json, password: "" });
      })
      .catch(err => console.log(err, 'Cannot retrieve user information'));
  };

  const onSubmit = async () => {
    const imageUrl = croppedImage ? await fileUpload(croppedImage) : user.image;
    const data = {
      name: user.name,
      email: user.email,
      password: user.password,
      image: imageUrl,
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
  };

  // const fileUpload = async (base64Image) => {
  //   const formData = new FormData();
  //   formData.append("file", base64Image);
  //   formData.append("upload_preset", 'h9rhkl6h');
  //   const url = `https://api.cloudinary.com/v1_1/da6il8qmv/image/upload`;

  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       body: formData
  //     });
  //     const photo = await response.json();
  //     return photo.url || null;
  //   } catch (error) {
  //     console.log(error, 'Error uploading the image');
  //     return null;
  //   }
  // };


  const fileUpload = async (base64Image) => {
    const files = inputFile.current.files;
    const formData = new FormData();
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
    let uploadedImage;
    let file = files[0];
    formData.append("file", base64Image);
    formData.append("upload_preset", uploadPreset);
  
    try {
      const response = await fetch(url, { 
        method: "POST", 
        body: formData 
      });
      const photo = await response.json();
      uploadedImage = photo.url;
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  
    return uploadedImage;
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageToCrop(imageUrl);
      setIsCropModalOpen(true);
    }
  };

  const getCroppedImg = (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas is empty or unsupported format"));
          }
        }, 'image/jpeg');
      };
      image.onerror = (error) => reject(error);
    });
  };

  const showCroppedImage = async () => {
    try {
      const blob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const base64Image = await blobToBase64(blob);
      setCroppedImage(base64Image); // Save the Base64 image for preview and upload
      setUser({ ...user, image: base64Image });
      setIsCropModalOpen(false);
    } catch (e) {
      console.error("Error cropping the image:", e);
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div className={styles.userimage}>
          <img src={croppedImage || (user.image ? user.image : persona)} alt="userImage" />
          <input
            type='file'
            ref={inputFile}
            onChange={handleFileChange}
            className={styles.uploading}
          />
        </div>

        <div className={styles.namesinput}>
          <input type='text' value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} placeholder='Name' />
          <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder='Email' />
          <input type="number" onChange={(e) => setUser({ ...user, age: e.target.value })} placeholder={`${user.age} years old `} />
          <input type="text" onChange={(e) => setUser({ ...user, degree: e.target.value })} placeholder={`Degree: ${user.degree} `} />
          <input type="number" onChange={(e) => setUser({ ...user, experience: e.target.value })} placeholder={`${user.experience} Years of Experience `} />
          <input type="text" onChange={(e) => setUser({ ...user, specializations: e.target.value })} placeholder={`Specializations: ${user.specializations} `} />
          <textarea value={user.bio} onChange={(e) => setUser({ ...user, bio: e.target.value })} placeholder='Short Bio' rows="4" />
          <input type="text" onChange={(e) => setUser({ ...user, location: e.target.value })} placeholder={`Location: ${user.location} `} />
          <input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Password" />

          <button className={styles.submit} onClick={(e) => { e.preventDefault(); onSubmit(); }}> Save </button>
        </div>
      </form>

      {isCropModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.cropContainer}>
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <button className={styles.saveCropButton} onClick={showCroppedImage}>Crop & Save Image</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PtInfo;
