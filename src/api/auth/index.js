import {deleteStorageObject, getStorageObject, setStorageObject} from "../storage";

export const getUserToken = () => {
    const session = getStorageObject("user-session");
    if(session){
        return session.token
    }
    return undefined;
}

export const getSessionUser = () => {
    const session = getStorageObject("user-session");
    if(session){
        return session.user
    }
    return undefined;
}

export const getUserRole = () => {
    const session = getStorageObject("user-session");
    if(session){
        return session.role
    }
    return undefined;
}

export const getUserGender = () => {
    const session = getStorageObject("user-session");
    if(session){
        return session.gender
    }
    return undefined;
}

export const getUserId = () => {
    const session = getStorageObject("user-session");
    if(session){
        return session.id
    }
    return undefined;
}

export const setUserSession = (sessionData) =>{
    setStorageObject("user-session", sessionData);
}

export const removeSession = () => {
    deleteStorageObject("user-session");
}