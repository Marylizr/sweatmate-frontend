import React, { useState, useRef } from "react";
import Cropper from "react-easy-crop";
import styles from "../card/card.module.css";
import Modal from "../Modal/Modal";

const Card = ({ item, onEdit, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false); // Toggle state for show more/less
  const [isOpenModal, setIsOpenModal] = useState(false); // Modal open/close state
  const [isCropModalOpen, setIsCropModalOpen] = useState(false); // Crop modal state
  const [editedContent, setEditedContent] = useState(item.content); // For storing edited content
  const [editedPicture, setEditedPicture] = useState(item.picture); // For storing edited picture
  const [editedLevel, setEditedLevel] = useState(item.subCategory); // For storing edited level
  const [isSelected, setIsSelected] = useState(false); // Card selection state
  const [imageToCrop, setImageToCrop] = useState(null); // Image to be cropped
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // Crop position
  const [zoom, setZoom] = useState(1); // Zoom level
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // Cropped area
  const inputFile = useRef(null); // File input reference

  // Toggle expanded content
  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  // Open modal for editing
  const handleEdit = () => {
    setIsOpenModal(true);
  };

  // Save changes
  const handleSave = async () => {
    setIsOpenModal(false);

    // Upload picture if a new file is selected
    const uploadedPicture = await fileUpload();

    // Update all changes in the backend
    const updatedData = {
      content: editedContent,
      picture: uploadedPicture || editedPicture, // Use uploaded picture if available
      subCategory: editedLevel,
    };

    onEdit(item._id, updatedData); // Pass updated content to the parent
    alert('Meal Plan edited sucessfully')
  };

  // Cancel editing
  const handleCancel = () => {
    setIsOpenModal(false);
    setEditedContent(item.content); // Revert to original content
    setEditedPicture(item.picture); // Revert to original picture
    setEditedLevel(item.subCategory); // Revert to original level
  };

  // Handle card selection
  const handleSelection = () => {
    setIsSelected((prev) => !prev);
    onSelect(item._id, !isSelected); // Pass selection state to the parent
  };

  // Handle file input and open cropper
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageToCrop(imageUrl);
      setIsCropModalOpen(true);
    }
  };

  // Crop image
  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setEditedPicture(croppedImage); // Save the cropped image for preview and upload
      setIsCropModalOpen(false); // Close the cropper
    } catch (e) {
      console.error("Error cropping the image:", e);
    }
  };

  // Helper function to crop the image
  const getCroppedImg = (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

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
            resolve(URL.createObjectURL(blob));
          } else {
            reject(new Error("Canvas is empty or unsupported format"));
          }
        }, "image/jpeg");
      };
      image.onerror = (error) => reject(error);
    });
  };

  // File upload function for Cloudinary
  const fileUpload = async () => {
    const files = inputFile.current.files;
    if (!files || files.length === 0) return null;

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "h9rhkl6h");

    const url = `https://api.cloudinary.com/v1_1/da6il8qmv/image/upload`;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.url || null;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  return (
    <div className={`${styles.container} ${isSelected ? styles.selected : ""}`}>
      {/* Selection Checkbox */}
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelection}
        />
      </div>

      {/* Image */}
      <div>
        <img src={editedPicture || "https://via.placeholder.com/150"} alt="meal-plan" />
      </div>

      {/* Meal Plan Info */}
      <div className={styles.details}>
        <p>{item.subCategory}</p>
        <p className={styles.content}>
          {isExpanded ? item.content : item.content.split("\n").slice(0, 3).join("\n")}
        </p>
        {item.content.split("\n").length > 3 && (
          <button onClick={handleToggle} className={styles.toggleButton}>
            {isExpanded ? "Close" : "Show More"}
          </button>
        )}
      </div>

      {/* Edit Button */}
      <div className={styles.buttons}>
        <button onClick={handleEdit} className={styles.editButton}>
          Edit
        </button>
      </div>

      {/* Modal for Editing */}
      <Modal isOpen={isOpenModal} closeModal={handleCancel}>
        <div className={styles.modalContent}>
          <h3>Edit Meal Plan</h3>

          {/* Picture Input */}
          <div>
            <div className={styles.editImg}>
              <img src={editedPicture} alt="meal" />
            </div>
            <input
              type="file"
              ref={inputFile}
              onChange={handleFileChange}
              className={styles.fileInput}
            />
          </div>

          {/* Meal Plan Type Dropdown */}
          <div>
            <label>Meal Plan Type:</label>
            <select
              value={editedLevel}
              onChange={(e) => setEditedLevel(e.target.value)}
            >
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="low-carb">Low-Carb</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="paleo">Paleo</option>
              <option value="gluten-free">Gluten-Free</option>
            </select>
          </div>

          {/* Content Text Area */}
          <div className={styles.editText}>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          </div>

          {/* Modal Buttons */}
          <div className={styles.modalButtons}>
            <button onClick={handleSave} className={styles.saveButton}>
              Save
            </button>
            <button onClick={handleCancel} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Cropper Modal */}
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
              onCropComplete={(croppedArea, croppedAreaPixels) =>
                setCroppedAreaPixels(croppedAreaPixels)
              }
            />
            <button
              onClick={showCroppedImage}
              className={styles.saveCropButton}
            >
              Crop & Save Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
