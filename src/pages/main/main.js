import React from 'react';
import {Routes, Route} from "react-router-dom";
import PrivateRoute from "../../api/auth/privateRoute";
import AddWorkout from '../addWorkout/AddWorkout';
import UserProfile from '../userProfile/UserProfile';
import EditWorkouts from '../editWorkOuts/EditWorkouts';
import WorkoutsMenu from '../dashboard/navBar/workoutsMenu';
import styles from '../main/main.module.css';
import Chat from '../chatGPT/ChatGPT';
import Training from '../training/Training';
import Dashboard from '../dashboard/Dashboard';
import Predesigned from '../dashboard/predesignWorkout/PreDegined';
import MealList from '../dashboard/mealPlans/MealList';




const Main = () => {

  return (
    <div className={styles.container}>
     
      <WorkoutsMenu />

      <div className={styles.wrap}>
        <div className={styles.header}>
          <h1> PT Dashboard</h1>
        </div>
        <Routes>
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/addworkout" element={<PrivateRoute><AddWorkout /></PrivateRoute>} />
          <Route path="/userList" element={<PrivateRoute><UserProfile/></PrivateRoute>} />
          <Route path="/workouts" element={<PrivateRoute><EditWorkouts/></PrivateRoute>} />
          <Route path="/openAi" element={<PrivateRoute><Chat /></PrivateRoute> } />
          <Route path="/training" element={<PrivateRoute><Training /></PrivateRoute> } />
          <Route path="/predesigned" element={<PrivateRoute><Predesigned/></PrivateRoute> } />
          <Route path="/mealplan" element={<PrivateRoute><MealList/></PrivateRoute> } />
        </Routes>
      </div>
     

    </div>
  )
}

export default Main;