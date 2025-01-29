import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './userProfile.module.css';
import customFetch from '../../api';
import Form from './Form';
import SessionsNotes from './SessionsNotes';
import UserPreferences from './UserPreferences';
import MedicalHistory from './MedicalHistory';
import BeforeAndAfter from './BeforeAndAfter';

const EditUserProfile = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
    fitness_level: "",
    medical_history: [],
    preferences: [],
    session_notes: [],
  });

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        console.error("User ID is missing in the URL");
        return;
      }

      try {
        console.log("Fetching user with ID:", id);
        const data = await customFetch('GET', `user/${id}`);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [id]);

  // Fetch trainers list (only users with role "personal-trainer")
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await customFetch("GET", "user/trainers");
        console.log("Trainer list response:", response);

        if (Array.isArray(response)) {
          setTrainers(response);
        } else if (response && typeof response === "object") {
          setTrainers([response]); // Wrap single object in an array as a fallback
        } else {
          console.error("Unexpected data format for trainers:", response);
        }
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    fetchTrainers();
  }, []);

  if (!user.name) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <h2>Edit {user.name}'s Profile</h2>

      <div className={styles.editWrapper}>
        <Form selectedItem={user} trainers={trainers} onUpdate={() => navigate('main/admin-userProfiles')} />
        <div>
          <SessionsNotes userId={user._id} initialNotes={user.session_notes} />
          <UserPreferences userId={user._id} initialPreferences={user.preferences} />
          <MedicalHistory userId={user._id} initialMedicalHistory={user.medical_history} />
        </div>
      </div>

      <div>
        <BeforeAndAfter userId={user._id} initialWeight={user.weight} />
      </div>
    </div>
  );
};

export default EditUserProfile;
