import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { SocketProvider } from "../../contexts/SocketContext";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <SocketProvider>
      <Element {...rest} />{" "}
    </SocketProvider>
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default PrivateRoute;
