import React, { useState } from "react";
import styles from "./userProfile.module.css";
import { useForm } from "react-hook-form";
import customFetch from "../../api";
import eye from "../../assets/eye.svg";

const CreateUserForm = ({users, setUsers, trainers}) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);

   const togglePasswordVisibility = () => {
      setPasswordShown(!passwordShown);
   };


   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const onSubmit = async (data) => {

      setLoading(true);
      const userData = {
        userName: data.name,
        email: data.email,
        age: data.age,
        height: data.height,
        weight: data.weight,
        goal: data.goal,
        password: data.password,
        role: data.role,
        gender: data.gender,
        trainerId: data.trainerId,
      };
    
      try {
        await customFetch("POST", "user", { body: userData });
        alert('User profile created successfully');
        setUsers((prevUsers) => [...prevUsers, userData]); // Update the user list
      } catch (err) {
        console.error('Unable to create user profile:', err);
      } finally {
         setLoading(false);
       }
    };
    
   

  return (
    <div className={styles.users_form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <input
          type="text"
          placeholder="User's Name"
          {...register("name", { required: "This field is required" })}
        />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}

        {/* Email Field */}
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

        {/* Password Field */}
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
         <button type="button" className={styles.eye} onClick={togglePasswordVisibility}>
            <img src={eye} alt="eye-icon" />
         </button>
         {errors.password && <p className={styles.error}>{errors.password.message}</p>}
         </div>

        {/* Height Field */}
        <input
          type="number"
          placeholder="Height (cm): 167"
          {...register("height", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Height must be a positive number",
            },
          })}
        />
        {errors.height && <p className={styles.error}>{errors.height.message}</p>}

        {/* Weight Field */}
        <input
          type="number"
          placeholder="Weight (kg): 60"
          {...register("weight", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Weight must be a positive number",
            },
          })}
        />
        {errors.weight && <p className={styles.error}>{errors.weight.message}</p>}

        {/* Age Field */}
        <input
          type="number"
          placeholder="Age: 30"
          {...register("age", {
            required: "This field is required",
            min: {
              value: 18,
              message: "You must be at least 18 years old",
            },
          })}
        />
        {errors.age && <p className={styles.error}>{errors.age.message}</p>}

        {/* Goal Field */}
        <select className={styles.goal} {...register("goal", { required: "This field is required" })}>
          <option value="">Select Goal</option>
          <option value="Fat-Lost">Fat Lost</option>
          <option value="Gain-Muscle-Mass">Gain Muscle Mass</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        {errors.goal && <p className={styles.error}>{errors.goal.message}</p>}

        {/* Gender Field */}
        <select className={styles.gender} {...register("gender", { required: "This field is required" })}>
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
        {errors.gender && <p className={styles.error}>{errors.gender.message}</p>}

        {/* Role Field */}
        <select
          className={styles.role}
          {...register("role", { required: "This field is mandatory" })}
        >
          <option value="">Select Role</option>
          <option value="basic">Basic</option>
          <option value="medium">Medium</option>
          <option value="advanced">Advanced</option>
        </select>
        {errors.role && <p className={styles.error}>{errors.role.message}</p>}


        {/* Personal Trainer Selection */}
        <label>Select the Personal Trainer</label>
        <select {...register("trainerId", { required: "Please select a personal trainer" })}>
          <option value="">Select a Personal Trainer</option>
          {trainers.map((trainer) => (
            <option key={trainer._id} value={trainer._id}>
              {trainer.name}
            </option>
          ))}
        </select>
        {errors.trainerId && <p className={styles.error}>{errors.trainerId.message}</p>}

        <br />

        <input className={styles.submit} type="submit" value={loading ? "Submitting..." : "Create"} disabled={loading} />
      </form>
    </div>
  );
};

export default CreateUserForm;
