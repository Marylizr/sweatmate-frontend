import React from "react";
import customFetch from "../api"; // Adjust the path based on your project structure
import { useNavigate } from "react-router-dom";

const RedirectPlaceholder = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const authenticateUser = async () => {
      const queryParams = window.location.search; // Extract query parameters
      const url = `auth/oauth2callback${queryParams}`; // API endpoint path

      try {
        // Use customFetch to authenticate the user
        const response = await customFetch("GET", url); // Adjust backend logic to return user details
        console.log("Authentication successful:", response);

        // Navigate based on the user's gender
        if (response.gender === "female") {
          navigate("/dashboard/female");
        } else if (response.gender === "male") {
          navigate("/dashboard/male");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Authentication failed:", error);

        // Navigate to error page with a message
        navigate("/error", { state: { message: "Authentication failed. Please try again." } });
      }
    };

    authenticateUser();
  }, [navigate]);

  return <p>Authenticating... Please wait.</p>;
};

export default RedirectPlaceholder;
