import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import React, { useRef, useState } from "react";
import axios from "../../utils/axios";
import Attachment from "../Attachment/Attachment";

const CreateMessageInput = ({ sendMessage, typingHandler, newMessage }) => {
  const [attachments, setAttachments] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const fileInputRef = useRef(null);

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file.size > 10485760) {
      setErrorMessage("File size exceeds the limit of 10MB.");
    } else {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post("/upload", formData);
        setAttachments((prev) => [...prev, response.data]);
      } catch (error) {
        setErrorMessage("Error uploading file. Please try add it later.");
      }
    }
  };

  const deleteAttachment = (attachment) => {
    setAttachments((prev) =>
      prev.filter((prevAttachment) => attachment.url !== prevAttachment.url)
    );
  };

  const send = () => {
    sendMessage(attachments);
    setAttachments([]);
  };

  return (
    <Box
      sx={{
        borderTop: "1px solid #ccc",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {attachments.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", pb: "8px" }}>
          {attachments.map((attachment) => (
            <Attachment
              key={attachment.url}
              attachment={attachment}
              onDelete={() => deleteAttachment(attachment)}
            />
          ))}
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleUpload}
        />
        <IconButton sx={{ mr: 1 }} onClick={openFileInput}>
          <AttachFileIcon />
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          label="Type your message..."
          autoComplete="off"
          onKeyDown={(e) => e.key === "Enter" && send()}
          onChange={typingHandler}
          value={newMessage}
        />
        <IconButton sx={{ ml: 1 }} onClick={send}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CreateMessageInput;
