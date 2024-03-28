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
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useAuth } from "../../contexts/AuthContext";
import SearchInput from "./SearchInput";

const HeaderAppBar = styled(AppBar)({
  zIndex: (theme) => theme.zIndex.drawer + 1,
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
}));

const Header = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
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
  };

  return (
    <HeaderAppBar position="fixed">
      <HeaderToolbar>
        <Typography variant="h6">WebChat</Typography>
        <SearchInput />
        <AvatarIconButton
          edge="end"
          aria-label="account of current user"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          color="inherit"
        >
          <Avatar
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
              sx={{ width: 64, height: 64 }}
            />
            <Typography
              variant="h6"
              sx={{ mt: 1 }}
            >{`${user.firstName} ${user.lastName}`}</Typography>
            <Typography variant="subtitle1">{user.email}</Typography>
          </UserInfoMenuItem>
          <Divider />
          <MenuItemWrapper>
            <SettingsIcon />
            Settings
          </MenuItemWrapper>
          <MenuItemWrapper>
            <PersonIcon />
            Profile
          </MenuItemWrapper>
          <MenuItemWrapper onClick={handleLogout}>
            <ExitToAppIcon />
            Logout
          </MenuItemWrapper>
        </Menu>
      </HeaderToolbar>
    </HeaderAppBar>
  );
};

export default Header;
