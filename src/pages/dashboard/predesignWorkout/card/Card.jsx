import React, { useState, useRef } from "react";
import styles from "../card/card.module.css";
import Modal from "../Modal/Modal";

const Card = ({ item, onEdit, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false); // Toggle state for show more/less
  const [isOpenModal, setIsOpenModal] = useState(false); // Modal open/close state
  const [editedContent, setEditedContent] = useState(item.content); // For storing edited content
  const [editedPicture, setEditedPicture] = useState(item.picture); // For storing edited picture
  const [editedLevel, setEditedLevel] = useState(item.subCategory); // For storing edited level
  const [isSelected, setIsSelected] = useState(false); // Card selection state
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

  // Split content into lines for preview
  const contentLines = item.content.split("\n");
  const previewText = contentLines.slice(0, 3).join("\n"); // First 3 lines

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
        <img src={item.picture || "https://via.placeholder.com/150"} alt="training" />
      </div>

      {/* Workout Info */}
      <div className={styles.details}>
       
        <p className={styles.content}>
          {isExpanded ? item.content : previewText}
        </p>
        {contentLines.length > 3 && (
          <button onClick={handleToggle} className={styles.toggleButton}>
            {isExpanded ? "Close" : "Show More"}
          </button>
        )}
        <button onClick={handleEdit} className={styles.editButton}>
          Edit
        </button>
      </div>

      {/* Edit Button */}
      <div className={styles.buttons}>
      </div>

      {/* Modal for Editing */}
      <Modal isOpen={isOpenModal} closeModal={handleCancel}>
        <div className={styles.modalContent}>
          <h3>Edit Workout</h3>

          {/* Picture Input */}
          <div>
            <div  className={styles.editImg}>
              <img src={editedPicture} alt='item' />
            </div>
            <input
              type="file"
              ref={inputFile}
              className={styles.fileInput}
            />
          </div>

          {/* Level Dropdown */}
          <div>
            <label>Level:</label>
            <select
              value={editedLevel}
              onChange={(e) => setEditedLevel(e.target.value)}
            >
              <option value="basic">Basic</option>
              <option value="medium">Medium</option>
              <option value="advanced">Advanced</option>
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
    </div>
  );
};

export default Card;
