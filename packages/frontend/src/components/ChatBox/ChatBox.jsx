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
import { formatDate, formatTime } from "../../utils/datetime";
import ScrollableFeed from "react-scrollable-feed";
import GroupChatMessage from "./GroupChatMessage";
import { isNewDayMessage } from "../../utils/messages";
import { useSocket } from "../../contexts/SocketContext";

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

var selectedChatCompare;

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
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { token } = useAuth();
  const { socket, socketConnected } = useSocket();

  useEffect(() => {
    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));
  }, [socket]);

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

          setMessages(response.data);
          setLoading(false);

          socket.emit("join", currentChat._id);
        } catch (error) {}
      }
    };
    getMessages();
    selectedChatCompare = currentChat;
  }, [currentChat, token, socket]);

  useEffect(() => {
    socket.on("recieved", (message) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== message.chat._id
      ) {
        // TODO
      } else {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("recieved");
    };
  }, [socket]);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        socket.emit("stopTyping", currentChat._id);
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
        socket.emit("send", response.data);
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setUpdateChats(response.data);
        setNewMessage("");
      } catch (error) {}
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", currentChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 1500;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stopTyping", currentChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

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
              <Typography variant="body1">
                {isTyping ? "Typing..." : "Status"}
              </Typography>
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
            messages.map((message, i) => (
              <Box key={i}>
                {isNewDayMessage(messages, i) && (
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
                      {formatDate(message.createdAt)}
                    </Typography>
                  </Box>
                )}
                {currentChat.isGroupChat ? (
                  <GroupChatMessage
                    key={message._id}
                    message={message}
                    user={user}
                    messages={messages}
                    index={i}
                  />
                ) : (
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
                )}
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
