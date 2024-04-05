import React, { useEffect } from "react";
import { formatTime } from "../../utils/datetime";
import { Box, Typography } from "@mui/material";
import { useSocket } from "../../contexts/SocketContext";
import MessageStatus from "../MessageStatus/MessageStatus";

const SingleChatMessage = ({ message, user }) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (message.sender._id !== user._id && message.status !== "read")
      socket.emit("markAsRead", message._id);
  }, [socket]);

  return (
    <Box
      key={message._id}
      sx={{
        display: "flex",
        justifyContent:
          message.sender._id === user._id ? "flex-end" : "flex-start",
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
          message.sender._id === user._id ? "primary.main" : "secondary.main"
        }
        color={
          message.sender._id !== user._id ? "primary.main" : "secondary.main"
        }
      >
        <Box>
          <Typography variant="body1" sx={{ lineHeight: 1 }}>
            {message.text}
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
      </Box>
    </Box>
  );
};

export default SingleChatMessage;
