import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "../settings.module.css";
import userimg from '../../../assets/person_1.svg';
import customFetch from '../../../api';
import pen from '../../../assets/pen_white.svg';
import eye from '../../../assets/eye.svg';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../../components/imageCropper/CropImage';

const Settings = () => {
    const [passwordShown, setPasswordShown] = useState(false);
    const [user, setUser] = useState({
        name: "name",
        email: "email",
        password: "",
        image: "",
        age: "",
        height: "",
        weight: "",
        goal: "Fat-Lost"
    });

    const [image, setImage] = useState(null); // Uploaded image for cropping
    const [croppedImage, setCroppedImage] = useState(null); // Final cropped image
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const inputFile = useRef(null);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    // Fetch user data on mount
    useEffect(() => {
        const getUser = async () => {
            try {
                const json = await customFetch("GET", "user/me");
                setUser({ ...json, password: "" });
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        getUser();
    }, []);

    // Handles image upload
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file)); // Set image for cropping
        }
    };

    // Handle crop complete and get cropped image
    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Save the cropped image
    const handleSaveCroppedImage = useCallback(async () => {
        try {
            const croppedImageUrl = await getCroppedImg(image, croppedAreaPixels);
            setCroppedImage(croppedImageUrl);
            setUser((prev) => ({ ...prev, image: croppedImageUrl })); // Update user image
            setImage(null); // Close the cropper modal
        } catch (error) {
            console.error("Error cropping image:", error);
        }
    }, [image, croppedAreaPixels]);

    // Handles form submission
    const onSubmit = async (e) => {
      e.preventDefault();
      e.stopPropagation();
  
      const imageUrl = await fileUpload();
      const data = {
          ...user,
          image: imageUrl || user.image,
      };
  
      try {
          await customFetch("PUT", "user", { body: data });
          alert("Information Updated");
      } catch (error) {
          console.error("Failed to update information:", error);
          alert(`Error updating information: ${error.message}`);
      }
  };
  

    // Handles file upload to Cloudinary
    const fileUpload = async () => {
        const files = inputFile.current.files;
        if (!files.length) return null;

        const formData = new FormData();
        const url = "https://api.cloudinary.com/v1_1/da6il8qmv/image/upload";
        formData.append("file", files[0]);
        formData.append("upload_preset", "h9rhkl6h");

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });
            const photo = await response.json();
            return photo.url;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    return (
        <div className={styles.editbox}>
            <form className={styles.form} onSubmit={onSubmit}>
                <p>Edit Profile</p>

                <div className={styles.images}>
                    <div className={styles.userimage}>
                        <img src={croppedImage || user.image || userimg} className={styles.imagen} alt="userImage" />
                    </div>
                    <div className={styles.editimg}>
                        <label>
                            <input
                                type="file"
                                ref={inputFile}
                                onChange={handleFileChange}
                                className={styles.uploading}
                            />
                            <img src={pen} alt="pen icon" />
                        </label>
                    </div>
                </div>

                {/* Modal Cropper UI */}
                {image && (
                    <div className={styles.overlay}>
                        <div className={styles.cropContainer}>
                            <div className={styles.cropArea}>
                                <Cropper
                                    image={image}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1} // Square crop
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleSaveCroppedImage}
                                className={styles.saveCropButton}
                            >
                                Save Cropped Image
                            </button>
                        </div>
                    </div>
                )}

                {/* User information inputs */}
                <div className={styles.namesinput}>
                    <input
                        className={styles.names}
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        placeholder="Name"
                    />
                    <input
                        className={styles.email}
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="Email"
                    />
                    <input
                        className={styles.names}
                        type="number"
                        value={user.age}
                        onChange={(e) => setUser({ ...user, age: e.target.value })}
                        placeholder="Age"
                    />
                    <input
                        className={styles.names}
                        type="number"
                        value={user.height}
                        onChange={(e) => setUser({ ...user, height: e.target.value })}
                        placeholder="Height (cm)"
                    />
                    <input
                        className={styles.names}
                        type="number"
                        value={user.weight}
                        onChange={(e) => setUser({ ...user, weight: e.target.value })}
                        placeholder="Weight (kg)"
                    />
                    <select
                        className={styles.names}
                        value={user.goal}
                        onChange={(e) => setUser({ ...user, goal: e.target.value })}
                    >
                        <option value="Fat-Lost">Fat Lost</option>
                        <option value="Gain-Muscle-Mass">Gain Muscle Mass</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>

                {/* Password input with toggle visibility */}
                <div className={styles.passwordeye}>
                    <input
                        className={styles.password}
                        type={passwordShown ? "text" : "password"}
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        placeholder="Password"
                    />
                    <i className={styles.eye} onClick={togglePasswordVisibility}>
                        <img src={eye} alt="eye-icon" />
                    </i>
                </div>

                <button type="submit" className={styles.submit}>
                    Save
                </button>
            </form>
        </div>
    );
};

export default Settings;
