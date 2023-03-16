import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import styles from '../logIn/login.module.css';
import customFetch from '../../api';
import { getUserToken, setUserSession } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import logo from '../../utils/logo.jpeg';


const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = getUserToken("accessToken");
        if (accessToken) navigate("/dashboard");
      }, [navigate]);

   const {register, handleSubmit, formState:{ errors} } = useForm();
   
   const onSubmit = data => {
    customFetch("POST", "login", {body: data})
    .then(userSession => {
      setUserSession(userSession);
      navigate("/dashboard");
    })
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
            </form>
        </div>
   );
};

export default Login;
