import React, { useState } from "react";
import axios from "../../../utils/axios";
import styled from "@emotion/styled";
import {
  Avatar,
  Button,
  Modal,
  Typography,
  TextField,
  Stack,
} from "@mui/material";

import ModalBox from "../ModalBox";
import { useAuth } from "../../../contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import ChangePasswordModal from "./ChangePasswordModal";

const Column = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
}));

const SettingsModal = ({ open, onClose, user, setUpdateChats }) => {
  const { token } = useAuth();
  const { control, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const [changePasswordModalIsOpen, setChangePasswordModalIsOpen] =
    useState(false);

  const handleClose = () => {
    setSuccessMessage("");
    setErrorMessage("");
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      if (
        data.firstName !== user.firstName ||
        data.lastName !== user.lastName ||
        data.email !== user.email ||
        avatarUrl !== user.avatar
      ) {
        data.avatarUrl = avatarUrl;
        const response = await axios.put(`/user/me`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccessMessage("User information updated successfully.");
        setUpdateChats(response.data);
      }
      handleClose();
    } catch (error) {
      setErrorMessage("Failed to update user information. Please try again.");
    }
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
      }
    } else {
      setErrorMessage("Unsupported file type.");
    }
  };

  return (
    user && (
      <>
        <ChangePasswordModal
          open={changePasswordModalIsOpen}
          onClose={() => setChangePasswordModalIsOpen(false)}
        />
        <Modal open={open} onClose={handleClose}>
          <ModalBox>
            <Column>
              <Typography component="h2" variant="h5">
                Settings
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <Stack spacing={2} mt={2} width="100%">
                  <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Controller
                      name="avatar"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          onChange={handleAvatarUpload}
                          {...field}
                          style={{ display: "none" }}
                        />
                      )}
                    />
                    {avatarUrl ? (
                      <Avatar
                        alt="Avatar"
                        src={avatarUrl}
                        sx={{
                          width: 100,
                          height: 100,
                          my: 1,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          document.getElementById("avatar-upload").click()
                        }
                      />
                    ) : (
                      <Avatar
                        alt="Avatar"
                        sx={{
                          width: 100,
                          height: 100,
                          my: 1,
                          cursor: "pointer",
                          background: "gray",
                          color: "white",
                        }}
                        onClick={() =>
                          document.getElementById("avatar-upload").click()
                        }
                      />
                    )}
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
                    {avatarUrl && (
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => setAvatarUrl(null)}
                      >
                        Delete profile image
                      </Button>
                    )}
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Controller
                      name="firstName"
                      control={control}
                      defaultValue={user.firstName}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="First Name"
                          variant="outlined"
                          fullWidth
                          error={!!fieldState.error}
                          helperText={
                            fieldState.error ? fieldState.error.message : null
                          }
                        />
                      )}
                      rules={{ required: "First name is required" }}
                    />
                    <Controller
                      name="lastName"
                      control={control}
                      defaultValue={user.lastName}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="Last Name"
                          variant="outlined"
                          fullWidth
                          error={!!fieldState.error}
                          helperText={
                            fieldState.error ? fieldState.error.message : null
                          }
                        />
                      )}
                      rules={{ required: "Last name is required" }}
                    />
                  </Stack>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue={user.email}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Email"
                        variant="outlined"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={
                          fieldState.error ? fieldState.error.message : null
                        }
                      />
                    )}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Entered value does not match email format",
                      },
                    }}
                  />
                  {errorMessage && (
                    <Typography color="error">{errorMessage}</Typography>
                  )}
                  {successMessage && (
                    <Typography color="primary">{successMessage}</Typography>
                  )}
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setChangePasswordModalIsOpen(true)}
                  >
                    Change password
                  </Button>
                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={handleClose} fullWidth>
                      Close
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Update
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Column>
          </ModalBox>
        </Modal>
      </>
    )
  );
};

export default SettingsModal;
