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

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = getUserToken();
    if (token) {
      fetchUserData(token);
    }
  }, [navigate]);

  // Fetch user data after login
  const fetchUserData = async (token) => {
    try {
      console.log("Retrieved Token:", token);
      const json = await customFetch("GET", "user/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (json && json.role && json.gender) {
        setUser(json);
     
      } else {
        console.error("User data missing or invalid:", json);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Handle login submission

  const onSubmit = async (data) => {
   console.log("Form data being sent:", data);  // Ensure email and password exist
 
   try {
     const response = await customFetch("POST", "login", {
       body: JSON.stringify(data),
       headers: { "Content-Type": "application/json" },
     });
 
     if (response.token) {
       // Store session data
       setUserSession(response.token, response.role, response.id, response.name, response.gender);
 
       // **Define sessionData and log it**
       const sessionData = { token: response.token, user: response.name, role: response.role };
       console.log("Storing session data:", sessionData);
 
       // Check if the session data is stored properly
       console.log("Data stored in localStorage:", localStorage.getItem("user-session"));
       console.log("Token stored successfully:", response.token);
 
       // Optionally, set user state if needed
       setUser({
         id: response.id,
         name: response.name,
         role: response.role,
         gender: response.gender
       });
 
     } else {
       console.warn("No token received in the response");
     }
   } catch (error) {
     console.error("Login failed:", error);
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
  }, [user, navigate]);

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
              <i className={styles.eye} onClick={togglePasswordVisibility}>
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
