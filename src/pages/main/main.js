import React from 'react';
import {Routes, Route} from "react-router-dom";
import PrivateRoute from "../../api/auth/privateRoute";
import AddWorkout from '../addWorkout/AddWorkout';
import Messages from '../messages/messages';
import Workouts from '../workOuts/Workouts';

const Main = () => {
  return (
    <div>

     <h2>welcpme to admin dashboard</h2>
      <Routes>
         <Route path="/addworkout" element={<PrivateRoute><AddWorkout /></PrivateRoute>} />
         <Route path="/messages" element={<PrivateRoute><Messages/></PrivateRoute>} />
         <Route path="/workouts" element={<PrivateRoute><Workouts/></PrivateRoute>} />
      </Routes>

    </div>
  )
}

export default Main;