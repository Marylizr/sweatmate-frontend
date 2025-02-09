import React, { useRef, useContext, useState } from "react";
import Cropper from "react-easy-crop";
import { UserContext } from "../../components/userContext/userContext";
import customFetch from "../../api";
import styles from "../addWorkout/addworkout.module.css";
import pen from "../../assets/edit.svg";
import pic from "../../assets/image.svg";
import Card from "../addWorkout/Card";

const AddWorkout = () => {
  const { workout, setWorkout } = useContext(UserContext);
  const [lastData, setLastData] = useState("");
  
  // Cropper States
  const [imageToCrop, setImageToCrop] = useState(null);
  const [videoToCrop, setVideoToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isVideoCrop, setIsVideoCrop] = useState(false);
  
 
  const inputFile = useRef(null);
  const inputFileVideo = useRef(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = (e, isVideo = false) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      if (isVideo) {
        setVideoToCrop(fileUrl);
        setIsVideoCrop(true);
      } else {
        setImageToCrop(fileUrl);
        setIsVideoCrop(false);
      }
      setIsCropModalOpen(true);
    }
  };

  const getCroppedBlob = (source, pixelCrop) => {
    const media = new Image();
    media.src = source;

    return new Promise((resolve, reject) => {
      media.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        ctx.drawImage(
          media,
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
        }, "image/jpeg");
      };
      media.onerror = reject;
    });
  };

  const showCroppedMedia = async () => {
    try {
      const blob = await getCroppedBlob(
        isVideoCrop ? videoToCrop : imageToCrop,
        croppedAreaPixels
      );
      const url = URL.createObjectURL(blob);
      if (isVideoCrop) {
        setWorkout({ ...workout, video: url });
      } else {
        setWorkout({ ...workout, image: url });
      }
      setIsCropModalOpen(false);
    } catch (e) {
      console.error("Error cropping media:", e);
    }
  };

  const fileUpload = async () => {
    const files = inputFile.current.files;
    const formData = new FormData();
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
    let uploadedImage;
    let file = files[0];
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
  
    try {
      const response = await fetch(url, { method: "POST", body: formData });
      const photo = await response.json();
      uploadedImage = photo.url;
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  
    return uploadedImage;
  };
  
  const videoUpload = async () => {
    const files = inputFileVideo.current.files;
    const formData = new FormData();
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
  
    let uploadedVideo;
    let file = files[0];
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
  
    try {
      const response = await fetch(url, { method: "POST", body: formData });
      const media = await response.json();
      uploadedVideo = media.url;
    } catch (err) {
      console.error("Error uploading video:", err);
    }
  
    return uploadedVideo;
  };
  

  const onSubmit = async () => {
    const imagen = fileUpload();
    const videoData = videoUpload();

    let resultado;
    await imagen.then((result) => {
      resultado = result;
    });

    let VideoSet;
    await videoData.then((savedVideo) => {
      VideoSet = savedVideo;
    });

    const data = {
      type: workout.type,
      name: workout.name,
      description: workout.description,
      reps: workout.reps,
      series: workout.series,
      picture: resultado || workout.picture,
      video: VideoSet || workout.video,
      frontpage: workout.frontpage,
    };

    console.log(data);

    customFetch("POST", "workouts", { body: data })
      .then(() => {
        setLastData(data);
        alert("Workout saved");
      })
      .catch((err) => console.error(err));
  };

  const onReset = () => {
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <h2>Add a Workout</h2>
      <div className={styles.wrap}>
        <form className={styles.form}>
          <div className={styles.media}>
            <div className={styles.images}>
              <div className={styles.userimage}>
                <img
                  src={workout.image || pic}
                  className={styles.imagen}
                  alt="userImage"
                />
              </div>
              <div className={styles.editimg}>
                <label>
                  <input
                    type="file"
                    ref={inputFile}
                    onChange={(e) => handleFileChange(e)}
                    className={styles.uploading}
                  />
                  <img src={pen} alt="penlogo" />
                </label>
              </div>
            </div>

            <div className={styles.images}>
              <div className={styles.userimage}>
                <video
                  controls
                  src={workout.video}
                  className={styles.imagen}
                  alt="userVideo"
                />
              </div>
              <div className={styles.editimg}>
                <label>
                  <input
                    type="file"
                    ref={inputFileVideo}
                    onChange={(e) => handleFileChange(e, true)}
                    className={styles.uploading}
                  />
                  <img src={pen} alt="penlogo" />
                </label>
              </div>
            </div>
          </div>

          <div className={styles.worksinput}>
            <input
              type="text"
              onChange={(e) => setWorkout({ ...workout, type: e.target.value })}
              placeholder="type"
            />

            <input
              type="text"
              onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
              placeholder="name"
            />

            <textarea
              placeholder="description"
              rows={2}
              cols={40}
              onChange={(e) =>
                setWorkout({ ...workout, description: e.target.value })
              }
            />

            <input
              type="text"
              onChange={(e) => setWorkout({ ...workout, reps: e.target.value })}
              placeholder="reps"
            />

            <input
              type="text"
              onChange={(e) =>
                setWorkout({ ...workout, series: e.target.value })
              }
              placeholder="series"
            />

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
              <button className={styles.reload} onClick={onReset}>
                Reset
              </button>
            </div>
          </div>
        </form>

        {lastData && <Card item={lastData} />}
      </div>

      {isCropModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.cropContainer}>
            <Cropper
              image={isVideoCrop ? videoToCrop : imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <button className={styles.saveCropButton} onClick={showCroppedMedia}>
              Crop & Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddWorkout;
