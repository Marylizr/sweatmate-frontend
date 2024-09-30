import React, { useState, useEffect } from 'react';
import styles from './login.module.css';
import { useForm } from 'react-hook-form';
import customFetch from '../../api';
import { setUserSession, getUserToken } from "../../api/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
   const { register, handleSubmit, formState: { errors } } = useForm();
   const navigate = useNavigate();
   const [gender, setGender] = useState('');
   const [role, setRole] = useState('');

   // Check if user is already logged in
   useEffect(() => {
      const token = getUserToken();
      if (!token) {
         navigate("/"); // Redirect to homepage if logged in
      }
   }, [navigate]);

   // Fetch user data (gender and role) after login
   const fetchUserData = () => {
      customFetch("GET", "user/me")
         .then((json) => {
            setGender(json.gender);
            setRole(json.role);
            navigateBasedOnRole(json.role, json.gender);
         })
         .catch((e) => {
            console.log(e,  `Error fetching user data ${gender}${role}`);
         });
   };

   // Navigate based on role and gender
   const navigateBasedOnRole = (userRole, userGender) => {
      if (userRole === "admin") {
         navigate("/main/addworkout");
      } else if (["basic", "medium", "advance"].includes(userRole)) {
         if (userGender === "female") {
            navigate("/dashboard/female");
         } else if (userGender === "male") {
            navigate("/dashboard/male");
         } else {
            console.error(`Invalid gender: ${userGender}`);
         }
      } else {
         console.error(`Invalid role: ${userRole}`);
      }
   };

   // Handle login submission
   const onSubmit = (data) => {
      customFetch("POST", "login", { body: data })
         .then(userSession => {
            setUserSession(userSession); // Store user session in localStorage
            fetchUserData(); // Fetch gender and role after login
         })
         .catch(error => {
            console.error('Login failed:', error);
         });
   };

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            <header className={styles.header}>
               <h1>Login</h1>
            </header>
            <div className={styles.form_styles}>
               <form onSubmit={handleSubmit(onSubmit)}>
                  <label>Email</label>
                  <input
                     type="text"
                     placeholder='myemail@mail.com'
                     {...register("email", { required: true })}
                  />
                  {errors.email && <p className={styles.error}>This field is mandatory</p>}
                  <br />
                  <label>Password</label>
                  <input
                     type="password"
                     placeholder='Longitud mínima: 8'
                     {...register("password", { required: true, minLength: 8 })}
                  />
                  {errors.password?.type === 'required' && <p className={styles.error}>This field is mandatory</p>}
                  {errors.password?.type === 'minLength' && <p className={styles.error}>The password must have 8 characters min</p>}
                  <br />
                  <input className={styles.submit} type="submit" value="Let's Go!" />
               </form>
            </div>
         </div>
      </div>
   );
};

export default Login;
