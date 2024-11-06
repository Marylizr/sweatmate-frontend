import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropImage';
import styles from './ImageCropper.module.css';

const ImageCropper = ({ onSave }) => {
   const [image, setImage] = useState(null); // Stores the uploaded image
   const [crop, setCrop] = useState({ x: 0, y: 0 });
   const [zoom, setZoom] = useState(1);
   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

   // Handle image upload
   const onFileChange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
         const reader = new FileReader();
         reader.readAsDataURL(e.target.files[0]);
         reader.onload = () => setImage(reader.result);
      }
   };

   // Store the cropped area details
   const onCropComplete = useCallback((_, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
   }, []);

   // Process and save the cropped image
   const onCropSave = useCallback(async () => {
      try {
         const croppedImage = await getCroppedImg(image, croppedAreaPixels);
         onSave(croppedImage); // Pass the cropped image back to the parent component
      } catch (error) {
         console.error(error);
      }
   }, [image, croppedAreaPixels, onSave]);

   return (
      <div className={styles.container}>
         {/* Image Upload */}
         <input type="file" accept="image/*" onChange={onFileChange} />

         {/* Cropper only appears if an image is uploaded */}
         {image && (
            <>
               <div className={styles.cropper}>
                  <Cropper
                     image={image}
                     crop={crop}
                     zoom={zoom}
                     aspect={1} // Square aspect ratio
                     onCropChange={setCrop}
                     onZoomChange={setZoom}
                     onCropComplete={onCropComplete}
                  />
               </div>
               {/* Controls */}
               <div className={styles.controls}>
                  <input
                     type="range"
                     value={zoom}
                     min={1}
                     max={3}
                     step={0.1}
                     onChange={(e) => setZoom(e.target.value)}
                     className={styles.zoomRange}
                  />
                  <button onClick={onCropSave} className={styles.saveButton}>Save</button>
               </div>
            </>
         )}
      </div>
   );
};

export default ImageCropper;
