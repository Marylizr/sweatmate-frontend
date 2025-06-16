import React, { useEffect, useState } from 'react';
import styles from '../training/training.module.css';
import CardDeleteFavs from '../../components/card/CardDeleteFavs';
import customFetch from '../../api';
import { useForm } from 'react-hook-form';


//THIS COMPONENT IS FOR THE PT DESIGN A PERSONALIZED TRAINING PROGRAM
const Training = ({ onClick }) => {
   const [selectedWorkouts, setSelectedWorkouts] = useState([]); // Track multiple selected workouts
   const [users, setUsers] = useState([]);
   const [data, setData] = useState([]);
   const [filteredData, setFilteredData] = useState([]); // New state to store filtered workouts
   const [searchValue, setSearchValue] = useState('');
   const [email, setEmail] = useState(''); // User email to assign session
   const [showWorkouts, setShowWorkouts] = useState(true); // Control visibility of workout cards
   const { handleSubmit, reset } = useForm();

   // Fetch users on mount
   useEffect(() => {
      customFetch("GET", "user")
         .then((json) => setUsers(json))
         .catch((error) => console.log("Error fetching users:", error));
   }, []);

   // Fetch available workouts on mount
   useEffect(() => {
      customFetch("GET", "workouts")
         .then((json) => {
            setData(json); // Set full workout data
            setFilteredData(json); // Initialize filteredData with full data
         })
         .catch((error) => console.log("Error fetching workouts:", error));
   }, []);

   // Filter workouts based on search input
   useEffect(() => {
      if (!searchValue) {
         setFilteredData(data); // Reset to full data if no search query
      } else {
         const filtered = data.filter(({ type }) =>
            type.toLowerCase().includes(searchValue.toLowerCase())
         );
         setFilteredData(filtered);
      }
   }, [searchValue, data]); // Include both `searchValue` and `data` in the dependency array

   // Function to handle form submission and save all selected workouts as a session
   const onSubmit = () => {
      if (!email || selectedWorkouts.length === 0) {
         alert("Please select both a user and at least one workout before saving.");
         return;
      }
   
      // Format each workout in the selectedWorkouts array individually with the user data
      selectedWorkouts.forEach(workout => {
         const workoutData = {
            userName: email,
            date: new Date().toISOString().split('T')[0], // Today's date
            type: workout.type,
            name: workout.name,
            description: workout.description,
            picture: workout.picture,
            video: workout.video,
         };
   
         customFetch("POST", "personaltrainer", { body: workoutData })
            .catch((error) => console.error("Error saving workout:", error));
      });
   
      alert("Training session saved successfully!");
      reset(); // Reset the form
      setSelectedWorkouts([]); // Clear selected workouts
   };

   // Function to handle adding/removing workouts in the selection
   const toggleWorkoutSelection = (workout) => {
      if (selectedWorkouts.some(selected => selected._id === workout._id)) {
         // If already selected, remove it
         setSelectedWorkouts(selectedWorkouts.filter(selected => selected._id !== workout._id));
      } else {
         // Otherwise, add it to the selection
         setSelectedWorkouts([...selectedWorkouts, workout]);
      }
   };

   // Toggle visibility of the workout selection area
   const toggleShowWorkouts = () => {
      setShowWorkouts(!showWorkouts);
   };

   return (
      <div className={styles.container}>
         <h2>Design a Training Program</h2>

         <div className={styles.wrapper}>
            <form onSubmit={handleSubmit(onSubmit)}>
               {/* User selection dropdown */}
               <div className={styles.userSelection}>
                  <select
                     className={styles.search}
                     id="user-select"
                     value={email}
                     onChange={(e) => {
                        setEmail(e.target.value);
                        console.log("User selected:", e.target.value); // Debugging: Log selected email
                     }}
                  >
                     <option value="">Select a user</option>
                     {users.map(user => (
                        <option key={user._id} value={user.email}>
                           {user.email}
                        </option>
                     ))}
                  </select>

                  {/* Workout search input */}
                  <div className={styles.search}>
                     <input
                        type="text"
                        placeholder="Search Workout"
                        onChange={(e) => setSearchValue(e.target.value)}
                     />
                  </div>

                  {/* Toggle workout display */}
                  <button
                     type="button"
                     onClick={toggleShowWorkouts}
                     className={styles.toggleButton}
                  >
                     {showWorkouts ? "Hide Workouts" : "Show Workouts"}
                  </button>

                  {/* Indicate selected workouts */}
                  {selectedWorkouts.length > 0 && (
                     <div className={styles.selectedWorkouts}>
                        <h4>Selected Workouts:</h4>
                        <ul>
                           {selectedWorkouts.map(workout => (
                              <li key={workout._id}>{workout.name}</li>
                           ))}
                        </ul>
                     </div>
                  )}
               </div>

               {/* Workout selection area */}
               {showWorkouts && (
                  <div className={styles.wrap}>
                     {filteredData && filteredData.length > 0 && filteredData.map(item => (
                        <div 
                           key={item._id}
                           onClick={() => toggleWorkoutSelection(item)}
                           className={`${styles.card} ${selectedWorkouts.some(selected => selected._id === item._id) ? styles.selected : ''}`}
                        >
                           <CardDeleteFavs
                              item={item}
                              id={item._id}
                              onClick={onClick}
                           />
                        </div>
                     ))}
                  </div>
               )}

               {/* Save button */}
               <button
                  type="submit"
                  className={styles.submit}
               >
                  Save Training 
               </button>
            </form>
         </div>
      </div>
   );
};

export default Training;
