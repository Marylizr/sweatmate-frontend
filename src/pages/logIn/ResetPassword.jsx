import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import customFetch from "../../api";
import styles from "./resetPassword.module.css";

const ResetPassword = () => {
   const { token } = useParams();
   const navigate = useNavigate();
   const { register, handleSubmit, formState: { errors } } = useForm();
   const [message, setMessage] = useState("");
   const [loading, setLoading] = useState(false);

   const onSubmit = async (data) => {
      setLoading(true);
      try {
         await customFetch("POST", `reset-password/${token}`, {
            body: { newPassword: data.password }
         });
         
         setMessage("Your password has been reset successfully. Redirecting...");
         setTimeout(() => navigate("/login"), 3000);

      } catch (error) {
         setMessage("Invalid or expired token. Please request a new reset link.");
      }
      setLoading(false);
   };

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            <h2>Reset Password</h2>
            <p>Enter your new password below.</p>
            <form onSubmit={handleSubmit(onSubmit)}>
               <label>New Password</label>
               <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  {...register("password", { required: true, minLength: 8 })}
               />
               {errors.password && <p className={styles.error}>Password must be at least 8 characters</p>}
               <button className={styles.submit} type="submit" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
               </button>
            </form>
            {message && <p className={styles.success}>{message}</p>}
         </div>
      </div>
   );
};

export default ResetPassword;
