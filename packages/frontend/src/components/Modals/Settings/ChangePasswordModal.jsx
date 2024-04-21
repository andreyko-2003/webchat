import React, { useState } from "react";
import { Box, Button, Modal, Typography, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import ModalBox from "../ModalBox";
import axios from "../../../utils/axios.js";
import { useAuth } from "../../../contexts/AuthContext";

const ChangePasswordModal = ({ open, onClose }) => {
  const { control, handleSubmit, reset } = useForm();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useAuth();

  const handleFormSubmit = async (data) => {
    if (data.oldPassword !== data.newPassword) {
      try {
        await axios.put("/user/password", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setErrorMessage("");
        setSuccessMessage("Password was changed successfully");
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setErrorMessage("Passwords do not match");
        } else {
          setErrorMessage("Password was not changed");
        }
      }
    } else {
      setErrorMessage("Old and new passwords are equal");
    }
  };

  const handleClose = () => {
    reset();
    setSuccessMessage("");
    setErrorMessage("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalBox>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Controller
              name="oldPassword"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Old Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={
                    fieldState.error ? fieldState.error.message : null
                  }
                />
              )}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "The password is too short.",
                },
              }}
            />
            <Controller
              name="newPassword"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="New Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={
                    fieldState.error ? fieldState.error.message : null
                  }
                />
              )}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "The password is too short.",
                },
              }}
            />
          </Box>
          {errorMessage && (
            <Typography color="error" mt={2}>
              {errorMessage}
            </Typography>
          )}
          {successMessage && (
            <Typography color="primary" mt={2}>
              {successMessage}
            </Typography>
          )}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              style={{ marginLeft: 10 }}
            >
              Change Password
            </Button>
          </Box>
        </form>
      </ModalBox>
    </Modal>
  );
};

export default ChangePasswordModal;
