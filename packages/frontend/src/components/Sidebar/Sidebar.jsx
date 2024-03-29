import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/system";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const StyledSidebar = styled(Box)({
  width: "100%",
  height: "calc(100vh - 64px)",
  display: "flex",
  flexDirection: "column",
  borderRight: "1px solid #ccc",
  overflowY: "scroll",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#bbb",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#888",
  },
});

const Sidebar = ({ user, currentChat, setCurrentChat }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/chat", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChats(response.data);
      } catch (err) {
        setError("Cannot get chats");
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [token, currentChat]);

  return (
    <StyledSidebar>
      {loading ? (
        <LinearProgress />
      ) : error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : (
        <List sx={{ flexGrow: 1 }}>
          {chats && chats.length > 0 ? (
            chats.map((chat, index) => (
              <React.Fragment key={index}>
                {chat.users.map(
                  (chatUser) =>
                    user._id !== chatUser._id && (
                      <React.Fragment key={chatUser._id}>
                        <ListItem
                          button
                          onClick={() => setCurrentChat(chat)}
                          sx={{
                            backgroundColor:
                              chat._id === currentChat._id
                                ? "#31473A30"
                                : "inherit",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Avatar
                              alt={`${chatUser.firstName} ${chatUser.lastName}`}
                              src={chatUser.avatar}
                              sx={{ marginRight: "8px" }}
                            />
                            <div>
                              <Typography variant="body1">
                                {`${chatUser.firstName} ${chatUser.lastName}`}
                              </Typography>
                              <Typography variant="body2">
                                {chatUser.lastMessage}
                              </Typography>
                            </div>
                          </Box>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    )
                )}
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body1">
              You don't have any chats. Use search to find.
            </Typography>
          )}
        </List>
      )}
    </StyledSidebar>
  );
};

export default Sidebar;
