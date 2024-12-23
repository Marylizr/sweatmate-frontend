import React, { useRef, useState, useEffect } from 'react';
import customFetch from '../../api';
import pen from '../../pages/UserDashboard/images/pen.svg';
import pic from "../../assets/person.svg";
import FollowCard from '../../components/card/FollowCard';
import styles from './userProfile.module.css';
import Cropper from 'react-easy-crop';

const BeforeAndAfter = ({ userId }) => {
  const [progresses, setProgresses] = useState({});
  const [user, setUser] = useState({});
  const [historials, setHistorial] = useState([]);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const inputFile = useRef(null);

  useEffect(() => {
    customFetch("GET", `user/${userId}`)
      .then((json) => setUser(json))
      .catch((err) => console.error("Error fetching user data:", err));
  }, [userId]);

  const onSubmit = async () => {
    try {
      const croppedImage = await cropAndUploadImage();

      const data = {
        userId: user._id,
        name: user.name,
        weight: progresses.weight,
        waist: progresses.waist,
        hips: progresses.hips,
        chest: progresses.chest,
        bodyFat: progresses.bodyFat,
        date: progresses.date,
        picture: croppedImage,
      };

      await customFetch("POST", "progress", { body: data });
      alert('Are you sure that you want to save this setting?');
      window.location.reload();
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const cropAndUploadImage = async () => {
    if (!imageToCrop || !croppedAreaPixels) {
      alert("Please upload and crop the image before saving.");
      return null;
    }

    try {
      const blob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const base64Image = await blobToBase64(blob);
      return await fileUpload(base64Image);
    } catch (error) {
      console.error("Error during image cropping/uploading:", error);
      return null;
    }
  };

  const fileUpload = async (base64Image) => {
    const formData = new FormData();
    formData.append("file", base64Image);
    formData.append("upload_preset", 'h9rhkl6h');
    const url = `https://api.cloudinary.com/v1_1/da6il8qmv/image/upload`;

    try {
      const response = await fetch(url, { method: "POST", body: formData });
      const photo = await response.json();
      return photo.url || null;
    } catch (error) {
      console.error("Error uploading the image:", error);
      return null;
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
          if (blob) resolve(blob);
          else reject(new Error("Canvas is empty or unsupported format"));
        }, 'image/jpeg');
      };
      image.onerror = (error) => reject(error);
    });
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageToCrop(imageUrl);
      setIsCropModalOpen(true);
    }
  };

  const showCroppedImage = async () => {
    try {
      const blob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const base64Image = await blobToBase64(blob);
      setProgresses((prev) => ({ ...prev, picture: base64Image }));
      setIsCropModalOpen(false);
    } catch (e) {
      console.error("Error cropping the image:", e);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  useEffect(() => {
    customFetch("GET", "progress")
      .then((json) => setHistorial(json))
      .catch((error) => console.error("Error fetching progress data:", error));
  }, []);

  return (
    <div className={styles.containerWrap}>
      <div className={styles.editbox}>
        <form className={styles.form}>
          <h2>Add Measurements for {user.name}</h2>

          <div className={styles.images}>
            <div className={styles.userimage}>
              <img src={progresses.picture || pic} className={styles.imagen} alt="userImage" />
            </div>

            <label>
              <input
                type="file"
                ref={inputFile}
                onChange={handleFileChange}
                className={styles.uploading}
              />
              <img src={pen} alt="penlogo" />
            </label>
          </div>

          <div className={styles.progressinput}>
            <input type="text" value={user.name || ""} readOnly placeholder="Name" />
            <input
              type="text"
              onChange={(e) => setProgresses({ ...progresses, weight: e.target.value })}
              placeholder="Weight"
            />
            <input
              type="text"
              onChange={(e) => setProgresses({ ...progresses, waist: e.target.value })}
              placeholder="Waist"
            />
            <input
              type="text"
              onChange={(e) => setProgresses({ ...progresses, bodyFat: e.target.value })}
              placeholder="Body Fat"
            />
            <input
              type="text"
              onChange={(e) => setProgresses({ ...progresses, hips: e.target.value })}
              placeholder="Hips"
            />
            <input
              type="text"
              onChange={(e) => setProgresses({ ...progresses, chest: e.target.value })}
              placeholder="Chest"
            />
            <input
              type="date"
              onChange={(e) => setProgresses({ ...progresses, date: e.target.value })}
              placeholder="Date"
            />
          </div>

          <div className={styles.buttons}>
            <button
              className={styles.save}
              onClick={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>

      <div className={styles.historial}>
        {historials &&
          historials.length > 0 &&
          historials
            .filter((item) => item.name === user.name)
            .map((item) => (
              <FollowCard item={item} id={item._id} key={item._id} />
            ))}
      </div>

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
            <button className={styles.saveCropButton} onClick={showCroppedImage}>
              Crop & Save Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeforeAndAfter;
