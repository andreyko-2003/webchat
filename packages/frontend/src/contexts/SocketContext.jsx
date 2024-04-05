import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SOCKET_SERVER_URL = "http://localhost:5000";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(SOCKET_SERVER_URL);

      newSocket.emit("setup", user);
      newSocket.on("connected", () => setSocketConnected(true));

      setSocket(newSocket);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, socketConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within an SocketProvider");
  }
  return context;
};

export { SocketProvider, useSocket };
