// auth.js
import { deleteStorageObject, getStorageObject } from "./storage"; // Importing the storage utilities

// Function to get the user's token from the session
export const getUserToken = () => {
    let session = JSON.parse(localStorage.getItem("session"));
    if (!session || !session.token) {
      console.warn("No token found in session.");
      return null;
    }
    return session.token;
  };
  

// Function to get the user object from the session
export const getSessionUser = () => {
    const session = getStorageObject("user-session");
    return session?.user;
};

// Function to get the user role from the session
export const getUserRole = () => {
    const session = getStorageObject("user-session");
    return session?.role;
};

// Function to get the user gender from the session
export const getUserGender = () => {
    const session = getStorageObject("user-session");
    return session?.gender;
};

// Function to get the user ID from the session
export const getUserId = () => {
    const session = getStorageObject("user-session");
    return session?.id;
};

// Function to store the user session in localStorage
export const setUserSession = (token, role, id, name, gender) => {
  if (!token || !id || !name) {
      console.error("Invalid session data, not storing session:", { token, role, id, name, gender });
      return;
  }

  const sessionData = { token, role, id, user: name, gender };
  localStorage.setItem("session", JSON.stringify(sessionData));

  console.log("Session stored successfully:", sessionData);
};

  

// Function to remove the user session from localStorage
export const removeSession = () => {
    deleteStorageObject("user-session");
    localStorage.removeItem("token");  // Ensure token is cleared from localStorage
};
