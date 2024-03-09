import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function privateRoutes({ children }) {
    const token  = Cookies.get('token');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default privateRoutes;