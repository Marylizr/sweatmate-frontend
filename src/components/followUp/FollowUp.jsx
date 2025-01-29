import React, { useRef, useState, useEffect } from 'react';
import customFetch from '../../api';
import pen from '../../pages/UserDashboard/images/pen.svg';
import pic from "../../assets/person.svg";
import FollowCard from '../card/FollowCard';
import styles from '../followUp/followUp.module.css';
import arrow_left from '../../utils/arrow_left.svg';
import { Link } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';
import NavBar from '../navBar/navBar';

const FollowUp = () => {
  const [progresses, setProgresses] = useState([]);
  const [historials, setHistorial] = useState([]);
  const [user, setUser] = useState({
    id: "_id",
    name: "name",
    email: "email",
    password: "pass",
    image: "image",
    age: "age",
    height: "height",
    weight: "weight",
    goal: "goal",
  });
  const [gender, setGender] = useState();
  const [imageToCrop, setImageToCrop] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [error, setError] = useState(null); // State to track errors
  const inputFile = useRef(null);

  // Fetch user data
  useEffect(() => {
    customFetch("GET", "user/me")
        .then((json) => setUser({ ...json, id: "_id" }))
        .catch((error) => {
            if (error.message.includes('Authentication error')) {
                alert('Your session has expired. Please log in again.');
                window.location.href = '/login'; // Redirect to login page
            } else {
                setError("Failed to fetch user data.");
            }
        });
}, []);


  // Fetch gender
  useEffect(() => {
    customFetch("GET", "user/me")
      .then((json) => {
        setGender(json.gender);
      })
      .catch(() => {
        setError("Failed to fetch user gender.");
      });
  }, []);

  // Fetch progress history
  useEffect(() => {
    customFetch("GET", "progress")
      .then((json) => {
        setHistorial(json);
      })
      .catch(() => {
        setError("Failed to fetch progress history.");
      });
  }, []);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
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

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file); // Compress the image
        const imageUrl = URL.createObjectURL(compressedFile);
        setImageToCrop(imageUrl);
        setIsCropModalOpen(true);
      } catch (error) {
        setError("Error compressing the image.");
      }
    }
  };

  const showCroppedImage = async () => {
    try {
      const blob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const base64Image = await blobToBase64(blob);
      setCroppedImage(base64Image);
      setProgresses({ ...progresses, image: base64Image });
      setIsCropModalOpen(false);
    } catch (e) {
      setError("Error cropping the image.");
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;

      if (blob instanceof Blob) {
        reader.readAsDataURL(blob);
      } else {
        reject(new TypeError("Expected a Blob to convert to Base64"));
      }
    });
  };

  const onSubmit = async () => {
    const data = {
      userId: user.id,
      name: user.name,
      weight: progresses.weight,
      waist: progresses.waist,
      hips: progresses.hips,
      chest: progresses.chest,
      bodyFat: progresses.bodyFat,
      date: progresses.date,
      picture: croppedImage || progresses.picture,
    };

    try {
      await customFetch("POST", "progress", { body: data });
      alert("Progress saved successfully!");
      window.location.reload();
    } catch (err) {
      setError("Error saving progress.");
    }
  };

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.wrap}>
        <div className={styles.small_header}>
          {gender === 'female' ? (
            <Link to="/dashboard/female"><img src={arrow_left} alt='' /></Link>
          ) : (
            <Link to="/dashboard/male"><img src={arrow_left} alt='' /></Link>
          )}
          <h2> My Progress</h2>
        </div>

        {error && <div className={styles.error}>{error}</div>} {/* Display errors */}

        <div className={styles.wrapper}>
          <div className={styles.editbox}>
            <form className={styles.form}>
              <h2>{user.name} Add Measurements</h2>

              <div className={styles.images}>
                <div className={styles.userimage}>
                  <img
                    src={croppedImage || progresses.image || pic}
                    className={styles.imagen}
                    alt="userImage"
                  />
                </div>
                <label>
                  <input
                    type='file'
                    ref={inputFile}
                    onChange={handleFileChange}
                    className={styles.uploading}
                  />
                  <img src={pen} alt="penlogo" />
                </label>
              </div>

              <div className={styles.progressinput}>
                <input type="text" value={user.name} readOnly />
                <input type="text" onChange={(e) => setProgresses({ ...progresses, weight: e.target.value })} placeholder="Weight" />
                <input type="text" onChange={(e) => setProgresses({ ...progresses, waist: e.target.value })} placeholder="Waist" />
                <input type="text" onChange={(e) => setProgresses({ ...progresses, bodyFat: e.target.value })} placeholder="Body Fat" />
                <input type="text" onChange={(e) => setProgresses({ ...progresses, hips: e.target.value })} placeholder="Hips" />
                <input type="text" onChange={(e) => setProgresses({ ...progresses, chest: e.target.value })} placeholder="Chest" />
                <input type="date" onChange={(e) => setProgresses({ ...progresses, date: e.target.value })} placeholder="Date" />
                <textarea placeholder='Note' rows={2} cols={40} onChange={(e) => setProgresses({ ...progresses, note: e.target.value })} />
              </div>

              <div className={styles.buttons}>
                <button className={styles.save} onClick={(e) => { e.preventDefault(); onSubmit(); }}>Save</button>
                <button className={styles.reload} onClick={() => window.location.reload()}>Reset</button>
              </div>
            </form>
          </div>

          <div className={styles.historial}>
            {historials?.length > 0 && historials.filter(item => item.name === user.name).map(item => (
              <FollowCard item={item} id={item._id} key={item._id} />
            ))}
          </div>
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
              <button className={styles.saveCropButton} onClick={showCroppedImage}>Crop & Save Image</button>
            </div>
          </div>
        )}
      </div>
     
    </div>
  );
};

export default FollowUp;
