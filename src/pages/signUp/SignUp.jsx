import React from 'react';
import styles from './signup.module.css';
import SignUpForm from './signUpForm';


const SignUp = () => {
  return (
    <div className={styles.container}>
       <header className={styles.header}>
         <h1>Sign Up</h1>
      </header>
      <SignUpForm />
   </div>
  )
}

export default SignUp;