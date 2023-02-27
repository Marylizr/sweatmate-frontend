import React, {useEffect} from 'react';
import { useNavigate } from 'react-router';
import {useForm} from 'react-hook-form';
import customFetch from '../../api';
import { setUserSession } from "../../api/auth";
import styles from '../signUp/signup.module.css';
import logo from '../../utils/logo.jpeg';



const SignUp = () => {
   const navigate = useNavigate();

   useEffect(() => {
     const token = localStorage.getItem("token");
     if (token) navigate("/dashboard");
   }, [navigate]);
 
   const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
  
    const onSubmit = (data) => {
      customFetch("POST", "user", {body: data})
      .then(userSession => {
        setUserSession(userSession);
        navigate("/dashboard");
      }).catch(error => {
        console.error('not possible to sign up');
      });
    };


  return (
    <div className={styles.container}>
       <div className={styles.img}>
       <img src={logo} alt='logo beFit'/>
       </div>
       <h2>Register</h2>
       <form onSubmit={handleSubmit(onSubmit)}>
         <label>Name</label>
         <input type="text" placeholder='Your Name' {...register("name", { required: true  })} />
         {errors.name?.type === 'required' && <p className={styles.error}>This field is required</p>}
         {errors.name?.type === 'pattern' && <p className={styles.error}>Incorrect name</p>}
         <br/>
         <label>Email</label>
         <input type="text" placeholder='myemail.mail.com' {...register("email", { required: true })} />
         {errors.email && <p className={styles.error}>This field is required</p>}
         <br/>
         <label>Password</label>
         <input type="password" placeholder='minLength: 8 ' {...register("password", { required: true, minLength: 8 })} />
         {errors.password?.type === 'required' && <p className={styles.error}>This field is required</p>}
         {errors.password?.type === 'minLength' && <p className={styles.error}>Password should be longer than 8 characters</p>}
         <br/>
         <label>Weight</label>
         <input type="number" placeholder='60kg' {...register("weight", { required: true })} />
         {errors.weight && <p className={styles.error}>This field is required</p>}
         <br/>
         <label>Height</label>
         <input type="number" placeholder='1.67' {...register("height", { required: true })} />
         {errors.height && <p className={styles.error}>This field is required</p>}
         <br/>
         <label>Age</label>
         <input type="number" placeholder='30' {...register("age", { required: true })} />
         {errors.age && <p className={styles.error}>This field is required</p>}
         <br/>
         <label>Goal</label>
         <select className={styles.goal} type='goal' {...register("goal", { required: true })} >
            <option value="Fat-Lost">Fat Lost</option>
            <option value="Gain-Muscle-Mass ">Gain Muscle Mass</option>
            <option value="Manteninance">Manteninance</option>
         </select>
            
               <input className={styles.submit} type="submit" />
           
            </form>
    </div>
  )
}

export default SignUp;