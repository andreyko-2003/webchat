import React, { useEffect } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { isLastMessage, isSameSender } from "../../utils/messages";
import { formatTime } from "../../utils/datetime";
import { useSocket } from "../../contexts/SocketContext";
import MessageStatus from "../MessageStatus/MessageStatus";
import MessageMenu from "./MessageMenu";
import Attachment from "../Attachment/Attachment";
import { decryptMessage } from "../../utils/encryption";

const GroupChatMessage = ({ message, user, messages, index }) => {
  const { socket, setNotification } = useSocket();

  useEffect(() => {
    if (message.sender._id !== user._id && message.status !== "read") {
      socket.emit("markAsRead", { messageId: message._id, userId: user._id });
      setNotification((prev) =>
        prev.filter((prevMessage) => message._id !== prevMessage._id)
      );
    }
  }, [socket]);

  const showAvatar =
    message.sender._id !== user._id && isLastMessage(messages, index);
  const showUserName =
    message.sender._id !== user._id && !isSameSender(messages, index);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent:
          message.sender._id === user._id ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        mt: showUserName && 1,
      }}
    >
      {showAvatar && (
        <Avatar
          alt={`${message.sender.firstName} ${message.sender.lastName}`}
          src={message.sender.avatar}
          sx={{ background: "gray", color: "white", mb: "2px", mr: "10px" }}
        />
      )}
      <Box
        sx={{
          width: "max-content",
          p: 1.5,
          borderRadius: 2,
          mb: "2px",
          maxWidth: "70%",
          wordWrap: "break-word",
          ml: !showAvatar && "50px",
        }}
        bgcolor={
          message.sender._id === user._id ? "primary.main" : "secondary.main"
        }
        color={
          message.sender._id !== user._id ? "primary.main" : "secondary.main"
        }
      >
        <MessageMenu message={message} user={user}>
          {showUserName && (
            <Typography
              variant="overline"
              sx={{ lineHeight: 1, fontWeight: "bold", mb: "6px" }}
            >
              {message.sender.firstName} {message.sender.lastName}
            </Typography>
          )}
          {message.attachments.length > 0 && (
            <Box>
              {message.attachments.map((attachment) => (
                <Attachment
                  key={attachment.url}
                  attachment={attachment}
                  openFile={true}
                  theme={message.sender._id === user._id ? "dark" : "light"}
                />
              ))}
            </Box>
          )}
          <Typography
            variant="body1"
            sx={{ lineHeight: 1, mt: showUserName && 1 }}
          >
            {decryptMessage(message.text, message.chat._id)}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              mt: "2px",
            }}
          >
            <Typography
              variant="overline"
              sx={{
                lineHeight: 1,
                opacity: "50%",
                mt: 0.5,
                display: "flex",
                justifyContent:
                  message.sender._id !== user._id ? "flex-end" : "flex-start",
              }}
            >
              {formatTime(message.createdAt)}
            </Typography>
            {message.sender._id === user._id && (
              <MessageStatus status={message.status} />
            )}
          </Box>
        </MessageMenu>
      </Box>
    </Box>
  );
};

export default GroupChatMessage;
