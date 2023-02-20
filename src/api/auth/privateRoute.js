import { Navigate} from "react-router-dom";
import useAuth from "./useAuth";
import LoadingPage from "./loadingPage";


    const  PrivateRoute =({ children })=> {

        const {loading, authenticated} = useAuth();
        if(loading){
            return <LoadingPage/>
        };

    return authenticated ? children : <Navigate to="/login" />;
}
export default PrivateRoute;