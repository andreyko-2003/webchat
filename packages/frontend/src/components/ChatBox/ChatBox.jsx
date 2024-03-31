import React, { useState } from "react";

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
import GroupInfoModal from "../Modals/Group/GroupInfoModal";
import ChatInfoModal from "../Modals/Chat/ChatInfoModal";

const ContactAppBar = styled(AppBar)(({ theme }) => ({
  position: "static",
  background: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  height: "64px",
}));

const ChatBoxContainer = styled(Box)({
  height: "calc(100vh - 64px)",
  display: "flex",
  flexDirection: "column",
});

const ChatContent = styled(Box)({
  flex: 1,
  overflowY: "scroll",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#bbb",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#888",
  },
});

const ChatBox = ({
  isSmallScreen,
  user,
  currentChat,
  setCurrentChat,
  setUpdateChats,
}) => {
  const [openChatInfoModal, setOpenChatInfoModal] = useState(false);
  const [openGroupInfoModal, setOpenGroupInfoModal] = useState(false);

  const handleGoBack = () => {
    setCurrentChat({});
  };

  const chat = getChatInfo(currentChat, user);

  const openModal = () => {
    currentChat.isGroupChat
      ? setOpenGroupInfoModal(true)
      : setOpenChatInfoModal(true);
  };

  return (
    <>
      <GroupInfoModal
        open={openGroupInfoModal}
        close={() => setOpenGroupInfoModal(false)}
        group={currentChat}
        user={user}
        setUpdateChats={setUpdateChats}
        setCurrentChat={setCurrentChat}
      />
      <ChatInfoModal
        open={openChatInfoModal}
        close={() => setOpenChatInfoModal(false)}
        chat={currentChat}
        user={user}
        setUpdateChats={setUpdateChats}
        setCurrentChat={setCurrentChat}
      />
      <ChatBoxContainer>
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
                onClick={openModal}
              >
                {currentChat.isGroupChat && !currentChat.avatar && (
                  <GroupsIcon />
                )}
              </Avatar>
            </Box>
          </Toolbar>
        </ContactAppBar>
        <ChatContent sx={{ padding: "16px" }}>
          {/* Chat messages will be displayed here. */}
        </ChatContent>
        <Box
          sx={{
            borderTop: "1px solid #ccc",
            padding: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Type your message"
            // Add necessary event handlers and state management for sending messages
          />
          {/* You can add a send button here */}
        </Box>
      </ChatBoxContainer>
    </>
  );
};

export default ChatBox;
