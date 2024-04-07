import React, { useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { useSocket } from "../../contexts/SocketContext";

const MessageMenu = ({ message, user, children, setEditMessage }) => {
  const { socket } = useSocket();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuRef = useRef(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditMessage = () => {
    setEditMessage(message);
  };

  const handleDeleteMessage = () => {
    socket.emit("deleteMessage", message._id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAnchorEl(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Box ref={menuRef} onClick={handleMenuOpen}>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {message.sender._id === user._id ? (
          [
            <MenuItem key="edit" onClick={handleEditMessage}>
              <EditIcon sx={{ width: 24, height: 24, mr: 1 }} />
              <Typography>Edit</Typography>
            </MenuItem>,
            <MenuItem key="delete" onClick={handleDeleteMessage}>
              <DeleteIcon sx={{ width: 24, height: 24, mr: 1 }} />
              <Typography>Delete</Typography>
            </MenuItem>,
          ]
        ) : (
          <MenuItem onClick={handleMenuClose}>
            <DeleteIcon sx={{ width: 24, height: 24, mr: 1 }} />
            <Typography>Delete</Typography>
          </MenuItem>
        )}
      </Menu>
      {children}
    </Box>
  );
};

export default MessageMenu;
