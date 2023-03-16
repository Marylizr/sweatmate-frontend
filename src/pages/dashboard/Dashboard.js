import React, {useContext, useEffect } from 'react';
import customFetch from '../../api';
import { removeSession } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import styles from './dashboard.module.css';
import { Link } from 'react-router-dom';
import NavBar from '../../components/navBar/navBar';
import { UserContext } from '../../components/userContext/userContext';


const Dashboard = () => {
   const navigate = useNavigate();
   const { name, setName } = useContext(UserContext);
   

   const workout = {
      shoulders:{
         url:'https://res.cloudinary.com/da6il8qmv/image/upload/v1678462601/yn4y9wfbp1icfh1g7s5v.jpg',
         name:'shoulders'
      },
      hamstrings: {
         url: 'https://res.cloudinary.com/da6il8qmv/image/upload/v1678458794/neihyyne8sms9tkld03f.jpg',
         name:'hamstring'
      },
      abs: {
         url:'https://res.cloudinary.com/da6il8qmv/image/upload/v1678462237/g8zf3k30zrk3qyuuj0bj.jpg',
         name: 'abs'
      },
      chest:{
         url:'https://res.cloudinary.com/da6il8qmv/image/upload/v1678461145/uw0u7mnzjnycwbbroyba.jpg',
         name:'chest'
      },
      arms:{
         url: 'https://res.cloudinary.com/da6il8qmv/image/upload/v1678461316/xeizneu1kbvq8z0phdg0.jpg',
         name:'arms'
      },
      glutes:{
         url: 'https://res.cloudinary.com/da6il8qmv/image/upload/v1678460424/fygn5dsyfcto5hy3tt87.jpg',
         name:'glutes'
      },
      quadriceps:{
         url:'https://res.cloudinary.com/da6il8qmv/image/upload/v1678462414/pwwodwh4uybrv9p7ouls.jpg',
         name:'quadriceps'
      },
      fullbody: {
         url:'https://res.cloudinary.com/da6il8qmv/image/upload/v1678460318/rzn4s6jbwsgnsuxrwppp.jpg',
         name:'fullbody'
      },
      back: {
         url:'https://res.cloudinary.com/da6il8qmv/image/upload/v1678461939/e8aizjg2jyezzbrwqaqu.jpg',
         name:'back'
      }
   }

   useEffect(() => {

      customFetch( "GET", "user/me")
        .then((json) => {
          setName(json.name);
        })
        .catch(() => {
          removeSession();
          navigate("/");
        });
      }, [navigate, setName]);

      

   return (
      <div className={styles.container}> 
      <NavBar />
      <div className={styles.small_header}>
         <h2>Hello, { name } </h2>
      </div>
        
         <h3>What do you want to workout today?</h3>

         <div className={styles.wrap}>

            <div className={styles.workouts}>
            <Link to='/arms'>
               <p>{workout.arms.name}</p>
               <img className={styles.work} src={workout.arms.url} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/back'>
            <p>{workout.back.name}</p>
            <img className={styles.work} src={workout.back.url} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/chest' >
            <p>{workout.chest.name}</p>
            <img className={styles.work} src={workout.chest.url} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/glutes' >
            <p>{workout.glutes.name}</p>
            <img className={styles.work} src={workout.glutes.url} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/hamstrings' >
            <p>{workout.hamstrings.name}</p>
            <img className={styles.work} src={workout.hamstrings.url} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/quadriceps' >
            <p>{workout.quadriceps.name}</p>
            <img className={styles.work} src={workout.quadriceps.url} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/abs' >
            <p>{workout.abs.name}</p>
            <img className={styles.work} src={workout.abs.url} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/shoulders'>
               <p>{workout.shoulders.name}</p>
               <img className={styles.work} src={workout.shoulders.url} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/fullbody' >
            <p>{workout.fullbody.name}</p>
            <img className={styles.work} src={workout.fullbody.url} alt='body part'/>
            </Link>
            </div>
         </div>
         
      </div>
    
  )
}

export default Dashboard;