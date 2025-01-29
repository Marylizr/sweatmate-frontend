import React, { useState, useEffect } from 'react';
import styles from '../card/card.module.css';
import customFetch from '../../api';
import { useForm } from 'react-hook-form';

const Card = ({ item }) => {
  const [user, setUser] = useState(null);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await customFetch("GET", "user/me");
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user info:", error.message);
        alert("Failed to fetch user info. Please log in again.");
      }
    };

    fetchUser();
  }, []);

  const onSubmit = async () => {
    if (!user) {
      alert("User information is missing. Please log in again.");
      return;
    }

    const data = {
      name: user.name,
      id: user._id,
      workoutName: item.workoutName,
      description: item.description,
      picture: item.picture,
      video: item.video,
    };

    try {
      await customFetch("POST", "saveworkout", { body: data });
      alert('Workout selected successfully!');
    } catch (error) {
      console.error("Error saving workout:", error.message);
      alert("Failed to save the workout. Please try again.");
    }
  };

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSubmit();
      }}
    >
      <div className={styles.info}>
        <video controls src={item.video} alt="Workout" />
        <div className={styles.descrip}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <input type="hidden" value={user?.name || ''} {...register("name")} />
          </form>
          <p className={styles.bold}>WorkoutName:</p>
          <p>{item.workoutName}</p>
          <p className={styles.bold}>Description:</p>
          <p>{item.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;

//CARD THAT SHOWS THE WORKOUT INFO in every cathegory (arms, hamstring, chest, etc)