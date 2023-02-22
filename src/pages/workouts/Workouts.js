import React from 'react';
import { useState, useEffect } from 'react';
import customFetch from '../../api';
import { removeSession } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import styles from '../workouts/workouts.module.css';
import { Link } from 'react-router-dom';
import arms from '../workouts/pics/arms.jpg';
import back from '../workouts/pics/back.jpg';
import chest from '../workouts/pics/chest.jpg';
import glutes from '../workouts/pics/glutes.jpg';
import hamstring from '../workouts/pics/hamstring.jpg';
import quadriceps from '../workouts/pics/quadriceps.jpg';
import abs from '../workouts/pics/abs.jpg';
import shoulders from '../workouts/pics/shoulders.jpg';
import fullbody from '../workouts/pics/fullbody.jpg';
import NavBar from '../../components/navBar/navBar';



const Workouts = () => {
   const navigate = useNavigate();
   const [name, setName] = useState();

   useEffect(() => {

      customFetch( "GET", "user/me")
        .then((json) => {
          setName(json.name);
        })
        .catch(() => {
         removeSession();
         navigate("/login");
       });
      }, [ navigate, setName]);

   return (
      <div className={styles.container}> 
      <NavBar />
         <h2>Hello, { name }</h2>
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

export default Workouts;