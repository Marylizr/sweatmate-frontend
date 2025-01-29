import React, { useEffect, useState, useRef } from "react";
import styles from "./editWorkouts.module.css";
import CardDelete from "../../components/card/cardDeleteWork";
import customFetch from "../../api";
import Modal from "../../components/Modal/Modal";
import { useModal } from "../../hooks/useModal";
import pen from "../../pages/UserDashboard/images/pen.svg";
import pic from "../../assets/person.svg";
import Cropper from "react-easy-crop";

const Workouts = () => {
  const [selectedItem, setSelectedItem] = useState();
  const [imageToCrop, setImageToCrop] = useState(null);
  const [videoToCrop, setVideoToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isVideoCrop, setIsVideoCrop] = useState(false);
  const [data, setData] = useState([]);
  const [workout, setWorkout] = useState([]);
  const [isOpenModal, openModal, closeModal] = useModal(false);

  const inputFile = useRef(null);
  const inputFileVideo = useRef(null);

  useEffect(() => {
    if (data.length) {
      setWorkout(data);
    }
  }, [data]);

  useEffect(() => {
    customFetch("GET", "workouts")
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

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

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
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
    const url = `https://api.cloudinary.com/v1_1/da6il8qmv/image/upload`;

    let imagen;
    let file = files[0];
    formData.append("file", file);
    formData.append("upload_preset", "h9rhkl6h");
    await fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((photo) => (imagen = photo.url))
      .catch((err) => console.error(err));

    return imagen;
  };

  const videoUpload = async () => {
    const files = inputFileVideo.current.files;
    const formData = new FormData();
    const url = `https://api.cloudinary.com/v1_1/da6il8qmv/video/upload`;

    let videoLoaded;
    let file = files[0];
    formData.append("file", file);
    formData.append("upload_preset", "h9rhkl6h");
    await fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((media) => (videoLoaded = media.url))
      .catch((err) => console.error(err));

    return videoLoaded;
  };

  const onSubmit = async () => {
    const imagen = fileUpload();
    const videoData = videoUpload();

    let resultado;
    await imagen.then((result) => (resultado = result));

    let VideoSet;
    await videoData.then((savedVideo) => (VideoSet = savedVideo));

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

    customFetch("PUT", "workouts", { body: data })
      .then((json) => setWorkout(json))
      .catch((err) => console.error(err));
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
        {workout &&
          workout.length > 0 &&
          workout
            .filter((item) => item.type)
            .map((item) => (
              <CardDelete
                item={item}
                id={item._id}
                key={item._id}
                onClick={() => {
                  setSelectedItem(item);
                  openModal();
                }}
              />
            ))}
      </div>
      {selectedItem && (
        <Modal isOpen={isOpenModal} closeModal={closeModal}>
          <p>{selectedItem.name}</p>
          <div className={styles.containerModal}>
            <form className={styles.form}>
              <div className={styles.images}>
                <img
                  src={selectedItem.picture ? selectedItem.picture : pic}
                  alt="workout_Image"
                />

                <div className={styles.editimg}>
                  <label>
                    <input
                      type="file"
                      ref={inputFile}
                      onChange={(e) => handleFileChange(e, false)} // For Image
                      className={styles.uploading}
                    />
                    <img src={pen} alt="penlogo" />
                  </label>
                </div>
              </div>

              <div className={styles.worksinput}>
                <input
                  type="text"
                  onChange={(e) =>
                    setWorkout({ ...workout, type: e.target.value })
                  }
                  placeholder={selectedItem.type}
                />

                <input
                  type="text"
                  onChange={(e) =>
                    setWorkout({ ...workout, name: e.target.value })
                  }
                  placeholder={selectedItem.name}
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
                  onChange={(e) =>
                    setWorkout({ ...workout, reps: e.target.value })
                  }
                  placeholder={selectedItem.reps}
                />

                <input
                  type="text"
                  onChange={(e) =>
                    setWorkout({ ...workout, series: e.target.value })
                  }
                  placeholder={selectedItem.series}
                />

                <video
                  controls
                  src={selectedItem.video}
                  className={styles.imagen}
                  alt="userVideo"
                />

                <label>
                  <input
                    type="file"
                    ref={inputFileVideo}
                    onChange={(e) => handleFileChange(e, true)} // For Video
                    className={styles.uploading}
                  />
                  <img src={pen} alt="penlogo" />
                </label>
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
                <button
                  className={styles.reload}
                  onClick={handleOnClick}
                >
                  Reset
                </button>
              </div>
            </form>
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
                <button
                  className={styles.saveCropButton}
                  onClick={showCroppedMedia}
                >
                  Crop & Save
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Workouts;
