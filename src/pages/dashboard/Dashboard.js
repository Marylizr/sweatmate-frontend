import React, { useState } from 'react';
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
   const { name, setName } = useContext(UserContext);
   const [image, setImage] = useState();

   useEffect(() => {

      customFetch( "GET", "user/me")
        .then((json) => {
          setName(json.name);
          setImage(json.image)
        })
        .catch(() => {
         removeSession();
         navigate("/login");
       });
      }, [ navigate, setName]);

   return (
      <div className={styles.container}> 
      <NavBar />
      <div className={styles.small_header}>
         <img src={image} alt='profile_pic'/>
         <h2>Hello, { name } </h2>
      </div>
        
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