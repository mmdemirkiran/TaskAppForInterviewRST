import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ element }) => {
  const { token } = useContext(AuthContext);

  // Eğer token yoksa login sayfasına yönlendir
  return token ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
