import React, { useEffect, useState } from 'react';
import customFetch from '../../api';
import styles from './userProfile.module.css';

const ProgressPictures = ({ userId }) => {
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await customFetch('GET', `progress/${userId}`);
        setPictures(response);
      } catch (error) {
        console.error('Error fetching progress pictures:', error);
      }
    };

    fetchProgress();
  }, [userId]);

  return (
    <div className={styles.progressPictures}>
      <h3>Before & After Pictures</h3>
      {pictures.length > 0 ? (
        pictures.map((pic) => (
          <img key={pic._id} src={pic.picture} alt="Progress" className={styles.picture} />
        ))
      ) : (
        <p>No progress pictures available</p>
      )}
    </div>
  );
};

export default ProgressPictures;
