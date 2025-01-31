import { useEffect, useState, useRef } from "react";
import styles from "../settings.module.css";
import userimg from '../../../assets/person.svg';
import customFetch from '../../../api';
import pen from '../../../assets/pen_white.svg';
import eye from '../../../assets/eye.svg';
import Cropper from 'react-easy-crop';

const Settings = () => {
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisibility = () => setPasswordShown(!passwordShown);

    const [user, setUser] = useState({
        name: "name",
        email: "email",
        password: "pass",
        image: "image",
        age: "age",
        height: "height",
        weight: "weight",
        goal: "goal"
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
            .then(json => setUser({ ...json, password: "" }))
            .catch(err => console.error("Failed to fetch user data:", err));
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
                        resolve(blob);  // Return Blob for uploading
                    } else {
                        reject(new Error("Canvas is empty or unsupported format"));
                    }
                }, 'image/jpeg');
            };
            image.onerror = (error) => reject(error);
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Use the cropped image if it exists, otherwise fallback to the user's current image
        const imageUrl = croppedImage ? await fileUpload(croppedImage) : user.image;

        const data = {
            name: user.name,
            email: user.email,
            password: user.password,
            image: imageUrl,
            age: user.age,
            height: user.height,
            weight: user.weight,
            goal: user.goal
        };

        try {
            await customFetch("PUT", "user", { body: data });
            alert("Information Updated");
        } catch (err) {
            console.error("Failed to update information:", err);
            alert("Failed to update information.");
        }
    };

    const fileUpload = async (base64Image) => {
        const formData = new FormData();
        formData.append("file", base64Image);  // Base64 image string
        formData.append("upload_preset", "h9rhkl6h");

        const url = `https://api.cloudinary.com/v1_1/da6il8qmv/image/upload`;

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData
            });

            const photo = await response.json();
            console.log("Cloudinary Response:", photo);

            if (photo.error) {
                throw new Error(`Cloudinary Error: ${photo.error.message}`);
            }

            if (!photo.url) throw new Error("No URL returned from Cloudinary");

            return photo.url;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
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

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const showCroppedImage = async () => {
        try {
            const blob = await getCroppedImg(imageToCrop, croppedAreaPixels);

            if (!(blob instanceof Blob)) {
                throw new Error("Cropped image is not a Blob");
            }

            // Convert Blob to Base64 for display and storage
            const base64Image = await blobToBase64(blob);

            // Set the preview of the cropped image
            setCroppedImage(base64Image);  // Now used to show a preview of the cropped image
            setIsCropModalOpen(false);
        } catch (e) {
            console.error("Error cropping the image:", e);
        }
    };

    return (
        <div className={styles.editbox}>
            <form className={styles.form} onSubmit={onSubmit}>
                <p>Edit profile</p>

                <div className={styles.images}>
                    <div className={styles.userimage}>
                        <img src={croppedImage || (user.image ? user.image : userimg)} className={styles.imagen} alt="userImage" />
                    </div>
                    <div className={styles.editimg}>
                        <label>
                            <input type="file" ref={inputFile} onChange={handleFileChange} className={styles.uploading} />
                            <img src={pen} alt="pen icon" />
                        </label>
                    </div>
                </div>

                <div className={styles.namesinput}>
                    <input
                        className={styles.names}
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        placeholder={user.name}
                    />
                    <input
                        className={styles.email}
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder={user.email}
                    />
                    <input
                        className={styles.names}
                        type="number"
                        value={user.age}
                        onChange={(e) => setUser({ ...user, age: e.target.value })}
                        placeholder={`${user.age} years old`}
                    />
                    <input
                        className={styles.names}
                        type="number"
                        value={user.height}
                        onChange={(e) => setUser({ ...user, height: e.target.value })}
                        placeholder={`${user.height} Cm`}
                    />
                    <input
                        className={styles.names}
                        type="number"
                        value={user.weight}
                        onChange={(e) => setUser({ ...user, weight: e.target.value })}
                        placeholder={`${user.weight} Kg`}
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

                <button type="submit" className={styles.submit}>Save</button>
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

export default Settings;
