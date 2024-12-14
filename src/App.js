import { React } from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './pages/home/Home';
import AllWorkoutsList from './pages/allWorkouts/AllWorkoutsList';
import Arms from './pages/arms/Arms';
import Back from './pages/back/Back';
import Chest from './pages/chest/Chest';
import Glutes from './pages/glutes/Glutes';
import Hamstrings from './pages/hamstrings/Hamstrings';
import Quadriceps from './pages/quadriceps/quadriceps';
import Abs from './pages/abs/Abs';
import Shoulders from './pages/shoulders/Shoulders';
import Fullbody from './pages/fullbody/Fullbody';
import SignUp from './pages/signUp/SignUp';
import Login from './pages/login/Login';
import AddWorkout from './pages/addWorkout/AddWorkout';
import UserDashboardFemale from './pages/UserDashboard/userDashboardFemale';
import UserDashboardMale from './pages/UserDashboard/userDashboardMale';
import { UserContextProvider } from './components/userContext/userContext';
import { AboutUs } from './pages/aboutUS/AboutUs';
import HealthyTips from './pages/healthy/HealthyTips';
import ContactForm from './pages/contact/Contact';
import UserProfile from './pages/userProfile/UserProfile';
import EditWorkouts from './pages/editWorkOuts/EditWorkouts';
import WorkoutDash from './pages/workoutsDash/WorkoutDash';
import Main from './pages/main/main';
import FollowUp from './components/followUp/FollowUp';
import TodayWorkout from './pages/workoutHistoric/WorkoutHistoric';
import DesignedByPt from './pages/designedByPt/DesignedByPt';
import Predesigned from './pages/dashboard/predesignWorkout/PredesignWorkout';
import Products from './pages/dashboard/products/Products';
import MealList from './pages/dashboard/mealPlans/MealList';
import MealPlanner from './pages/mealPlanner/MealPlanner';
import PlanNextEvents from './pages/dashboard/nextEvents/PlanNextEvents';
import Form from './pages/dashboard/nextEvents/Form';


// import PrivateRoute from "./api/auth/privateRoute";

function App() {


  return (
    <div className='App'> 
   
   
    <UserContextProvider>
      <BrowserRouter >
        <Routes> 
          <Route path="/" element={ <Home />} />
          <Route path="/aboutUs" element={ <AboutUs /> } />
          <Route path="healthyTips" element={ <HealthyTips />} />
          <Route path="contact" element={ <ContactForm />} />
          <Route path="/allworkouts" element={ <AllWorkoutsList />} />
          <Route path="/arms" element={ <Arms />} />
          <Route path="/back" element={ <Back />} />
          <Route path="/chest" element={ <Chest />} />
          <Route path="/glutes" element={ <Glutes />} />
          <Route path="/hamstrings" element={ <Hamstrings />} />
          <Route path="/quadriceps" element={ <Quadriceps />} />
          <Route path="/abs" element={ <Abs />} />
          <Route path="/shoulders" element={ <Shoulders />} />
          <Route path="/fullbody" element={ <Fullbody />} />
          <Route path="/signup" element={ <SignUp />} />
          <Route path="/login"  element={ <Login/> }/>
          <Route path="/addworkout" element={ <AddWorkout />} />
          <Route path="/dashboard/male" element={ <UserDashboardMale />} />
          <Route path="/dashboard/female" element={ <UserDashboardFemale />} />
          <Route path="/messages" element={ <UserProfile />} />
          <Route path="/workouts" element={ <EditWorkouts />} />
          <Route path="/workoutsDashboard" element={ <WorkoutDash />} />
          <Route path="/main/*" element={<Main />} />
          <Route path="/progress" element={<FollowUp/>} />
          <Route path='/todayworkout' element={<TodayWorkout />} />
          <Route path='/personaltrainer' element={<DesignedByPt />} />
          <Route path='/preworkout' element={<Predesigned />} />
          <Route path='/mealplan' element={<MealList />} />
          <Route path='/products' element={<Products/>} />
          <Route path='/mealPlanner' element={<MealPlanner/>} />
          <Route path="/plannextevents" element={<PlanNextEvents/> } />
          <Route path="/reschedule/:eventId" element={<Form />} />

        </Routes>
      </BrowserRouter>
    </UserContextProvider>

    </div>


  );
}

export default App;