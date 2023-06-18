import React from 'react';
import {Routes, Route} from "react-router-dom";
import PrivateRoute from "../../api/auth/privateRoute";
import AddWorkout from '../addWorkout/AddWorkout';
import Messages from '../messages/messages';
import Workouts from '../workOuts/Workouts';
import WorkoutsMenu from '../addWorkout/workoutsMenu';
import styles from '../main/main.module.css';
import Chat from '../chatGPT/ChatGPT';

const Main = () => {

  return (
    <div className={styles.container}>
      <WorkoutsMenu />
      <div className={styles.wrap}>
        <Routes>
          <Route path="/addworkout" element={<PrivateRoute><AddWorkout /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><Messages/></PrivateRoute>} />
          <Route path="/workouts" element={<PrivateRoute><Workouts/></PrivateRoute>} />
          <Route path="/openAi" element={<PrivateRoute><Chat /></PrivateRoute> } />
        </Routes>
      </div>
     

    </div>
  )
}

export default Main;