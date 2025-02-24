// auth.js
import { deleteStorageObject, getStorageObject, setStorageObject } from "./storage"; // Importing the storage utilities

// Function to get the user's token from the session
export const getUserToken = () => {
    const session = getStorageObject("user-session");
    console.log("Retrieved session in getUserToken:", session);
    return session ? session.token : null;
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
export const setUserSession = (token, role, id, user = {}, gender = "") => {
    const sessionData = { token, role, id, user, gender };
    console.log("Storing session data:", sessionData);
    setStorageObject("user-session", sessionData);
    localStorage.setItem("token", token);  // Store token separately for easier retrieval

    // Immediately verify the stored session
    console.log("Checking stored session:", getStorageObject("user-session"));
};

// Function to remove the user session from localStorage
export const removeSession = () => {
    deleteStorageObject("user-session");
    localStorage.removeItem("token");  // Ensure token is cleared from localStorage
};
