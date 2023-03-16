import {useEffect, useState } from 'react';
import customFetch from '../../api';
import { removeSession } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import styles from './dashboard.module.css';
import { Link } from 'react-router-dom';
import NavBar from '../../components/navBar/navBar';


const Dashboard = () => {
   const navigate = useNavigate();
  const [user, setUser] = useState()
   

   const workout = {
      shoulders:'https://res.cloudinary.com/da6il8qmv/image/upload/v1677854667/r7gdidsnnikouckncros.jpg',
      hamstrings: 'https://res.cloudinary.com/da6il8qmv/image/upload/v1677942224/befh9pnv55i8ktmb1ew1.jpg',
      abs:'https://res.cloudinary.com/da6il8qmv/image/upload/v1677938225/zirrxmbjykojtvdptihs.jpg',
      chest:'https://res.cloudinary.com/da6il8qmv/image/upload/v1677934377/kpdqntkhx1tqkv3hxg14.jpg',
      arms:'https://res.cloudinary.com/da6il8qmv/image/upload/v1677936587/rf9j6awdqh3hltyxup7e.jpg',
      glutes:'https://res.cloudinary.com/da6il8qmv/image/upload/v1677936012/s30tjuf0jtsguwexcscq.jpg',
      quadriceps:'https://res.cloudinary.com/da6il8qmv/image/upload/v1677939605/iymjphi5pqtayh9clzbk.jpg',
      fullbody: 'https://res.cloudinary.com/da6il8qmv/image/upload/v1677928480/qnreeqhxbn1xy3n6dhoe.jpg',
      back: 'https://res.cloudinary.com/da6il8qmv/image/upload/v1677937739/knp4fhdcyjb96pjqjbfp.jpg'
   }

  

   useEffect(() => {

      customFetch( "GET", "user/me")
        .then((json) => {
          setUser(json.email);
        })
        .catch(() => {
         removeSession();
         navigate("/login");
       });
      }, [ navigate, setUser]);

      
console.log(user)
  

   return (
      <div className={styles.container}> 
      <NavBar />
      <div className={styles.small_header}>
         <h2>Hello, { user } </h2>
      </div>
        
         <h3>What do you want to workout today?</h3>

         <div className={styles.wrap}>
            <div className={styles.workouts}>
            <Link to='/arms'>
               <img className={styles.work} src={workout.arms} alt='body part'/>
               <div className={styles.info}>
                    <h2>Arms</h2>
               </div>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/back'>
            <img className={styles.work} src={workout.back} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/chest' >
            <img className={styles.work} src={workout.chest} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/glutes' >
            <img className={styles.work} src={workout.glutes} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/hamstrings' >
            <img className={styles.work} src={workout.hamstrings} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/quadriceps' >
            <img className={styles.work} src={workout.quadriceps} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/abs' >
            <img className={styles.work} src={workout.abs} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/shoulders'>
            <img className={styles.work} src={workout.shoulders} alt='body part'/>
            </Link>
            </div>

            <div className={styles.workouts}>
            <Link to='/fullbody' >
            <img className={styles.work} src={workout.fullbody} alt='body part'/>
            </Link>
            </div>
         </div>
         
      </div>
    
  )
}

export default Dashboard;