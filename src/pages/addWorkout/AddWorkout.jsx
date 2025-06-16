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
  const [muscleGroup, setMuscleGroup] = useState(workout.muscleGroup || "");

  // --- Cropper State & Handlers (unchanged) ---
  const [imageToCrop, setImageToCrop] = useState(null);
  const [videoToCrop, setVideoToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isVideoCrop, setIsVideoCrop] = useState(false);

  const inputFile = useRef(null);
  const inputFileVideo = useRef(null);

  const onCropComplete = (_area, pixels) => setCroppedAreaPixels(pixels);

  const handleFileChange = (e, isVideo = false) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    isVideo ? setVideoToCrop(url) : setImageToCrop(url);
    setIsVideoCrop(isVideo);
    setIsCropModalOpen(true);
  };

  const getCroppedBlob = (src, pixelCrop) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        canvas.toBlob((blob) =>
          blob ? resolve(blob) : reject(new Error("Crop failed"))
        , "image/jpeg");
      };
      img.onerror = reject;
    });

  const showCroppedMedia = async () => {
    try {
      const blob = await getCroppedBlob(
        isVideoCrop ? videoToCrop : imageToCrop,
        croppedAreaPixels
      );
      const url = URL.createObjectURL(blob);
      setWorkout({
        ...workout,
        ...(isVideoCrop ? { video: url } : { image: url }),
      });
      setIsCropModalOpen(false);
    } catch (e) {
      console.error("Error cropping:", e);
    }
  };

  // --- Cloudinary upload helper (unchanged) ---
  const uploadToCloudinary = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/${type}/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return data.url;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    let picture = workout.picture;
    let video = workout.video;

    if (inputFile.current.files[0]) {
      picture = await uploadToCloudinary(inputFile.current.files[0], "image");
    }
    if (inputFileVideo.current.files[0]) {
      video = await uploadToCloudinary(inputFileVideo.current.files[0], "video");
    }

    // 🔒 Scope by trainer if role is "trainer"
    const role = getUserRole();
    const trainerId = role === "trainer" ? getUserId() : null;

    const payload = {
      ...workout,
      muscleGroup,
      picture,
      video,
      personalTrainerId: trainerId,
    };

    try {
      await customFetch("POST", "workouts", { body: payload });
      setLastData(payload);
      alert("Workout saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving workout");
    }
  };

  const onReset = () => window.location.reload();

  return (
    <div className={styles.container}>
      <h2>Add a Workout</h2>
      <form className={styles.form} onSubmit={onSubmit}>
        {/* Media Uploads */}
        <div className={styles.media}>
          {/* Image */}
          <div className={styles.images}>
            <div className={styles.userimage}>
              <img
                src={workout.image || pic}
                alt="Workout"
                className={styles.imagen}
              />
            </div>
            <label className={styles.editimg}>
              <input
                type="file"
                ref={inputFile}
                onChange={(e) => handleFileChange(e)}
                className={styles.uploading}
              />
              <img src={pen} alt="Edit" />
            </label>
          </div>

          {/* Video */}
          <div className={styles.images}>
            <div className={styles.userimage}>
              <video
                controls
                src={workout.video}
                className={styles.imagen}
              />
            </div>
            <label className={styles.editimg}>
              <input
                type="file"
                ref={inputFileVideo}
                onChange={(e) => handleFileChange(e, true)}
                className={styles.uploading}
              />
              <img src={pen} alt="Edit" />
            </label>
          </div>
        </div>

        {/* Workout Details */}
        <div className={styles.worksinput}>
          <select
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            required
          >
            <option value="">Select muscle group</option>
            <option value="arms">Arms</option>
            <option value="legs">Legs</option>
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="glutes">Glutes</option>
            <option value="hamstrings">Hamstrings</option>
            <option value="quadriceps">Quadriceps</option>
            <option value="abs">Abs</option>
            <option value="shoulders">Shoulders</option>
            <option value="fullbody">Fullbody</option>
          </select>

          <input
            type="text"
            placeholder="Name"
            value={workout.name || ""}
            onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
            required
          />

          <textarea
            placeholder="Description"
            rows={2}
            value={workout.description || ""}
            onChange={(e) =>
              setWorkout({ ...workout, description: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Reps"
            value={workout.reps || ""}
            onChange={(e) => setWorkout({ ...workout, reps: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Series"
            value={workout.series || ""}
            onChange={(e) =>
              setWorkout({ ...workout, series: e.target.value })
            }
            required
          />

          <div className={styles.buttons}>
            <button type="submit" className={styles.save}>
              Save
            </button>
            <button type="button" className={styles.reload} onClick={onReset}>
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* Preview */}
      {lastData && <Card item={lastData} />}

      {/* Crop Modal */}
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
            <button
              className={styles.saveCropButton}
              onClick={showCroppedMedia}
            >
              Crop & Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddWorkout;