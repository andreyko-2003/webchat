import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatBox from "../components/ChatBox/ChatBox";

function Chat() {
  const { user } = useAuth();
  const [currentChat, setCurrentChat] = useState({});
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 960);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return user ? (
    <>
      <Header user={user} setCurrentChat={setCurrentChat} />
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
              />
            </Grid>
          )}
          {((isSmallScreen && Object.keys(currentChat).length > 0) ||
            !isSmallScreen) && (
            <Grid item xs={12} sm={8} md={9}>
              {Object.keys(currentChat).length > 0 ? (
                <ChatBox
                  currentChat={currentChat}
                  setCurrentChat={setCurrentChat}
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
