import React, { useState } from "react";
import { useForm } from "react-hook-form";
import customFetch from "../../api";
import styles from "./forgotPassword.module.css";

const ForgotPassword = () => {
   const { register, handleSubmit, formState: { errors } } = useForm();
   const [message, setMessage] = useState("");
   const [loading, setLoading] = useState(false);

   const onSubmit = async (data) => {
      setLoading(true);
      try {
         await customFetch("POST", "forgot-password", { body: data });
         setMessage("If this email is registered, you will receive a password reset link shortly.");
      } catch (error) {
         console.error("Password reset request failed:", error);
         setMessage("Something went wrong. Please try again.");
      }
      setLoading(false);
   };

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            <h2>Forgot Password?</h2>
            <p>Enter your email, and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit(onSubmit)}>
               <label>Email</label>
               <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: true })}
               />
               {errors.email && <p className={styles.error}>This field is mandatory</p>}
               <button className={styles.submit} type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
               </button>
            </form>
            {message && <p className={styles.success}>{message}</p>}
         </div>
      </div>
   );
};

export default ForgotPassword;
