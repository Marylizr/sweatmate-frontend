import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import customFetch from "../api"; // Adjust the path based on your structure

const VerifyEmail = () => {
  const [message, setMessage] = useState(""); // To display success or error message
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (!token) {
        setMessage("Invalid verification link. Token is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await customFetch("GET", `user/verify-email?token=${token}`);
        setMessage(response.message || "Email verified successfully!");
        setIsLoading(false);

        // Optionally redirect after successful verification
        setTimeout(() => {
          navigate("/login"); // Redirect to login page
        }, 3000);
      } catch (error) {
        console.error("Error verifying email:", error);
        setMessage("Verification failed. Please try again.");
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <div>
      {isLoading ? (
        <p>Verifying your email... Please wait.</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default VerifyEmail;
