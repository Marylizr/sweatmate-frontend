import { React } from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './home/Home';
import Dashboard from './pages/dashboard/Dashboard';
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
import LogIn from './pages/logIn/LogIn';
import AddWorkout from './pages/addWorkout/AddWorkout';
import AccountSetting from './pages/UserAccount/userAccount';
import { UserContextProvider } from './components/userContext/userContext';
import { AboutUs } from './pages/aboutUS/AboutUs';
import HealthyTips from './pages/healthy/HealthyTips';
import ContactForm from './pages/contact/Contact';
import Messages from './pages/messages/messages';
import Workouts from './pages/workOuts/Workouts';
import SavedWorkouts from './pages/fav/fav';


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
          <Route path="/dashboard" element={ <Dashboard />} />
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
          <Route path="/login" element={ <LogIn />} />
          <Route path="/addworkout" element={ <AddWorkout />} />
          <Route path="/settings" element={ <AccountSetting />} />
          <Route path="/messages" element={ <Messages />} />
          <Route path="/workouts" element={ <Workouts />} />
          <Route path="/savedWorkouts" element={ <SavedWorkouts />} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
    </div>


  );
}

export default App;