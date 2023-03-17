import React, {useEffect} from 'react';
import { useNavigate } from 'react-router';
import {useForm} from 'react-hook-form';
import customFetch from '../../api';
import { setUserSession } from "../../api/auth";
import styles from '../signUp/signup.module.css';
import logo from '../../utils/logo.jpeg';
import { Link } from 'react-router-dom';



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
        console.error('no token for user session');
      });
    };


  return (
    <div className={styles.container}>
       <div className={styles.img}>
       <img src={logo} alt='logo beFit'/>
       </div>
       <h2>Register</h2>
       <form onSubmit={handleSubmit(onSubmit)}>
        
         <input type="text" placeholder='Your Name' {...register("name", { required: true  })} />
         {errors.name?.type === 'required' && <p className={styles.error}>This field is required</p>}
         {errors.name?.type === 'pattern' && <p className={styles.error}>Incorrect name</p>}
         <br/>
         
         <input type="text" placeholder='myemail.mail.com' {...register("email", { required: true })} />
         {errors.email && <p className={styles.error}>This field is required</p>}
         <br/>
        
         <input type="password" placeholder='password minLength: 8 ' {...register("password", { required: true, minLength: 8 })} />
         {errors.password?.type === 'required' && <p className={styles.error}>This field is required</p>}
         {errors.password?.type === 'minLength' && <p className={styles.error}>Password should be longer than 8 characters</p>}
         <br/>
         {/* <label>User Image</label>
         <input type="text"  {...register("image")} />
         <br/> */}
        
         <input type="number" placeholder='height: 167' {...register("height", { required: true })} />
         {errors.height && <p className={styles.error}>This field is required</p>}
         <br/>

        
         <input type="number" placeholder='weight: 60' {...register("weight", { required: true })} />
         {errors.weight && <p className={styles.error}>This field is required</p>}
         <br/>

        
         <input type="number" placeholder='age: 30' {...register("age", { required: true })} />
         {errors.age && <p className={styles.error}>This field is required</p>}
         <br/>
         
         <select className={styles.goal} type='goal' {...register("goal", { required: true })} >
            <option value="Fat-Lost">Fat Lost</option>
            <option value="Gain-Muscle-Mass ">Gain Muscle Mass</option>
            <option value="Manteninance">Manteninance</option>
         </select>

         <select className={styles.goal} type='role' {...register("role", { required: true })} >
            <option value="basic">Basic</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
         </select>
            
               <input className={styles.submit} type="submit" value="Sign me up!"/>
            </form>
          <div className={styles.log}><p>I already have an account</p><Link to='/login'>Log me In</Link></div>  
    </div>
  )
}

export default SignUp;