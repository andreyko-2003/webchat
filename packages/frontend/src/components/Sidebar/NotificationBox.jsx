import React, { useEffect, useState } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { Box, Typography } from "@mui/material";

const NotificationBox = ({ chatId }) => {
  const { notification } = useSocket();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    setNotifCount(
      notification?.filter((notif) => notif.chat._id === chatId)?.length || 0
    );
  }, [notification, chatId]);

  return (
    notifCount > 0 && (
      <Box
        sx={{
          width: "30px",
          height: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "primary.main",
          color: "secondary.main",
          borderRadius: "50%",
        }}
      >
        <Typography
          component="h6"
          variant="subtitle1"
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {notifCount}
        </Typography>
      </Box>
    )
  );
};

export default NotificationBox;
