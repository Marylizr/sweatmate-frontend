import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './userProfile.module.css';
import customFetch from '../../api';
import Form from './Form';
import SessionsNotes from './SessionsNotes';
import UserPreferences from './UserPreferences';
import MedicalHistory from './MedicalHistory';
import BeforeAndAfter from './BeforeAndAfter';
import GoalForm from './GoalForm';
import MilestoneNotifications from './MilestoneNotifications';
import GoalProgressChart from './GoalProgressChart';



const EditUserProfile = () => {

    const { id } = useParams(); // Get the user ID from the URL
    const navigate = useNavigate();
    const [goals, setGoals] = useState([]);
    const [trainers, setTrainers] = useState([])
    
    const fetchUserGoals = async () => {
      if (!id) {
        console.error("User ID is missing in the URL");
        return [];
      }
      try {
        const response = await customFetch('GET', `goals/${id}`);
        return response;
      } catch (error) {
        console.error('Error fetching user goals:', error);
        return []; // Return an empty array to avoid breaking the UI
      }
    };
  
  
      useEffect(() => {
        const loadGoals = async () => {
          if (!id) {
            console.error("User ID is missing in the URL");
            return;
          }
          try {
            const data = await fetchUserGoals();
            setGoals(data);
          } catch (error) {
            console.error("Error loading user goals:", error);
          }
        };
        loadGoals();
      }, [id]);
  
  
      const handleSaveGoal = async (goal) => {

        
        try {
          console.log('Saving goal:', goal); // Debugging line
      
          const response = await customFetch('POST', 'goals', { body: goal });
      
          if (response && response.goal) {
            setGoals((prevGoals) => [...prevGoals, response.goal]);
            alert('Goal saved successfully!');
          } else {
            throw new Error('Failed to save the goal.');
          }
        } catch (error) {
          console.error('Error saving goal:', error);
          alert('An error occurred while saving the goal. Please try again.');
        }
      };
      
    
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
  

  useEffect(() => {
    if (!id) {
      console.error("User ID is missing in the URL");
      return;
    }
    console.log("Fetching user with ID:", id);
    const fetchUser = async () => {
      try {
        const data = await customFetch('GET', `user/${id}`);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return <p>Loading...</p>;
  }

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

  return (
    <div className={styles.container}>
      <h2>Edit {user.name}'s Profile</h2>

        <div className={styles.editWrapper}>

          <Form selectedItem={user} trainers={trainers} onUpdate={() => navigate('main/admin-userProfiles')} />
          <div>
            <SessionsNotes userId={user._id} initialNotes={user.session_notes} />
            <UserPreferences userId={user._id} initialPreferences={user.preferences} />
            <MedicalHistory userId={user._id} initialMedicalHistory={user.medical_history}/>
          </div>
        </div>

          <div>
            <BeforeAndAfter userId={user._id} initialWeight={user.weight} />
          </div>

          <div>
            <GoalForm id={user._id} onSave={handleSaveGoal} />
            <MilestoneNotifications goals={goals} />
            <GoalProgressChart goals={goals} />
          </div>

    </div>
  );
};

export default EditUserProfile;
