import React, { useEffect, useState } from "react";

import {
  Box,
  IconButton,
  Typography,
  TextField,
  AppBar,
  Toolbar,
  Avatar,
  CircularProgress,
} from "@mui/material";
import axios from "../../utils/axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styled from "@emotion/styled";
import GroupsIcon from "@mui/icons-material/Groups";
import { getChatInfo } from "../../utils/chat";
import GroupInfoModal from "../Modals/Group/GroupInfoModal";
import ChatInfoModal from "../Modals/Chat/ChatInfoModal";
import { useAuth } from "../../contexts/AuthContext";
import {
  groupMessagesByDate,
  formatTime,
  addNewMessageToGroupedMessagesByDate,
} from "../../utils/datetime";

import ScrollableFeed from "react-scrollable-feed";
import GroupChatMessage from "./GroupChatMessage";

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

const ChatContent = styled(ScrollableFeed)({
  padding: "16px",
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
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [openChatInfoModal, setOpenChatInfoModal] = useState(false);
  const [openGroupInfoModal, setOpenGroupInfoModal] = useState(false);
  const { token } = useAuth();

  const handleGoBack = () => {
    setCurrentChat({});
  };

  const chat = getChatInfo(currentChat, user);

  const openModal = () => {
    currentChat.isGroupChat
      ? setOpenGroupInfoModal(true)
      : setOpenChatInfoModal(true);
  };
  useEffect(() => {
    const getMessages = async () => {
      if (currentChat && currentChat._id) {
        try {
          setLoading(true);
          const response = await axios.get(`/message/${currentChat._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setMessages(await groupMessagesByDate(response.data));
          setLoading(false);
        } catch (error) {}
      }
    };
    getMessages();
  }, [currentChat, token]);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const response = await axios.post(
          "/message/",
          {
            chatId: currentChat._id,
            content: newMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNewMessage(
          addNewMessageToGroupedMessagesByDate(messages, response.data)
        );
        setNewMessage("");
      } catch (error) {}
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
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

        <ChatContent>
          {loading ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            messages.map((daysMessages) => (
              <Box key={daysMessages.date}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      width: "max-content",
                      background: "#0002",
                      borderRadius: 4,
                      px: 2,
                      py: 1,
                      mb: "2px",
                    }}
                  >
                    {daysMessages.date}
                  </Typography>
                </Box>
                {currentChat.isGroupChat
                  ? daysMessages.messages.map((message, i) => (
                      <GroupChatMessage
                        key={message._id}
                        message={message}
                        user={user}
                        messages={daysMessages.messages}
                        index={i}
                      />
                    ))
                  : daysMessages.messages.map((message) => (
                      <Box
                        key={message._id}
                        sx={{
                          display: "flex",
                          justifyContent:
                            message.sender._id === user._id
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            width: "max-content",
                            p: 1.5,
                            borderRadius: 2,
                            mb: "2px",
                            maxWidth: "70%",
                            wordWrap: "break-word",
                          }}
                          bgcolor={
                            message.sender._id === user._id
                              ? "primary.main"
                              : "secondary.main"
                          }
                          color={
                            message.sender._id !== user._id
                              ? "primary.main"
                              : "secondary.main"
                          }
                        >
                          <Box>
                            <Typography variant="body1" sx={{ lineHeight: 1 }}>
                              {message.text}
                            </Typography>
                            <Typography
                              variant="overline"
                              sx={{ lineHeight: 1, opacity: "50%" }}
                            >
                              {formatTime(message.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
              </Box>
            ))
          )}
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
            label="Type your message..."
            autoComplete="off"
            onKeyDown={sendMessage}
            onChange={typingHandler}
            value={newMessage}
          />
          {/* Add a send button here */}
        </Box>
      </ChatBoxContainer>
    </>
  );
};

export default ChatBox;
