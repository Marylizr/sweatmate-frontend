import React from 'react';
import {useForm} from 'react-hook-form';
import styles from '../logIn/login.module.css';
import customFetch from '../../api';
import { setUserSession, getUserRole } from "../../api/auth";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../utils/logo_new.png';



const Login = () => {
    const navigate = useNavigate();

      const getRoles = () => {
        const userRole = getUserRole("role")
        if (userRole === "admin") {
          navigate("/main/addworkout")
        } else if (userRole === "basic") {
          navigate("/dashboard")
        }
      }
   

   const {register, handleSubmit, formState:{ errors} } = useForm();
   
   const onSubmit = data => {
    customFetch("POST", "login", {body: data})
    .then(userSession => {
      setUserSession(userSession);
      getRoles()
    }).catch(error => {
      console.error('its no possible to log in');
    });
   };


   return (
      <div className={styles.container}>
         <div className={styles.img}>
       <img src={logo} alt='logo beFit'/>
       </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input type="text" placeholder='myemail@mail.com' {...register("email", { required: true })} />
                {errors.email && <p className={styles.error}>This field is required</p>}
                <br/>
                <label>Password</label>
                <input type="password" placeholder='minLength: 8' {...register("password", { required: true, minLength: 8 })} />
                {errors.password?.type === 'required' && <p className={styles.error}>This field is required</p>}
                {errors.password?.type === 'minLength' && <p className={styles.error}>Password should be longer than 8 characters</p>}
                <br/>
                <input className={styles.submit} type="submit" value="Lets go!"/>
                
                <div className={styles.log}> <p>I don´t have an account</p><Link to='/signup'>Sign me Up!</Link></div>  
            </form>
        </div>
   );
};

export default Login;
