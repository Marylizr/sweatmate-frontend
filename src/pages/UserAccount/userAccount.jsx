import styles from "./settings.module.css";
import NavBar from "../../components/navBar/navBar"
import Settings from "../UserAccount/settings/Settings"
import FaseMenstrual from "../../components/faseMenstrual/FaseMentrual";
import WeekStorical from "../../components/trainingStorical/WeekStorical";
import { Link } from 'react-router-dom';




const AccountSetting = ({historial}) => {

    return(
    <div className={styles.container}>
      <NavBar />
        <div className={styles.apps}>
          <Settings />
          <div className={styles.rearrange}>
            <FaseMenstrual />
            <WeekStorical historial={historial} />
            <div className={styles.save}>
            <button className={styles.save}><Link to="/savedworkouts"> my WorkOuts </Link> </button>
            </div>
            <div className={styles.save}>
            <button className={styles.save}><Link to="/progress"> my Progress </Link> </button>
            </div>
            
          </div>
        </div>

     
    </div>
    )
}

export default AccountSetting;

