import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/system";
import { useAuth } from "../../contexts/AuthContext";
import axios from "../../utils/axios";
import { getChatInfo } from "../../utils/chat";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationBox from "./NotificationBox";

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

const Sidebar = ({
  user,
  currentChat,
  setCurrentChat,
  updateChats,
  chats,
  setChats,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!chats) setLoading(true);
        const response = await axios.get("/chat", {
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
  }, [token, updateChats, setChats]);

  return (
    <StyledSidebar>
      {loading ? (
        <LinearProgress />
      ) : error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : (
        <List sx={{ flexGrow: 1, px: 1 }}>
          {chats && chats.length > 0 ? (
            chats.map((chat, index) => {
              const chatInfo = getChatInfo(chat, user);
              return (
                <React.Fragment key={index}>
                  <ListItem
                    button
                    onClick={() => setCurrentChat(chat)}
                    sx={{
                      borderRadius: 4,
                      backgroundColor:
                        chat._id === currentChat._id ? "#31473A30" : "inherit",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: "90%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          alt={chatInfo.title}
                          src={chatInfo.avatar}
                          sx={{
                            marginRight: "8px",
                            background: "gray",
                            color: "white",
                          }}
                        >
                          {chat.isGroupChat && !chat.avatar && <GroupsIcon />}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">
                            {chatInfo.title}
                          </Typography>
                          {chat.latestMessage &&
                            (chat.latestMessage.text ? (
                              <Typography variant="body2">
                                {chat.latestMessage.text.length > 20
                                  ? `${chat.latestMessage.text.substr(0, 20)}...`
                                  : chat.latestMessage.text}
                              </Typography>
                            ) : (
                              chat.latestMessage.attachments &&
                              chat.latestMessage.attachments.length > 0 && (
                                <Typography variant="body2">
                                  {
                                    chat.latestMessage.attachments[0]
                                      .originalname
                                  }
                                </Typography>
                              )
                            ))}
                        </Box>
                      </Box>
                      <Box sx={{ width: "10%" }}>
                        <NotificationBox chatId={chat._id} />
                      </Box>
                    </Box>
                  </ListItem>
                </React.Fragment>
              );
            })
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
