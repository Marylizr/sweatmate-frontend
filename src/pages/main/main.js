import React from 'react';
import {Routes, Route} from "react-router-dom";
import PrivateRoute from "../../api/auth/privateRoute";
import AddWorkout from '../addWorkout/AddWorkout';
import UserProfile from '../userProfile/UserProfile';
import EditWorkouts from '../editWorkOuts/EditWorkouts';
import styles from '../main/main.module.css';
import Chat from '../chatGPT/ChatGPT';
import Training from '../training/Training';
import Dashboard from '../dashboard/Dashboard';
import AdminUserProfiles from '../Admin-userProfile/AdminUserProfile';
import Predesigned from '../dashboard/predesignWorkout/PreDegined';
import MealList from '../dashboard/mealPlans/MealList';
import PlanNextEvents from '../dashboard/nextEvents/PlanNextEvents';
import Form from '../dashboard/nextEvents/Form';
import EditUserProfile from '../Admin-userProfile/EditUserProfile';
import { Link } from 'react-router-dom';
import arrow_left from '../../utils/arrow_left.svg';
import NavBar from '../dashboard/navBar/NavBar';

const Main = () => {

  return (
    <div className={styles.container}>
     
      <NavBar />

      <div className={styles.wrap}>
        <div className={styles.header}>   
          <Link to='/main/dashboard'> <img src={arrow_left} alt='' /> <h1> Dashboard </h1></Link>
        </div>
        <Routes>
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/addworkout" element={<PrivateRoute><AddWorkout /></PrivateRoute>} />
          <Route path="/admin-userProfiles" element={<PrivateRoute><AdminUserProfiles /></PrivateRoute>} />
          <Route path="/userProfiles" element={<PrivateRoute><UserProfile/></PrivateRoute>} />
          <Route path="/workouts" element={<PrivateRoute><EditWorkouts/></PrivateRoute>} />
          <Route path="/openAi" element={<PrivateRoute><Chat /></PrivateRoute> } />
          <Route path="/training" element={<PrivateRoute><Training /></PrivateRoute> } />
          <Route path="/predesigned" element={<PrivateRoute><Predesigned/></PrivateRoute> } />
          <Route path="/mealplan" element={<PrivateRoute><MealList/></PrivateRoute> } />
          <Route path="/plannextevents" element={<PrivateRoute><PlanNextEvents/></PrivateRoute> } />
          <Route path="/reschedule/:eventId" element={<Form />} />
          <Route path="/edituserprofile/:id" element={<EditUserProfile />} />
        </Routes>

      </div>
     

    </div>
  )
}

export default Main;