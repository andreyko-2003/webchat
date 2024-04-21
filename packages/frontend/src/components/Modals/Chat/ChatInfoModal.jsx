import React from "react";
import axios from "../../../utils/axios.js";
import styled from "@emotion/styled";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { getChatInfo } from "../../../utils/chat";
import ModalBox from "../ModalBox";
import { useAuth } from "../../../contexts/AuthContext";

const Column = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
}));

const ChatInfoModal = ({
  open,
  close,
  chat,
  user,
  setCurrentChat,
  setUpdateChats,
}) => {
  const info = getChatInfo(chat, user);
  const { token } = useAuth();

  const deleteChat = async () => {
    try {
      const response = await axios.delete(`/chat/${chat._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      chat._id === response.data._id && setCurrentChat({});
      setUpdateChats(response);
      close();
    } catch (error) {}
  };

  return (
    <Modal open={open} onClose={close}>
      <ModalBox>
        <Column>
          <Avatar
            alt={info.title}
            src={info.avatar}
            sx={{
              width: 100,
              height: 100,
              background: "gray",
              color: "white",
            }}
          />
          <Typography variant="h6" sx={{ mt: 1 }}>
            {info.title}
          </Typography>
          <Typography variant="subtitle1">{info.email}</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
              width: "100%",
            }}
          >
            <Button onClick={close} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={deleteChat}
              startIcon={<DeleteOutlineIcon />}
              sx={{ ml: 2 }}
            >
              Delete
            </Button>
          </Box>
        </Column>
      </ModalBox>
    </Modal>
  );
};

export default ChatInfoModal;
