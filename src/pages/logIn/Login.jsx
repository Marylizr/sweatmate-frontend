import React, {useState, useEffect} from 'react';
import styles from './login.module.css';
import { useForm } from 'react-hook-form';
import customFetch from '../../api';
import { setUserSession, getUserToken } from "../../api/auth";
import { getUserRole, } from "../../api/auth"; 
import { useNavigate } from "react-router-dom";


const Login = () => {

   const { register, handleSubmit, formState: { errors } } = useForm();
   const navigate = useNavigate();
   const [gender, setGender] = useState('');
   const [role, setRole] = useState('');

   useEffect(() => {
      const token = getUserToken()
      if (token) navigate("/main/dashboard");
    }, [navigate]);


    const getGender = () => {
      customFetch( "GET", "user/me")
      .then((json) => {
      setGender(json.gender);
      setRole(json.role)
      })
      .catch((e) => {
      console.log(e)
      });
   }
   getGender()
 

   const getRoles = async () => {
      const userRole = await getUserRole("role")
      if (userRole === "admin") {
       navigate("/main/addworkout");
    } else if (userRole === "basic" || userRole === "medium" || userRole === "advance") {
       if (gender === "female") {
          navigate("/dashboard/female");
       } else if (gender === "male") {
          navigate("/dashboard/male");
       } else {
          console.error(`Invalid gender ${gender}`, gender);
       }
    } else {
      console.error(`Invalid role ${role}`, role);
    }
    }
    getRoles();


  const onSubmit = data => {

      customFetch("POST", "login", {body: data})
      .then(userSession => {
         setUserSession(userSession);
         setGender(gender)
         getRoles(role)
      }).catch(error => {
         console.error('its no possible to log in');
      });

    };

  return (
   <div className={styles.container}>
      <div className={styles.wrapper}>
         <header className={styles.header}>
            <h1>Login</h1>
         </header>
         <div className={styles.form_styles}>
            <form onSubmit={handleSubmit(onSubmit)}>
               <label>Email</label>
               <input type="text" placeholder='myemail@mail.com' {...register("email", { required: true })} />
               {errors.email && <p className={styles.error}>This field is mandatory</p>}
               <br />
               <label>Password</label>
               <input type="password" placeholder='Longitud mínima: 8' {...register("password", { required: true, minLength: 8 })} />
               {errors.password?.type === 'required' && <p className={styles.error}>This field is mandatory</p>}
               {errors.password?.type === 'minLength' && <p className={styles.error}>The password must have 8 characters min</p>}
               <br />
               <input className={styles.submit} type="submit" value="Let's Go!" />
            </form>
         </div>
      </div>
   </div>
  )
}

export default Login;