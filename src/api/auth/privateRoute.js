import { Navigate} from "react-router-dom";
import useAuth from "./useAuth";



    const  PrivateRoute =({ children })=> {

        const { authenticated} = useAuth();
        
    return authenticated ? children : <Navigate to="/login" />;
}
export default PrivateRoute;