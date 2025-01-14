import React, { useEffect } from "react";
import { formatTime } from "../../utils/datetime";
import { Box, Typography } from "@mui/material";
import { useSocket } from "../../contexts/SocketContext";
import MessageStatus from "../MessageStatus/MessageStatus";
import MessageMenu from "./MessageMenu";
import Attachment from "../Attachment/Attachment";
import { decryptMessage } from "../../utils/encryption";

const SingleChatMessage = ({ message, user, editMessage, setEditMessage }) => {
  const { socket, setNotification } = useSocket();

  useEffect(() => {
    if (message._id) {
      if (message.sender._id !== user._id && message.status !== "read") {
        socket.emit("markAsRead", { messageId: message._id, userId: user._id });
        setNotification((prev) =>
          prev.filter((prevMessage) => message._id !== prevMessage._id)
        );
      }
    }
  }, [socket]);

  return (
    <Box
      key={message._id}
      sx={{
        display: "flex",
        mb: "2px",
        justifyContent:
          message.sender._id === user._id ? "flex-end" : "flex-start",
        background: editMessage && editMessage._id === message._id && "#0002",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          width: "max-content",
          p: 1.5,
          borderRadius: 2,
          maxWidth: "70%",
          wordWrap: "break-word",
        }}
        bgcolor={
          message.sender._id === user._id ? "primary.main" : "secondary.main"
        }
        color={
          message.sender._id !== user._id ? "primary.main" : "secondary.main"
        }
      >
        <MessageMenu
          message={message}
          user={user}
          setEditMessage={setEditMessage}
        >
          <Box>
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
            <Typography variant="body1" sx={{ lineHeight: 1 }}>
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
                sx={{ lineHeight: 1, opacity: "50%" }}
              >
                {formatTime(message.createdAt)}
              </Typography>
              {message.sender._id === user._id && (
                <MessageStatus status={message.status} />
              )}
            </Box>
          </Box>
        </MessageMenu>
      </Box>
    </Box>
  );
};

export default SingleChatMessage;
