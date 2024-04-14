import React from "react";
import { Box, Typography } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";

const Attachment = ({ attachment, theme, onDelete, openFile }) => {
  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes >= 1024 * 1024) {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    } else if (sizeInBytes >= 1024) {
      return `${Math.ceil(sizeInBytes / 1024)} KB`;
    } else {
      return `1 KB`;
    }
  };

  const bgColor = theme === "dark" ? "inherit" : "secondary.main";
  const textColor = theme === "dark" ? "secondary.main" : "primary.main";

  return (
    <Box
      sx={{
        p: 1,
        bgcolor: bgColor,
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        m: 1,
      }}
      onClick={() =>
        openFile &&
        window.open(`http://localhost:5000${attachment.url}`, "_blank")
      }
    >
      <InsertDriveFileIcon sx={{ color: textColor, mr: 1 }} />
      <Box>
        <Typography variant="body2" color={textColor}>
          {attachment.originalname}
        </Typography>
        <Typography variant="body2" color={textColor} sx={{ opacity: 0.5 }}>
          {formatFileSize(attachment.size)}
        </Typography>
      </Box>
      {onDelete && <CloseIcon sx={{ ml: 1 }} onClick={onDelete} />}
    </Box>
  );
};

export default Attachment;
