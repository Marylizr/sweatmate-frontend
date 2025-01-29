import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../components/userContext/userContext";
import { removeSession } from "../../api/auth";
import logo from "../../utils/logo_new.png";
import styles from "./navbar.module.css";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { gender, role } = useContext(UserContext);
  const navigate = useNavigate();

  const onLogOut = () => {
    removeSession();
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navContainer}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
        </div>
        <div className={`${styles.links} ${menuOpen ? styles.active : ""}`}>
          <NavLink
            to={gender === "female" ? "/dashboard/female" : "/dashboard/female"}
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
            to="/healthyTips"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.activeLink : ""}`
            }
          >
            Health
          </NavLink>
          <NavLink
            to="/workoutsDashboard"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.activeLink : ""}`
            }
          >
            My Profile
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.activeLink : ""}`
            }
          >
            Contact
          </NavLink>
          {role === "admin" && (
            <NavLink
              to="/main/dashboard"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.activeLink : ""}`
              }
            >
              Admin
            </NavLink>
          )}
          <button className={styles.logoutButton} onClick={onLogOut}>
            Log out
          </button>
        </div>
        <div className={styles.burger} onClick={toggleMenu}>
          <div className={`${styles.bar} ${menuOpen ? styles.open : ""}`} />
          <div className={`${styles.bar} ${menuOpen ? styles.open : ""}`} />
          <div className={`${styles.bar} ${menuOpen ? styles.open : ""}`} />
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
