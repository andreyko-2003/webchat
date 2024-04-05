import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const MessageStatus = ({ status }) => {
  const style = {
    width: "16px",
    height: "16px",
    ml: 1,
    opacity: 0.5,
  };
  switch (status) {
    case "sending":
      return <AccessTimeIcon sx={style} />;
    case "sent":
      return <DoneIcon sx={style} />;
    case "read":
      return <DoneAllIcon sx={style} />;
  }
};

export default MessageStatus;
