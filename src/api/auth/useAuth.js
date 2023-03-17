import {useEffect, useState} from "react";
import { getUserToken} from "./index";
import fetchResource from "../index";


const useAuth = () => {
    const [isSessionValid, setIsSessionValid] = useState(false);
    const token = getUserToken();

    useEffect(()=> {
        if(token){

            fetchResource("GET", "user")
                .then(userData => {
                    setIsSessionValid(true);

                }).catch(error => {
                setIsSessionValid(false);
            })
        }

    }, [ token])

    return {
        authenticated: token && isSessionValid
    }

}

export default useAuth;