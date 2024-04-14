import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";

import { getContacts } from "../utils/contacts";
import { useAuth } from "../contexts/AuthContext";
import ChatBox from "../components/ChatBox/ChatBox";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import { useSocket } from "../contexts/SocketContext";

function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState({});
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
  const [updateChats, setUpdateChats] = useState();
  const [chats, setChats] = useState([]);
  const [contacts, setContacts] = useState(getContacts(chats, user));
  const {
    socket,
    selectedChatCompare,
    setSelectedChatCompare,
    notification,
    setNotification,
  } = useSocket();

  useEffect(() => {
    setSelectedChatCompare(currentChat._id ? currentChat : null);
  }, [currentChat]);

  useEffect(() => {
    setContacts(getContacts(chats, user));
  }, [chats, user]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("received", (message) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== message.chat._id
        ) {
          if (!notification.includes(message)) {
            setNotification((prev) => [...prev, message]);
            setUpdateChats(message);
          }
        } else {
          if (selectedChatCompare._id === message.chat._id)
            setMessages((prevMessages) => [...prevMessages, message]);
        }
      });

      return () => {
        socket.off("received");
      };
    }
  }, [socket, selectedChatCompare]);

  return user ? (
    <>
      <Header
        user={user}
        setCurrentChat={setCurrentChat}
        setUpdateChats={setUpdateChats}
        contacts={contacts}
      />
      <Box
        sx={{ flexGrow: 1, display: "flex", overflow: "hidden", mt: "64px" }}
      >
        <Grid container>
          {((isSmallScreen && Object.keys(currentChat).length === 0) ||
            !isSmallScreen) && (
            <Grid item xs={12} sm={4} md={3}>
              <Sidebar
                user={user}
                currentChat={currentChat}
                setCurrentChat={setCurrentChat}
                updateChats={updateChats}
                chats={chats}
                setChats={setChats}
              />
            </Grid>
          )}
          {((isSmallScreen && Object.keys(currentChat).length > 0) ||
            !isSmallScreen) && (
            <Grid item xs={12} sm={8} md={9}>
              {Object.keys(currentChat).length > 0 ? (
                <ChatBox
                  isSmallScreen={isSmallScreen}
                  user={user}
                  currentChat={currentChat}
                  setCurrentChat={setCurrentChat}
                  setUpdateChats={setUpdateChats}
                  messages={messages}
                  setMessages={setMessages}
                />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Typography variant="h6">
                    Select a chat to start messaging
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  ) : (
    <CircularProgress />
  );
}

export default Chat;
