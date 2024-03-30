import React from "react";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  AppBar,
  Toolbar,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styled from "@emotion/styled";
import GroupsIcon from "@mui/icons-material/Groups";
import { getChatInfo } from "../../utils/chat";

const ContactAppBar = styled(AppBar)(({ theme }) => ({
  position: "static",
  background: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  height: "64px",
}));

const ChatBox = ({ isSmallScreen, user, currentChat, setCurrentChat }) => {
  const handleGoBack = () => {
    setCurrentChat({});
  };

  const chat = getChatInfo(currentChat, user);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ContactAppBar>
        <Toolbar>
          {isSmallScreen && (
            <IconButton
              onClick={handleGoBack}
              edge="start"
              color="inherit"
              aria-label="back"
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">{chat.title}</Typography>
          </Box>
          <Box>
            <Avatar
              alt={chat.title}
              src={chat.avatar}
              sx={{ background: "gray", color: "white" }}
            >
              {currentChat.isGroupChat && !currentChat.avatar && <GroupsIcon />}
            </Avatar>
          </Box>
        </Toolbar>
      </ContactAppBar>
      <Box sx={{ padding: "16px" }}>
        {/* Chat messages will be displayed here */}
      </Box>
      <Box
        sx={{
          borderTop: "1px solid #ccc",
          padding: "16px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Input for sending messages */}
        <TextField
          fullWidth
          variant="outlined"
          label="Type your message"
          // Add necessary event handlers and state management for sending messages
        />
        {/* You can add a send button here */}
      </Box>
    </Box>
  );
};

export default ChatBox;
