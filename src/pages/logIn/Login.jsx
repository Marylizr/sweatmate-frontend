import React from 'react';
import styles from './login.module.css';
import Form from './Form';



const Login = () => {

  return (
   <div className={styles.container}>
      <div className={styles.wrapper}>
         <header className={styles.header}>
            <h1>Login</h1>
         </header>
         <Form />
      </div>
   </div>
  )
}

export default Login