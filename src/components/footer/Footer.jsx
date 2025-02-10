import React, { useState, useEffect } from "react";
import logo from "../../utils/logo_new.png";
import { NavLink } from "react-router-dom";
import customFetch from "../../api";
import styles from '../footer/footer.module.css';

const Footer = () => {
  const [gender, setGender] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const json = await customFetch("GET", "user/me");
        setGender(json.gender);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    loadUserData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <img src={logo} alt="logo-sweatMate" />
        
        <NavLink
          to={gender === "female" ? "/dashboard/female" : "/dashboard/male"}
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.activeLink : ""}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/aboutUs"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.activeLink : ""}`
          }
        >
          About Us
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.activeLink : ""}`
          }
        >
          Contact
        </NavLink>
      </div>

      <div className={styles.disclaimer}>
        <p>© {new Date().getFullYear()} PixelTrend Studio LLC. All Rights Reserved.</p>
        <p>30 N Gould St, Suite N, Sheridan, WY 82801</p>
        <p>
          This site is for informational purposes only and does not constitute professional advice. PixelTrend Studio LLC is not responsible for any misuse of the information provided.
        </p>
        <p>
          By using this site, you agree to our 
          <NavLink to="/terms" className={styles.policyLink}> Terms of Service</NavLink> and 
          <NavLink to="/privacy" className={styles.policyLink}> Privacy Policy</NavLink>.
        </p>
      </div>
    </div>
  );
};

export default Footer;
