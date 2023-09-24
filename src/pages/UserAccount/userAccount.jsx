import styles from "./settings.module.css";
import NavBar from "../../components/navBar/navBar"
import Settings from "../UserAccount/settings/Settings"
import FaseMenstrual from "../../components/faseMenstrual/FaseMentrual";
import { Link } from 'react-router-dom';
import MacroCalculator from "../../components/macroCalculator/MacroCalculator";
import WeekStorical from "../../components/trainingStorical/WeekStorical";




const AccountSetting = () => {

    return(
    <div className={styles.container}>
      <NavBar />
        <div className={styles.apps}>
          <Settings />
          <div className={styles.rearrange}>
            <FaseMenstrual />
            <WeekStorical />
            <MacroCalculator />
            <div className={styles.save}>
              <button><Link to="/savedworkouts"> my WorkOuts </Link> </button>
            </div>
            <div className={styles.progress}>
              <button><Link to="/progress"> my Progress </Link> </button>
            </div>
            
          </div>
        </div>

     
    </div>
    )
}

export default AccountSetting;

