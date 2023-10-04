import React, { useEffect } from 'react';
import styles from './signUp.module.css';
import { useForm } from 'react-hook-form';
import customFetch from '../../api';
import { setUserSession } from "../../api/auth";
import { useNavigate } from 'react-router';

const SignUpForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    customFetch("POST", "user", { body: data })
      .then(userSession => {
        setUserSession(userSession);
        
        
        if (data.gender === "female") {
          navigate("/dashboard/female");
        } else if (data.gender === "male") {
          navigate("/dashboard/male");
        } else {
          console.error('Invalid gender');
        }
      }).catch(error => {
        console.error('No se pudo obtener el token de la sesión', error);
      });
  };

  return (
    <div className={styles.form_styles}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder='Your Name' {...register("name", { required: true })} />
        {errors.name?.type === 'required' && <p className={styles.error}>This field is required</p>}
        {errors.name?.type === 'pattern' && <p className={styles.error}>Incorrect name</p>}

        <input type="text" placeholder='myemail.mail.com' {...register("email", { required: true })} />
        {errors.email && <p className={styles.error}>This field is required</p>}

        <input type="password" placeholder='password minLength: 8 ' {...register("password", { required: true, minLength: 8 })} />
        {errors.password?.type === 'required' && <p className={styles.error}>This field is required</p>}
        {errors.password?.type === 'minLength' && <p className={styles.error}>Password should be longer than 8 characters</p>}

        <input type="number" placeholder='height: 167' {...register("height", { required: true })} />
        {errors.height && <p className={styles.error}>This field is required</p>}

        <input type="number" placeholder='weight: 60' {...register("weight", { required: true })} />
        {errors.weight && <p className={styles.error}>This field is required</p>}

        <input type="number" placeholder='age: 30' {...register("age", { required: true })} />
        {errors.age && <p className={styles.error}>This field is required</p>}

        <select className={styles.goal} type='goal' {...register("goal", { required: true })}>
          <option value="Fat-Lost">Fat Lost</option>
          <option value="Gain-Muscle-Mass">Gain Muscle Mass</option>
          <option value="Manteninance">Manteninance</option>
        </select>

        <select className={styles.gender} type='gender' {...register("gender", { required: true })} >
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>

        <input className={styles.submit} type="submit" value="Sign me up!" />
      </form>
    </div>
  )
}

export default SignUpForm;
