import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customFetch from "../../api";
import styles from "./resetpassword.module.css";

const ResetPassword = () => {
  const { token } = useParams();  // Extract token from the URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await customFetch("POST", `reset-password/${token}`, {
        body: { newPassword },
      });

      setMessage(response.message || "Password reset successful!");

      // Redirect to login after successful reset
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage(error.response?.message || "Failed to reset password.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
