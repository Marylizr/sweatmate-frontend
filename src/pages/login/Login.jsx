import React, { useState, useEffect } from 'react';
import styles from './login.module.css';
import { useForm } from 'react-hook-form';
import customFetch from '../../api';
import { setUserSession, getUserToken, removeSession } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import eye from '../../assets/eye.svg';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [passwordShown, setPasswordShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailForReset, setEmailForReset] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  useEffect(() => {
    clearSessionOnLoad();
  }, []);

  // Clear stale session data before login
  const clearSessionOnLoad = () => {
    console.log("Clearing previous session...");
    removeSession();
  };

  // Fetch user data after login
  const fetchUserData = async (token) => {
    try {
      console.log("Retrieved Token:", token);
      const json = await customFetch("GET", "user/me", {
        headers: { Authorization: `Bearer ${token}` }
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
    setErrorMessage(""); 

    try {
      const response = await customFetch("POST", "login", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (response.token) {
        setUserSession(response.token, response.role, response.id, response.name, response.gender);
        
        console.log("Storing session data:", { token: response.token, user: response.name, role: response.role });

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
      setErrorMessage("Invalid email or password. Please try again.");
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

  // Handle Password Reset Request
  const handlePasswordReset = async () => {
    if (!emailForReset) {
      setErrorMessage("Please enter your email to reset your password.");
      return;
    }

    try {
      const response = await customFetch("POST", "user/reset-password", {
        body: JSON.stringify({ email: emailForReset }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.message) {
        alert(response.message);
      } else {
        setErrorMessage("Something went wrong. Try again.");
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      setErrorMessage("Error sending password reset link.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1>Login</h1>
        </header>
        
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <div className={styles.form_styles}>
          {!showResetForm ? (
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
                <i onClick={() => setPasswordShown(!passwordShown)}>
                  <img src={eye} alt='eye-icon' />
                </i>
              </div>
                {errors.password?.type === 'required' && <p className={styles.error}>This field is mandatory</p>}
                {errors.password?.type === 'minLength' && <p className={styles.error}>The password must have 8 characters min</p>}
              <input className={styles.submit} type="submit" value="Let's Go!" />
              <p className={styles.forgotPassword} onClick={() => setShowResetForm(true)}>
                Forgot Password?
              </p>
            </form>
          ) : (
            <div className={styles.resetContainer}>
              <h2>Reset Password</h2>
              <input
                type="email"
                placeholder="Enter your email"
                value={emailForReset}
                onChange={(e) => setEmailForReset(e.target.value)}
              />
              <button onClick={handlePasswordReset}>Send Reset Link</button>
              <p className={styles.backToLogin} onClick={() => setShowResetForm(false)}>Back to Login</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
