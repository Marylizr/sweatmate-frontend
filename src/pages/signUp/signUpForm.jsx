import React, { useEffect, useState } from "react";
import styles from "./signup.module.css";
import { useForm } from "react-hook-form";
import customFetch from "../../api";
import { useNavigate, useLocation } from "react-router-dom";
import { setUserSession } from "../../api/auth";
import eye from "../../assets/eye.svg";

const SignUpForm = () => {
  const navigate = useNavigate();
  const currentLocation = useLocation();

  const [passwordShown, setPasswordShown] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [isLoadingTrainers, setIsLoadingTrainers] = useState(true);
  const [isVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const data = await customFetch("GET", "user/trainers");
        setTrainers(data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      } finally {
        setIsLoadingTrainers(false);
      }
    };

    fetchTrainers();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!currentLocation.pathname.includes("/verify-email")) {
      return;
    }

    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (!token) {
        setVerificationMessage("Invalid verification link. Token is missing.");
        return;
      }

      try {
        const response = await customFetch("GET", `user/verify-email?token=${token}`);
        setVerificationMessage(response.message || "Email verified successfully!");
      } catch (error) {
        console.error("Error verifying email:", error);
        setVerificationMessage(
          error.response?.message || "Verification failed. Please request a new link."
        );
      }
    };

    verifyEmail();
  }, [currentLocation.pathname]);

  const onSubmit = async (data) => {
    setErrorMessage("");
    setEmail(data.email);

    try {
      const response = await customFetch("POST", "user/create-profile", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      // Store token and session data
      if (response.token) {
        setUserSession(response.token, response.role, response.id, response.user, response.gender);
      }

      alert(response.message || "Signup successful! Please verify your email.");

      if (response.role === "admin") {
        navigate("/admin/dashboard");
      } else if (response.gender === "female") {
        navigate("/dashboard/female");
      } else if (response.gender === "male") {
        navigate("/dashboard/male");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error during signup:", error);

      if (error.response && error.response.message) {
        setErrorMessage(error.response.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  const resendVerificationEmail = async () => {
    if (!email) {
      alert("Please sign up or provide an email to resend the verification email.");
      return;
    }

    try {
      await customFetch("POST", "user/send-verification", {
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      alert("Verification email resent. Check your inbox.");
    } catch (error) {
      console.error("Error resending verification email:", error);
      alert("Failed to resend verification email.");
    }
  };

  return (
    <div className={styles.form_styles}>
      {verificationMessage && <p className={styles.success}>{verificationMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Your Name"
          {...register("name", { required: "This field is required" })}
        />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}

        <input
          type="email"
          placeholder="example@mail.com"
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Invalid email format",
            },
          })}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <div className={styles.pass}>
          <input
            type={passwordShown ? "text" : "password"}
            placeholder="Minimum length: 8"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
          />
          <i className={styles.eye} onClick={togglePasswordVisibility}>
            <img src={eye} alt="eye-icon" />
          </i>
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>

        <input
          type="number"
          placeholder="Height (cm): 167"
          {...register("height", {
            required: "This field is required",
            min: { value: 1, message: "Height must be a positive number" },
          })}
        />
        {errors.height && <p className={styles.error}>{errors.height.message}</p>}

        <input
          type="number"
          placeholder="Weight (kg): 60"
          {...register("weight", {
            required: "This field is required",
            min: { value: 1, message: "Weight must be a positive number" },
          })}
        />
        {errors.weight && <p className={styles.error}>{errors.weight.message}</p>}

        <input
          type="number"
          placeholder="Age: 30"
          {...register("age", {
            required: "This field is required",
            min: { value: 18, message: "You must be at least 18 years old" },
          })}
        />
        {errors.age && <p className={styles.error}>{errors.age.message}</p>}

        <select {...register("goal", { required: "This field is required" })}>
          <option value="">Select Goal</option>
          <option value="Fat-Lost">Fat Lost</option>
          <option value="Gain-Muscle-Mass">Gain Muscle Mass</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        {errors.goal && <p className={styles.error}>{errors.goal.message}</p>}

        <select {...register("gender", { required: "This field is required" })}>
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
        {errors.gender && <p className={styles.error}>{errors.gender.message}</p>}

        <select {...register("fitness_level", { required: "This field is required" })}>
          <option value="">Select Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        {errors.fitness_level && <p className={styles.error}>{errors.fitness_level.message}</p>}

        <label>Select Your Personal Trainer</label>
        {isLoadingTrainers ? (
          <p>Loading trainers...</p>
        ) : trainers.length > 0 ? (
          <select {...register("trainerId", { required: "Please select a personal trainer" })}>
            <option value="">Select a Personal Trainer</option>
            {trainers.map((trainer) => (
              <option key={trainer._id} value={trainer._id}>
                {trainer.name}
              </option>
            ))}
          </select>
        ) : (
          <p>No trainers available</p>
        )}
        {errors.trainerId && <p className={styles.error}>{errors.trainerId.message}</p>}

        <input className={styles.submit} type="submit" value="Sign me up!" />
      </form>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      {!isVerified && (
        <div className={styles.verificationButton}>
          <p>Haven't received the verification email?</p>
          <button onClick={resendVerificationEmail}>Resend Verification Email</button>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;
