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
import { formatDate } from "../../utils/datetime";
import ScrollableFeed from "react-scrollable-feed";
import GroupChatMessage from "./GroupChatMessage";
import { isLastMessage, isNewDayMessage } from "../../utils/messages";
import { useSocket } from "../../contexts/SocketContext";
import { getContact } from "../../utils/contacts";
import SingleChatMessage from "./SingleChatMessage";
import CreateMessageInput from "./CreateMessageInput";
import UpdateMessageInput from "./UpdateMessageInput";

const ContactAppBar = styled(AppBar)(({ theme }) => ({
  position: "static",
  background: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  height: "64px",
  zIndex: "100",
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
  messages,
  setMessages,
}) => {
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [updatedMessage, setUpdatedMessage] = useState("");
  const [openChatInfoModal, setOpenChatInfoModal] = useState(false);
  const [openGroupInfoModal, setOpenGroupInfoModal] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userStatus, setUserStatus] = useState("Offline");
  const [editMessage, setEditMessage] = useState(null);
  const { token } = useAuth();
  const {
    socket,
    socketConnected,
    usersStatuses,
    getUserStatus,
    selectedChatCompare,
    notification,
    setNotification,
  } = useSocket();

  useEffect(() => {
    setUpdateChats(messages);
  }, [messages]);

  useEffect(() => {
    socket.on("typing", (room) => {
      if (room === currentChat._id) setIsTyping(true);
    });

    socket.on("stopTyping", (room) => {
      if (room === currentChat._id) setIsTyping(false);
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const userId = getContact(currentChat, user._id);
    setUserStatus(getUserStatus(userId));
  }, [usersStatuses, currentChat, getUserStatus, user]);

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
  }, [currentChat, token, socket]);

  useEffect(() => {
    socket.on("messageStatusUpdate", ({ messageId, status }) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === messageId ? { ...message, status } : message
        )
      );
    });

    return () => {
      socket.off("messageStatusUpdate");
    };
  }, [messages, socket]);

  useEffect(() => {
    socket.on("messageEdited", ({ _id, text, attachments }) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === _id ? { ...message, text, attachments } : message
        )
      );
    });

    return () => {
      socket.off("messageEdited");
    };
  }, [messages, socket]);

  useEffect(() => {
    socket.on("messageDeleted", (messageId) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );
    });

    return () => {
      socket.off("messageDeleted");
    };
  }, [messages, socket]);

  useEffect(() => {
    if (editMessage) setUpdatedMessage(editMessage.text);
  }, [editMessage]);

  const updateMessage = async (attachments) => {
    if ((updatedMessage || attachments) && editMessage) {
      try {
        socket.emit("editMessage", {
          editMessageId: editMessage._id,
          updatedMessage,
          attachments,
        });
        setEditMessage(null);
      } catch (error) {}
    }
  };

  const sendMessage = async (attachments) => {
    if (newMessage || attachments) {
      try {
        socket.emit("stopTyping", currentChat._id);
        const response = await axios.post(
          "/message/",
          {
            chatId: currentChat._id,
            content: newMessage,
            attachments: attachments,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        socket.emit("send", response.data);
        socket.emit("markAsSent", response.data._id);
        setMessages((prevMessages) => [...prevMessages, response.data]);
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

  const handleUpdateInput = (e) => {
    setUpdatedMessage(e.target.value);
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
              {!currentChat.isGroupChat && (
                <Typography variant="body1">
                  {isTyping ? "Typing..." : userStatus}
                </Typography>
              )}
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
                  <SingleChatMessage
                    message={message}
                    user={user}
                    editMessage={editMessage}
                    setEditMessage={setEditMessage}
                  />
                )}
              </Box>
            ))
          )}
        </ChatContent>

        {editMessage ? (
          <UpdateMessageInput
            editMessage={editMessage}
            setEditMessage={setEditMessage}
            updatedMessage={updatedMessage}
            updateMessage={updateMessage}
            handleUpdateInput={handleUpdateInput}
          />
        ) : (
          <CreateMessageInput
            sendMessage={sendMessage}
            typingHandler={typingHandler}
            newMessage={newMessage}
          />
        )}
      </ChatBoxContainer>
    </>
  );
};

export default ChatBox;
