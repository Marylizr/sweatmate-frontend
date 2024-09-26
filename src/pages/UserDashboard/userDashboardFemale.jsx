import React, {useState, useEffect} from "react";
import styles from "./settings.module.css";
import NavBar from "../../components/navBar/navBar"
import Settings from "./settings/Settings"
import FaseMenstrual from "../../components/faseMenstrual/FaseMentrual";
import { Link } from 'react-router-dom';
import MacroCalculator from "../../components/macroCalculator/MacroCalculator";
import WeekStorical from "../../components/trainingStorical/WeekStorical";
import customFetch from '../../api';
import insight from '../../assets/insight.svg';
import sports from '../../assets/sports.svg';
import sports1 from '../../assets/sports1.svg';


const UserDashboardFemale = () => {

  const [name, setName ] = useState();
   
  useEffect(() => {

    customFetch( "GET", "user/me")
      .then((json) => {
        setName(json.name);
      })
      .catch((e) => {
       console.log(e)
      });
    }, [setName]);

    
    return(
    <div className={styles.container}>
      <NavBar />
      <div><h2>Welcome to your Dashboard {name}!</h2></div>
        <div className={styles.apps}>
         {/* Settings is the box to edit the user data */}
            <Settings />
            <div className={styles.rearrange}>
               {/* rest of the small blocks */}
            <FaseMenstrual />
            <WeekStorical />
            <MacroCalculator />
            <div className={styles.save}>
               <button><Link to="/allworkouts"> <img src={sports1} alt='icon'/>Customize Workout </Link> </button>
               </div>
               <div className={styles.save}>
               <button><Link to="/workoutsDashboard"> <img src={sports} alt='icon'/> my WorkOuts </Link> </button>
               </div>
               <div className={styles.save}>
               <button><Link to="/"> <img src={insight} alt='icon'/> find a SweatMate </Link> </button>
               </div>
               <div className={styles.save}>
               <button><Link to="/"> <img src={insight} alt='icon'/> my Progress </Link> </button>
               </div>
               <div className={styles.save}>
               <button><Link to="/personaltrainer"> <img src={insight} alt='icon'/> From PT </Link> </button>
               </div>
            
          </div>
        </div>

     
    </div>
    )
}

export default UserDashboardFemale;

