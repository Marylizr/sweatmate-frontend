// auth.js
import { deleteStorageObject, getStorageObject, setStorageObject } from "./storage"; // Importing the storage utilities

// Function to get the user's token from the session
export const getUserToken = () => {
    const session = getStorageObject("user-session");
    if (session) {
        return session.token;
    }
    return undefined;
};

// Function to get the user object from the session
export const getSessionUser = () => {
    const session = getStorageObject("user-session");
    if (session) {
        return session.user;
    }
    return undefined;
};

// Function to get the user role from the session
export const getUserRole = () => {
    const session = getStorageObject("user-session");
    if (session) {
        return session.role;
    }
    return undefined;
};

// Function to get the user gender from the session
export const getUserGender = () => {
    const session = getStorageObject("user-session");
    if (session) {
        return session.gender;
    }
    return undefined;
};

// Function to get the user ID from the session
export const getUserId = () => {
    const session = getStorageObject("user-session");
    if (session) {
        return session.id;
    }
    return undefined;
};

// Function to store the user session in localStorage
export const setUserSession = (sessionData) => {
    console.log("Storing session data:", sessionData); // Debugging log to check the session data
    setStorageObject("user-session", sessionData);
};

// Function to remove the user session from localStorage
export const removeSession = () => {
    deleteStorageObject("user-session");
};
