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

  // Fetch logged-in user data
  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please log in.");
        return;
      }

      const json = await customFetch("GET", "user/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Fetched User Data:", json);

      if (json && json.email) {
        setUser({
          ...json,
          password: "" // Do not prefill password
        });
      } else {
        console.error("Invalid user data received");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Function to update user profile
  const onSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authorization token is missing. Please log in again.");
      return;
    }

    const imageUrl = croppedImage ? await fileUpload(croppedImage) : user.image;

    const data = {
      name: user.name,
      email: user.email,
      image: imageUrl,
      age: user.age,
      degree: user.degree,
      experience: user.experience,
      specializations: user.specializations,
      bio: user.bio,
      location: user.location
    };

    // Only include password if it's not empty
    if (user.password.trim()) {
      data.password = user.password;
    }

    console.log("Sending Update Request:", data);
    console.log("Authorization Token:", token);

    try {
      const response = await customFetch("PUT", "user/me", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (response.authError) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        return;
      }

      if (response.message) {
        alert("Profile updated successfully!");
        getUser(); // Refresh user data after update
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("An error occurred while updating. Please try again.");
    }
  };

  // Upload file to Cloudinary
  const fileUpload = async (base64Image) => {
    const formData = new FormData();
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    formData.append("file", base64Image);
    formData.append("upload_preset", uploadPreset);
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      const response = await fetch(url, { method: "POST", body: formData });
      const photo = await response.json();
      return photo.url || null;
    } catch (error) {
      console.log("Error uploading image:", error);
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

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div className={styles.userimage}>
          <img src={croppedImage || user.image || persona} alt="User" />
          <input type="file" ref={inputFile} onChange={handleFileChange} className={styles.uploading} />
        </div>

        <div className={styles.namesinput}>
          <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} placeholder="Name" />
          <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Email" />
          <input type="number" value={user.age} onChange={(e) => setUser({ ...user, age: e.target.value })} placeholder="Age" />
          <input type="text" value={user.degree} onChange={(e) => setUser({ ...user, degree: e.target.value })} placeholder="Degree" />
          <input type="number" value={user.experience} onChange={(e) => setUser({ ...user, experience: e.target.value })} placeholder="Experience" />
          <input type="text" value={user.specializations} onChange={(e) => setUser({ ...user, specializations: e.target.value })} placeholder="Specializations" />
          <textarea value={user.bio} onChange={(e) => setUser({ ...user, bio: e.target.value })} placeholder="Short Bio" rows="4" />
          <input type="text" value={user.location} onChange={(e) => setUser({ ...user, location: e.target.value })} placeholder="Location" />
          <input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="New Password" />

          <button className={styles.submit} onClick={(e) => { e.preventDefault(); onSubmit(); }}>Save</button>
        </div>
      </form>
    </div>
  );
};

export default PtInfo;
