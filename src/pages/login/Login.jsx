import React, { useState, useEffect, useCallback } from 'react';
import styles from './login.module.css';
import { useForm } from 'react-hook-form';
import customFetch from '../../api';
import { setUserSession, removeSession } from "../../api/auth"; // Removed getUserToken as it's unused
import { useNavigate } from "react-router-dom";
import eye from '../../assets/eye.svg';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailForReset, setEmailForReset] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  useEffect(() => {
    console.log("Clearing previous session...");
    removeSession();
  }, []);

  // Navigate based on role and gender
  const navigateBasedOnRole = useCallback((user) => {
    if (!user) return;

    console.log(`User Role: ${user.role}, Gender: ${user.gender}`);

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
  }, [navigate]);

  // Fetch user data after login
  const fetchUserData = useCallback(async (token) => {
    if (!token) return;

    try {
      console.log("Retrieved Token:", token);
      const json = await customFetch("GET", "user/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (json && json.role && json.gender) {
        setUserSession(token, json.role, json.id, json.name, json.gender);
        navigateBasedOnRole(json);
      } else {
        console.error("User data missing or invalid:", json);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [navigateBasedOnRole]);

  // Handle login submission
  const onSubmit = async (data) => {
    setErrorMessage("");

    try {
      const response = await customFetch("POST", "login", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (response.token) {
        console.log("Storing session data:", { token: response.token, user: response.name, role: response.role });
        fetchUserData(response.token);
      } else {
        console.warn("No token received in the response");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };

  // Handle Password Reset Request
  const handlePasswordReset = async () => {
    if (!emailForReset) {
      setErrorMessage("Please enter your email to reset your password.");
      return;
    }

    try {
      const response = await customFetch("POST", "reset-password/forgot-password", {
        body: JSON.stringify({ email: emailForReset }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.message) {
        alert(response.message);
        setShowResetForm(false); // Close reset form after successful request
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
