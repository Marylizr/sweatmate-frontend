import React, { useState, useEffect } from 'react';
import styles from './login.module.css';
import { useForm } from 'react-hook-form';
import customFetch from '../../api';
import { setUserSession, getUserToken } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import eye from '../../assets/eye.svg';

const Login = () => {
   const { register, handleSubmit, formState: { errors } } = useForm();
   const navigate = useNavigate();
   const [user, setUser] = useState(null);
   const [passwordShown, setPasswordShown] = useState(false);

   const togglePasswordVisiblity = () => {
      setPasswordShown(!passwordShown);
   };

   // Check if user is already logged in
   useEffect(() => {
      const token = getUserToken();
      if (!token) {
         navigate("/"); // Redirect to homepage if not logged in
      }
   }, [navigate]);

   // Fetch user data after login
   const fetchUserData = async () => {
      try {
        const json = await customFetch("GET", "user/me", {
          credentials: 'include',  // Ensure cookies (with token) are sent in the request
        });
    
        if (json && json.role) {
          setUser(json);  
        } else {
          console.error("User data missing or invalid:", json);
          alert("Session expired. Please log in again.");
        }
    
      } catch (error) {
        if (error.status === 401) {
          console.warn("Unauthorized access - Token might be missing or expired.");
          alert("Session expired. Please log in again.");
        } else {
          console.error("Error fetching user data:", error);
        }
      }
    };
    

   // Navigate based on role and gender AFTER user state is updated
   useEffect(() => {
      if (user) {
         console.log(`My role is ${user.role} and gender is ${user.gender}`);

         if (user.role === "admin" || user.role === "personal-trainer") {
            navigate("/main/dashboard");
         } else if (["basic", "medium", "advance"].includes(user.role)) {
            if (user.gender === "female") {
               navigate("/dashboard/female");
            } else if (user.gender === "male") {
               navigate("/dashboard/male");
            } else {
               console.error(`Invalid gender: ${user.gender}`);
            }
         } else {
            console.error(`Invalid role: ${user.role}`);
         }
      }
   }, [user, navigate]); // Runs only when `user` is updated

   // Handle login submission
   const onSubmit = (data) => {
      customFetch("POST", "login", {
        body: JSON.stringify(data),
      })
      .then(userSession => {
        if (!userSession) {
          console.error("Login failed: No session data received.");
          alert("Login failed. Please check your credentials.");
          return;
        }
    
        console.log("Successful Login:", userSession);
    
        // No token handling since it's in the cookie now
        setUserSession(userSession);
        localStorage.setItem("userRole", userSession.role);
        localStorage.setItem("userId", userSession.id);
    
        fetchUserData();  // This will use the cookie for authentication
      })
      .catch(error => {
        console.error("Login failed:", error);
        alert("Invalid credentials. Please try again.");
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
                  <br />
                  <input
                     type="text"
                     placeholder='myemail@mail.com'
                     {...register("email", { required: true })}
                  />
                  {errors.email && <p className={styles.error}>This field is mandatory</p>}
                 
                   <br />

                  <label>Password</label>
                  <br />
                  <div className={styles.log}>
                     <input
                        type={passwordShown ? "text" : "password"}
                        placeholder='Minimum length: 8'
                        {...register("password", { required: true, minLength: 8 })}
                     />
                     <i className={styles.eye} onClick={togglePasswordVisiblity}>
                        <img src={eye} alt='eye-icon' />
                     </i>
                     {errors.password?.type === 'required' && <p className={styles.error}>This field is mandatory</p>}
                     {errors.password?.type === 'minLength' && <p className={styles.error}>The password must have 8 characters min</p>}
                  
                  </div>
                  <input className={styles.submit} type="submit" value="Let's Go!" />
               </form>
            </div>
         </div>
      </div>
   );
};

export default Login;
