import { React } from 'globalthis/implementation';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './home/Home';
import Workouts from './pages/workouts/Workouts';
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


function App() {
  return (
    <div className='App'> 
      <BrowserRouter >
        <Routes> 
          <Route path="/" element={ <Home />} />
          <Route path="/workouts" element={ <Workouts />} />
          <Route path="/arms" element={ <Arms />} />
          <Route path="/back" element={ <Back />} />
          <Route path="/chest" element={ <Chest />} />
          <Route path="/glutes" element={ <Glutes />} />
          <Route path="/hamstring" element={ <Hamstrings />} />
          <Route path="/quadriceps" element={ <Quadriceps />} />
          <Route path="/abs" element={ <Abs />} />
          <Route path="/shoulders" element={ <Shoulders />} />
          <Route path="/fullbody" element={ <Fullbody />} />
          <Route path="/signup" element={ <SignUp />} />
          <Route path="/login" element={ <LogIn />} />

        </Routes>
      </BrowserRouter>

    </div>


  );
}

export default App;
