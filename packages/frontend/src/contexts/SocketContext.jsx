import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "../utils/axios.js";
import { useAuth } from "./AuthContext";
import { latestActivityFormatDateTime } from "../utils/datetime";

const SOCKET_SERVER_URL = "http://localhost:5000";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [usersStatuses, setUsersStatuses] = useState({});
  const [selectedChatCompare, setSelectedChatCompare] = useState(null);
  const [notification, setNotification] = useState([]);

  const { user, token } = useAuth();

  useEffect(() => {
    const getNotification = async () => {
      const response = await axios.get("/message/notif", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotification(response.data);
    };
    getNotification();
  }, []);

  useEffect(() => {
    if (user) {
      const newSocket = io(SOCKET_SERVER_URL);

      newSocket.emit("setup", user);
      newSocket.on("connected", () => setSocketConnected(true));
      newSocket.on("userStatus", (status) => {
        setUsersStatuses(status);
      });

      setSocket(newSocket);

      return () => {
        newSocket.off("userStatus");
      };
    }
  }, [user]);

  const isUserOnline = (userId) => {
    return usersStatuses[userId].status === "online";
  };

  const getUserStatus = (userId) => {
    if (usersStatuses[userId]) {
      if (isUserOnline(userId)) {
        return "Online";
      } else {
        return latestActivityFormatDateTime(
          usersStatuses[userId].latestActivity
        );
      }
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        socketConnected,
        usersStatuses,
        isUserOnline,
        getUserStatus,
        selectedChatCompare,
        setSelectedChatCompare,
        notification,
        setNotification,
      }}
    >
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
