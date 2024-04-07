import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const UpdateMessageInput = ({
  editMessage,
  setEditMessage,
  updatedMessage,
  updateMessage,
  handleUpdateInput,
}) => {
  return (
    <Box
      sx={{
        borderTop: "1px solid #ccc",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography>{editMessage.text}</Typography>
        <Button onClick={() => setEditMessage(null)}>
          <CloseIcon />
        </Button>
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        label="Edit your message..."
        autoComplete="off"
        onChange={handleUpdateInput}
        onKeyDown={updateMessage}
        value={updatedMessage}
      />
      {/* Add a send button here */}
    </Box>
  );
};

export default UpdateMessageInput;
