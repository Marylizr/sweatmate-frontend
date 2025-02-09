import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContextProvider } from './components/userContext/userContext.jsx';
import Home from './pages/home/Home.js';
import AllWorkoutsList from './pages/allWorkouts/AllWorkoutsList.jsx';
import Arms from './pages/arms/Arms.js';
import Back from './pages/back/Back.js';
import Chest from './pages/chest/Chest.js';
import Glutes from './pages/glutes/Glutes.js';
import Hamstrings from './pages/hamstrings/Hamstrings.js';
import Quadriceps from './pages/quadriceps/quadriceps.js';
import Abs from './pages/abs/Abs.js';
import Shoulders from './pages/shoulders/Shoulders.js';
import Fullbody from './pages/fullbody/Fullbody.js';
import SignUp from './pages/signUp/SignUp.jsx';
import AddWorkout from './pages/addWorkout/AddWorkout.jsx';
import UserDashboardFemale from './pages/UserDashboard/userDashboardFemale.jsx';
import UserDashboardMale from './pages/UserDashboard/userDashboardMale.jsx';
import { AboutUs } from './pages/aboutUS/AboutUs.jsx';
import HealthyTips from './pages/healthy/HealthyTips.jsx';
import ContactForm from './pages/contact/Contact.jsx';
import UserProfile from './pages/userProfile/UserProfile.jsx';
import EditWorkouts from './pages/editWorkOuts/EditWorkouts.jsx';
import WorkoutDash from './pages/workoutsDash/WorkoutDash.jsx';
import Main from './pages/main/main.js';
import FollowUp from './components/followUp/FollowUp.jsx';
import TodayWorkout from './pages/workoutHistoric/WorkoutHistoric.jsx';
import DesignedByPt from './pages/designedByPt/DesignedByPt.jsx';
import Predesigned from './pages/dashboard/predesignWorkout/PredesignWorkout.jsx';
import Products from './pages/dashboard/products/Products.jsx';
import MealList from './pages/dashboard/mealPlans/MealList.jsx';
import MealPlanner from './pages/mealPlanner/MealPlanner.jsx';
import PlanNextEvents from './pages/dashboard/nextEvents/PlanNextEvents.jsx';
import Form from './pages/dashboard/nextEvents/Form.jsx';
import EditUserProfile from './pages/Admin-userProfile/EditUserProfile.jsx';
import MedicalHistory from './pages/Admin-userProfile/MedicalHistory.jsx';
import UserGoal from './pages/userGoals/UserGoal.jsx';
import VerifyEmail from './components/VerifyEmail.jsx'
import RedirectPlaceholder from './components/RedirectPlaceholder.jsx';
import NotFound from './components/NotFound.jsx';
import MenstrualCycle from './components/faseMenstrual/menstrualCycle.jsx';
import Cookies from './components/cookiesPreferences/Cookies.jsx';
import Terms from './components/cookiesPreferences/Termns.jsx';
import PrivacyPolicy from './components/cookiesPreferences/PrivacyPolicy.jsx';
import AcceptableUse from './components/cookiesPreferences/AcceptableUse.jsx';
import ResetPassword from './pages/login/ResetPassword.jsx';
import ForgotPassword from './pages/login/ForgotPassword.jsx';
import Login from './pages/login/Login.jsx';



function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/cookiePreferences" element={<Cookies />} />
            <Route path="/" element={<Home />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/healthyTips" element={<HealthyTips />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/allworkouts" element={<AllWorkoutsList />} />
            <Route path="/arms" element={<Arms />} />
            <Route path="/back" element={<Back />} />
            <Route path="/chest" element={<Chest />} />
            <Route path="/glutes" element={<Glutes />} />
            <Route path="/hamstrings" element={<Hamstrings />} />
            <Route path="/quadriceps" element={<Quadriceps />} />
            <Route path="/abs" element={<Abs />} />
            <Route path="/shoulders" element={<Shoulders />} />
            <Route path="/fullbody" element={<Fullbody />} />
            <Route path="/signup" element={<SignUp />} />
          <Route path="login" element={<Login />}/>
            <Route path="/addworkout" element={<AddWorkout />} />
            <Route path="/messages" element={<UserProfile />} />
            <Route path="/workouts" element={<EditWorkouts />} />
            <Route path="/workoutsDashboard" element={<WorkoutDash />} />
            <Route path="/main/*" element={<Main />} />
            <Route path="/dashboard/male" element={<UserDashboardMale />} />
            <Route path="/dashboard/female" element={<UserDashboardFemale />} />
            <Route path="/progress" element={<FollowUp />} />
            <Route path="/todayworkout" element={<TodayWorkout />} />
            <Route path="/personaltrainer" element={<DesignedByPt />} />
            <Route path="/preworkout" element={<Predesigned />} />
            <Route path="/mealplan" element={<MealList />} />
            <Route path="/products" element={<Products />} />
            <Route path="/mealPlanner" element={<MealPlanner />} />
            <Route path="/plannextevents" element={<PlanNextEvents />} />
            <Route path="/reschedule/:eventId" element={<Form />} />
            <Route path="/edituserprofile/:id" element={<EditUserProfile />} />
            <Route path="/:id/medical-history" element={<MedicalHistory />} />
            <Route path="/mygoals" element={<UserGoal />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/oauth2callback" element={<RedirectPlaceholder />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/menstrualCycle" element={<MenstrualCycle />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/acceptable-use" element={<AcceptableUse />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />



          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </div>
  );
}

export default App;
