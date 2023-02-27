import React from 'react';
import {useContext, useEffect } from 'react';
import customFetch from '../../api';
import { removeSession } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import styles from './workouts.module.css';
import { Link } from 'react-router-dom';
import arms from './pics/arms.jpg';
import back from './pics/back.jpg';
import chest from './pics/chest.jpg';
import glutes from './pics/glutes.jpg';
import hamstring from './pics/hamstring.jpg';
import quadriceps from './pics/quadriceps.jpg';
import abs from './pics/abs.jpg';
import shoulders from './pics/shoulders.jpg';
import fullbody from './pics/fullbody.jpg';
import NavBar from '../../components/navBar/navBar';
import { UserContext } from '../../components/userContext/userContext';


const Dashboard = () => {
   const navigate = useNavigate();
   const { name, setName, photo, setPhoto } = useContext(UserContext);

   useEffect(() => {

      customFetch( "GET", "user/me")
        .then((json) => {
          setName(json.name);
          setPhoto(json.image)
        })
        .catch(() => {
         removeSession();
         navigate("/login");
       });
      }, [ navigate, setName, setPhoto]);

   return (
      <div className={styles.container}> 
      <NavBar />
         <h2>Hello, { name } {photo} </h2>
         <h3>What do you want to workout today?</h3>

         <div className={styles.wrap}>
            <div className={styles.workouts}>
            <Link to='/arms'>
               <img className={styles.work} src={arms} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/back'>
            <img className={styles.work} src={back} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/chest' >
            <img className={styles.work} src={chest} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/glutes' >
            <img className={styles.work} src={glutes} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/hamstrings' >
            <img className={styles.work} src={hamstring} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/quadriceps' >
            <img className={styles.work} src={quadriceps} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/abs' >
            <img className={styles.work} src={abs} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/shoulders'>
            <img className={styles.work} src={shoulders} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/fullbody' >
            <img className={styles.work} src={fullbody} alt='body part'/>
            </Link>
            </div>
         </div>
         
      </div>
    
  )
}

export default Dashboard;