import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { useAuth } from "../../../contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import AddUserSearchInput from "../../Inputs/AddUserSearchInput";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const UpdateGroup = ({
  handleClose,
  contacts,
  user,
  setUpdateChats,
  currentGroup,
  onLeave,
  onDelete,
  setCurrentChat,
}) => {
  const { control, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(currentGroup.avatar);
  const [isLoading, setIsLoading] = useState(false);
  const [groupAdmins, setGroupAdmins] = useState(currentGroup.groupAdmins);
  const [selectedContacts, setSelectedContacts] = useState(currentGroup.users);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElTitle, setAnchorElTitle] = useState(null);

  const { token } = useAuth();

  const updateFields = (data) => {
    setAvatarUrl(data.avatar);
    setSelectedContacts(data.users);
    setGroupAdmins(data.groupAdmins);
  };

  useEffect(() => {
    updateFields(currentGroup);
  }, [currentGroup]);

  const handleUpdateGroup = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        "/chat/group",
        {
          ...data,
          chatId: currentGroup._id,
          avatar: avatarUrl,
          users: selectedContacts,
          groupAdmins: groupAdmins,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdateChats(response.data);
      setCurrentChat(response.data);
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
      if (file.size > 10485760) { 
        setErrorMessage("File size exceeds the limit of 10MB.");
      } else {
        const formData = new FormData();
        formData.append("file", file);
  
        try {
          const response = await axios.post("/upload", formData);
          setAvatarUrl(response.data.url);
        } catch (error) {
          setErrorMessage(
            "Error uploading file. Please try adding the avatar later."
          );
        }
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

  const handleMakeAdmin = (user) => {
    setGroupAdmins((prevAdmins) => [...prevAdmins, user]);
    setSelectedContacts((prevContacts) =>
      prevContacts.filter((contact) => contact._id !== user._id)
    );
    setAnchorEl(null);
    setAnchorElTitle(null);
  };

  const handleRemoveAdmin = (user) => {
    setGroupAdmins((prevAdmins) =>
      prevAdmins.filter((admin) => admin._id !== user._id)
    );
    setSelectedContacts((prevContacts) => [...prevContacts, user]);
    setAnchorEl(null);
    setAnchorElTitle(null);
  };

  const handleMenuOpen = (event, isAdmin) => {
    setAnchorEl(event.currentTarget);
    setAnchorElTitle(isAdmin ? "admin" : "user");
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAnchorElTitle(null);
  };

  return (
    <form onSubmit={handleSubmit(handleUpdateGroup)}>
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
        defaultValue={currentGroup.chatName}
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
        defaultValue={currentGroup.chatDescription}
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
        selectedContacts={selectedContacts.concat(groupAdmins)}
      />

      {groupAdmins.map((admin) => (
        <Box
          key={admin._id}
          sx={{ display: "flex", alignItems: "center", my: 1 }}
        >
          <Avatar
            alt={admin.email}
            src={admin.avatar}
            sx={{ mr: 2, background: "gray", color: "white" }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography>{`${admin.firstName} ${admin.lastName}`}</Typography>
            <Typography>{admin.email}</Typography>
          </Box>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" color="primary">
              Admin
            </Typography>
          </Box>
          {user._id !== admin._id && (
            <>
              <Button onClick={(e) => handleMenuOpen(e, true)}>
                <MoreVertIcon />
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && anchorElTitle === "admin"}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleRemoveAdmin(admin)}>
                  Remove Admin
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      ))}

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
          <Button onClick={(e) => handleMenuOpen(e, false)}>
            <MoreVertIcon />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && anchorElTitle === "user"}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMakeAdmin(contact)}>
              Make Admin
            </MenuItem>
          </Menu>
        </Box>
      ))}

      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={onDelete}
          startIcon={<DeleteOutlineIcon />}
        >
          Delete
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ ml: 2 }}
          onClick={onLeave}
        >
          Leave
        </Button>
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
          {isLoading ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </Box>
    </form>
  );
};

export default UpdateGroup;
