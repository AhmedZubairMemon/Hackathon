import { Navigate } from "react-router-dom";
import { showErrorToast } from "../utils/tostify";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if(!token){
    showErrorToast("Please login first to access this page")
    return <Navigate to="/login" replace />;
  }
  return children 
};

export default PrivateRoute;