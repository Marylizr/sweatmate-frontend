// SignUpForm.js
import React, { useEffect, useState } from 'react';
import styles from './signup.module.css';
import { useForm } from 'react-hook-form';
import customFetch from '../../api';
import { setUserSession } from "../../api/auth"; // Importing session management functions
import { useNavigate } from 'react-router';
import eye from '../../assets/eye.svg';

const SignUpForm = () => {
  const navigate = useNavigate();

  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    customFetch("POST", "user", { body: data })
      .then(userSession => {
        console.log("API response:", userSession); // Debugging log to see the API response
        setUserSession(userSession);
        
        if (data.role === "admin"){
          navigate("/main/dashboard");
        } else if(data.gender === "female") {
          navigate("/dashboard/female");
        } else if (data.gender === "male") {
          navigate("/dashboard/male");
        } else {
          console.error('Invalid gender');
        }
      }).catch(error => {
        console.error('API error:', error);
      });
  };

  return (
    <div className={styles.form_styles}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder='Your Name' {...register("name", { required: true })} />
        {errors.name?.type === 'required' && <p className={styles.error}>This field is required</p>}
        {errors.name?.type === 'pattern' && <p className={styles.error}>Incorrect name</p>}

        <input type="text" placeholder='example@mail.com' {...register("email", { required: true })} />
        {errors.email && <p className={styles.error}>This field is required</p>}

        <div className={styles.pass}>
          <input
            type={passwordShown ? "text" : "password"}
            placeholder='Longitud mínima: 8'
            {...register("password", { required: true, minLength: 8 })}
            />
          <i className={styles.eye} onClick={togglePasswordVisiblity}>
            <img src={eye} alt='eye-icon' />
          </i>
          {errors.password?.type === 'required' && <p className={styles.error}>This field is required</p>}
          {errors.password?.type === 'minLength' && <p className={styles.error}>Password should be longer than 8 characters</p>}
        </div>

        <input type="number" placeholder='height: 167' {...register("height", { required: true })} />
        {errors.height && <p className={styles.error}>This field is required</p>}

        <input type="number" placeholder='weight: 60' {...register("weight", { required: true })} />
        {errors.weight && <p className={styles.error}>This field is required</p>}

        <input type="number" placeholder='age: 30' {...register("age", { required: true })} />
        {errors.age && <p className={styles.error}>This field is required</p>}

        <select className={styles.goal} type='goal' {...register("goal", { required: true })}>
          <option value="">Select Goal</option>
          <option value="Fat-Lost">Fat Lost</option>
          <option value="Gain-Muscle-Mass">Gain Muscle Mass</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <select className={styles.gender} type='gender' {...register("gender", { required: true })} >
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>

        <input type="text" placeholder='role' {...register("role", { required: true })} />
        {errors.role && <p className={styles.error}>This field is mandatory</p>}
        <br />

        <input className={styles.submit} type="submit" value="Sign me up!" />
      </form>
    </div>
  );
};

export default SignUpForm;