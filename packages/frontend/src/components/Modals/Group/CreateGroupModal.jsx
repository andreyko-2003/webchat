import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  Avatar,
  Modal,
  Box,
  CircularProgress,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import CloseIcon from "@mui/icons-material/Close";
import AddUserSearchInput from "./AddUserSearchInput";

const CreateGroupModal = ({
  isOpen,
  handleClose,
  contacts,
  user,
  setUpdateChats,
}) => {
  const { control, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const { token } = useAuth();

  const handleCreateGroup = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/chat/group",
        {
          ...data,
          avatar: avatarUrl,
          users: selectedContacts,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdateChats(response.data);
      handleClose();
    } catch (error) {
      setErrorMessage("Error creating group. Please try again later.");
      console.error("Error creating group:", error);
    }
    setIsLoading(false);
  };

  const handleAvatarUpload = async (event) => {
    setErrorMessage("");
    const file = event.target.files[0];
    if (file.type === "image/jpeg" || file.type === "image/png") {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "webchat");
      formData.append("cloud_name", "dels8vm8i");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dels8vm8i/image/upload",
          formData
        );
        setAvatarUrl(response.data.secure_url);
      } catch (error) {
        setErrorMessage(
          "Error uploading file. Please try adding the avatar later."
        );
        console.error("Error uploading file:", error);
      }
    } else {
      setErrorMessage("Unsupported file type.");
    }
  };

  const addUser = (contact) => {
    setSelectedContacts((prevContacts) => [...prevContacts, contact]);
  };

  const deleteUser = (userId) => {
    setSelectedContacts((prevContacts) =>
      prevContacts.filter((contact) => contact._id !== userId)
    );
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          minWidth: 320,
          maxWidth: 480,
          borderRadius: 8,
          maxHeight: 600,
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Typography component="h2" variant="h5">
          Create Group
        </Typography>
        <form onSubmit={handleSubmit(handleCreateGroup)}>
          <Stack direction="column" alignItems="center" spacing={2}>
            <label htmlFor="avatar-upload" style={{ display: "none" }}>
              <input
                id="avatar-upload"
                name="avatar-upload"
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: "none" }}
                onChange={handleAvatarUpload}
              />
            </label>
            <Avatar
              alt="Group Avatar"
              src={avatarUrl || ""}
              sx={{
                width: 60,
                height: 60,
                cursor: "pointer",
                background: "gray",
                color: "white",
              }}
              onClick={() => document.getElementById("avatar-upload").click()}
            >
              <GroupsIcon sx={{ width: 40, height: 40 }} />
            </Avatar>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleAvatarUpload}
              style={{ display: "none" }}
            />
          </Stack>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: "Group title is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                variant="outlined"
                label="Group title"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : null}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label="Group description"
                fullWidth
                multiline
                rows={3}
                margin="normal"
              />
            )}
          />

          <AddUserSearchInput
            onSubmit={addUser}
            selectedContacts={selectedContacts}
          />

          <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
            <Avatar
              alt={user.email}
              src={user.avatar}
              sx={{ mr: 2, background: "gray", color: "white" }}
            />
            <div>
              <Typography>{`${user.firstName} ${user.lastName}`}</Typography>
              <Typography>{user.email}</Typography>
            </div>
          </Box>

          {selectedContacts.map((contact) => (
            <Box
              key={contact._id}
              sx={{ display: "flex", alignItems: "center", my: 1 }}
            >
              <Avatar
                alt={contact.email}
                src={contact.avatar}
                sx={{ mr: 2, background: "gray", color: "white" }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography>{`${contact.firstName} ${contact.lastName}`}</Typography>
                <Typography>{contact.email}</Typography>
              </Box>
              <Button onClick={() => deleteUser(contact._id)}>
                <CloseIcon />
              </Button>
            </Box>
          ))}

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              color="primary"
              sx={{ ml: 2 }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ ml: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : "Create"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateGroupModal;
