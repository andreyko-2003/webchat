import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import axios from "../../utils/axios.js";
import Attachment from "../Attachment/Attachment";

const UpdateMessageInput = ({
  editMessage, // show input
  setEditMessage, // set show edit input
  updatedMessage, // message
  updateMessage, // submit function
  handleUpdateInput, // onChange function
}) => {
  const [attachments, setAttachments] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const fileInputRef = useRef(null);

  useEffect(() => {
    setAttachments(editMessage.attachments);
  }, [editMessage]);

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

  const update = () => {
    updateMessage(attachments);
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
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
          justifyContent: "space-between",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography sx={{ ml: 1 }}>{editMessage.text}</Typography>
        <Button onClick={() => setEditMessage(null)}>
          <CloseIcon />
        </Button>
      </Box>
      <Box sx={{ display: "flex", width: "100%" }}>
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
          autoComplete="off"
          onChange={handleUpdateInput}
          onKeyDown={(e) => e.key === "Enter" && update()}
          value={updatedMessage}
        />
        <IconButton sx={{ ml: 1 }} onClick={update}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default UpdateMessageInput;
