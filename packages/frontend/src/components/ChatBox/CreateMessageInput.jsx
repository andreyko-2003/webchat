import { Box, TextField } from "@mui/material";
import React from "react";

const CreateMessageInput = ({ sendMessage, typingHandler, newMessage }) => {
  return (
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
  );
};

export default CreateMessageInput;
