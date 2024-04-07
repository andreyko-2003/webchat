import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useAuth } from "../../contexts/AuthContext";
import SearchInput from "../Inputs/SearchInput";
import CreateGroupModal from "../Modals/Group/CreateGroupModal";
import { useSocket } from "../../contexts/SocketContext";
import SettingsModal from "../Modals/Settings/SettingsModal";

const HeaderAppBar = styled(AppBar)({
  zIndex: (theme) => theme.zIndex.drawer + 1,
  height: "64px",
});

const HeaderToolbar = styled(Toolbar)({
  justifyContent: "space-between",
});

const AvatarIconButton = styled(IconButton)({
  cursor: "pointer",
  "& .MuiIconButton-label": {
    fontSize: "1.5rem",
  },
});

const UserInfoMenuItem = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
}));

const MenuItemWrapper = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  minWidth: 260,
}));

const Header = ({ user, setCurrentChat, setUpdateChats, contacts }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [createGroupModalIsOpen, setCreateGroupModalIsOpen] = useState(false);
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false);
  const { socket } = useSocket();
  const { logout } = useAuth();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    socket.emit("logout", user._id);
  };

  const openCreateGroupModal = () => {
    setCreateGroupModalIsOpen(true);
  };

  const closeCreateGroupModal = () => {
    setCreateGroupModalIsOpen(false);
  };

  const openSettingsModal = () => {
    setSettingsModalIsOpen(true);
  };

  const closeSettingsModal = () => {
    setSettingsModalIsOpen(false);
  };

  return (
    <>
      {createGroupModalIsOpen && (
        <CreateGroupModal
          isOpen={createGroupModalIsOpen}
          handleClose={closeCreateGroupModal}
          contacts={contacts}
          user={user}
          setUpdateChats={setUpdateChats}
        />
      )}
      {settingsModalIsOpen && (
        <SettingsModal
          open={settingsModalIsOpen}
          onClose={closeSettingsModal}
          user={user}
          setUpdateChats={setUpdateChats}
        />
      )}
      <HeaderAppBar position="fixed">
        <HeaderToolbar>
          <Typography variant="h6">WebChat</Typography>
          <SearchInput
            setCurrentChat={setCurrentChat}
            setUpdateChats={setUpdateChats}
          />
          <AvatarIconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <Avatar
              sx={{ background: "gray", color: "white" }}
              alt={`${user.firstName} ${user.lastName}`}
              src={user.avatar}
            />
          </AvatarIconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <UserInfoMenuItem>
              <Avatar
                alt={`${user.firstName} ${user.lastName}`}
                src={user.avatar}
                sx={{
                  width: 64,
                  height: 64,
                  background: "gray",
                  color: "white",
                }}
              />
              <Typography
                variant="h6"
                sx={{ mt: 1 }}
              >{`${user.firstName} ${user.lastName}`}</Typography>
              <Typography variant="subtitle1">{user.email}</Typography>
            </UserInfoMenuItem>
            <Divider />
            <MenuItemWrapper onClick={openCreateGroupModal}>
              <AddIcon />
              New group
            </MenuItemWrapper>
            <MenuItemWrapper onClick={openSettingsModal}>
              <SettingsIcon />
              Settings
            </MenuItemWrapper>
            <MenuItemWrapper onClick={handleLogout}>
              <ExitToAppIcon />
              Logout
            </MenuItemWrapper>
          </Menu>
        </HeaderToolbar>
      </HeaderAppBar>
    </>
  );
};

export default Header;
