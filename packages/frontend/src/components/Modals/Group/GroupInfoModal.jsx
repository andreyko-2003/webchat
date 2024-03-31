import React from "react";
import { Avatar, Modal, Typography, Button, Box } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import axios from "axios";
import ModalBox from "../ModalBox";
import { getChatInfo } from "../../../utils/chat";
import styled from "@emotion/styled";
import UpdateGroup from "./UpdateGroup";
import { useAuth } from "../../../contexts/AuthContext";

const Column = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
}));

const UserBox = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
  width: "100%",
}));

const GroupAvatar = styled(Avatar)(({ theme }) => ({
  marginRight: theme.spacing(2),
  background: "gray",
  color: "white",
  width: 100,
  height: 100,
}));

const GroupInfoModal = ({
  open,
  close,
  group,
  user,
  setUpdateChats,
  setCurrentChat,
}) => {
  const info = getChatInfo(group, user);
  const isAdmin = group.groupAdmins.some((admin) => admin._id === user._id);
  const { token } = useAuth();

  const leaveGroup = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/chat/group/leave",
        { chatId: group._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUpdateChats(response);
      group._id === response.data._id && setCurrentChat({});
      close();
    } catch (error) {}
  };

  const deleteGroup = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/chat/${group._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      group._id === response.data._id && setCurrentChat({});
      setUpdateChats(response);
      close();
    } catch (error) {}
  };

  return (
    <Modal open={open} onClose={close}>
      <ModalBox>
        <Column>
          {!isAdmin ? (
            <>
              <GroupAvatar alt={info.title} src={info.avatar}>
                <GroupsIcon sx={{ width: 60, height: 60 }} />
              </GroupAvatar>
              <Typography variant="h6" sx={{ mt: 1 }}>
                {info.title}
              </Typography>
              <Typography variant="subtitle1">{info.description}</Typography>
              <Typography variant="h5" sx={{ mt: 2 }}>
                Users
              </Typography>
              {group.groupAdmins.map((admin) => (
                <UserBox key={admin._id}>
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
                </UserBox>
              ))}
              {group.users.map((contact) => (
                <UserBox key={contact._id}>
                  <Avatar
                    alt={contact.email}
                    src={contact.avatar}
                    sx={{ mr: 2, background: "gray", color: "white" }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>{`${contact.firstName} ${contact.lastName}`}</Typography>
                    <Typography>{contact.email}</Typography>
                  </Box>
                </UserBox>
              ))}
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button
                  onClick={close}
                  variant="outlined"
                  color="primary"
                  sx={{ ml: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ ml: 2 }}
                  onClick={leaveGroup}
                >
                  Leave
                </Button>
              </Box>
            </>
          ) : (
            <UpdateGroup
              handleClose={close}
              user={user}
              currentGroup={group}
              setUpdateChats={setUpdateChats}
              setCurrentChat={setCurrentChat}
              onLeave={leaveGroup}
              onDelete={deleteGroup}
            />
          )}
        </Column>
      </ModalBox>
    </Modal>
  );
};

export default GroupInfoModal;
