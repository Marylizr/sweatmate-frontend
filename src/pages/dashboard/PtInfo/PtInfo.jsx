import { useEffect, useState, useRef } from "react";
import customFetch from '../../../api';
import styles from './ptinfo.module.css';
import persona from '../../../assets/person_1.svg';
import Cropper from 'react-easy-crop';

const PtInfo = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    age: "",
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
        console.log("API Response:", json);
        setUser(prevUser => ({
          ...prevUser,
          ...json,
          password: ""  // Clear password field on load
        }));
      })
      .catch(err => console.log("Cannot retrieve user information:", err));
  };

  const onSubmit = async () => {
    const imageUrl = croppedImage ? await fileUpload(croppedImage) : user.image;
    
    const data = {
      name: user.name || "",
      email: user.email || "", // Ensure email is always included
      image: imageUrl,
      age: user.age || "",
      degree: user.degree || "",
      experience: user.experience || "",
      specializations: user.specializations || "",
      bio: user.bio || "",
      location: user.location || ""
    };

    // Only include password if it's provided (avoid updating with an empty string)
    if (user.password) {
      data.password = user.password;
    }

    console.log("Submitting Profile Update:", data); // Debugging

    try {
      const response = await customFetch("PUT", "user", { 
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" } // Ensure JSON request format
      });
      console.log("Profile update response:", response);
      alert("Information Updated");
    } catch (err) {
      console.error("Unable to update information:", err);
    }
  };

  const fileUpload = async (base64Image) => {
    const formData = new FormData();
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    formData.append("file", base64Image);
    formData.append("upload_preset", uploadPreset);
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData
      });
      const photo = await response.json();
      return photo.url || null;
    } catch (error) {
      console.log("Error uploading the image:", error);
      return null;
    }
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
      setCroppedImage(base64Image);
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
          <input type="number" value={user.age} onChange={(e) => setUser({ ...user, age: e.target.value })} placeholder='Age' />
          <input type="text" value={user.degree} onChange={(e) => setUser({ ...user, degree: e.target.value })} placeholder='Degree' />
          <input type="number" value={user.experience} onChange={(e) => setUser({ ...user, experience: e.target.value })} placeholder='Experience (years)' />
          <input type="text" value={user.specializations} onChange={(e) => setUser({ ...user, specializations: e.target.value })} placeholder='Specializations' />
          <textarea value={user.bio} onChange={(e) => setUser({ ...user, bio: e.target.value })} placeholder='Short Bio' rows="4" />
          <input type="text" value={user.location} onChange={(e) => setUser({ ...user, location: e.target.value })} placeholder='Location' />
          <input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="New Password" />

          <button className={styles.submit} onClick={(e) => { e.preventDefault(); onSubmit(); }}> Save </button>
        </div>
      </form>
    </div>
  );
};

export default PtInfo;
