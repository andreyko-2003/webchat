import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { isLastMessage, isSameSender } from "../../utils/messages";
import { formatTime } from "../../utils/datetime";

const GroupChatMessage = ({ message, user, messages, index }) => {
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
        {showUserName && (
          <Typography
            variant="overline"
            sx={{ lineHeight: 1, fontWeight: "bold", mb: "6px" }}
          >
            {message.sender.firstName} {message.sender.lastName}
          </Typography>
        )}

        <Typography
          variant="body1"
          sx={{ lineHeight: 1, mt: showUserName && 1 }}
        >
          {message.text}
        </Typography>
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
      </Box>
    </Box>
  );
};

export default GroupChatMessage;
