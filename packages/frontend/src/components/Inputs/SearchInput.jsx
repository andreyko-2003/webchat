import React, { useState, useEffect, useRef } from "react";
import {
  InputBase,
  CircularProgress,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";
import axios from "../../utils/axios.js";
import { useAuth } from "../../contexts/AuthContext";

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: theme.palette.primary.main,
  border: `2px solid ${theme.palette.secondary.main}`,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(1),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "300px",
    marginLeft: 0,
    marginRight: 0,
  },
  display: "flex",
  alignItems: "center",
}));

const SearchIconContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.secondary.main,
}));

const SearchInputBase = styled(InputBase)(({ theme }) => ({
  padding: "2px",
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  transition: theme.transitions.create("width"),
  width: "100%",
  color: theme.palette.secondary.main,
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  position: "absolute",
  right: 0,
  top: "50%",
  transform: "translateY(-50%)",
  marginRight: theme.spacing(2),
  color: theme.palette.secondary.main,
  marginTop: "-10px",
}));

const MenuItem = styled("div")({
  display: "flex",
  alignItems: "center",
  padding: "8px",
  backgroundColor: "white",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "4px",
  marginBottom: "4px",
  color: "#000000",
  zIndex: "200",
});

const SearchInput = ({ setCurrentChat, setUpdateChats }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAuth();
  const inputRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim() !== "") {
        setLoading(true);
        try {
          const response = await axios.get(`/user/${searchQuery}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSearchResults(response.data);
          setLoading(false);
          setIsOpen(true);
        } catch (error) {
          console.error("Error fetching search results", error);
          setLoading(false);
        }
      } else {
        setSearchResults([]);
        setLoading(false);
        setIsOpen(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, token]);

  const handleInputChange = (event) => {
    setLoading(!!event.target.value);
    setSearchQuery(event.target.value);
    setSearchResults([]);
  };

  const createChat = async (userId) => {
    try {
      const response = await axios.post(
        "/chat",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsOpen(false);
      setCurrentChat(response.data);
      setUpdateChats(response.data);
    } catch (error) {}
  };

  return (
    <SearchContainer>
      <SearchIconContainer>
        <SearchIcon />
      </SearchIconContainer>

      <SearchInputBase
        placeholder="Search user…"
        inputProps={{ "aria-label": "search" }}
        onChange={handleInputChange}
        inputRef={inputRef}
      />
      {loading && <LoadingSpinner size={20} />}
      {isOpen && (
        <Box
          style={{
            position: "absolute",
            top: "100%",
            width: "100%",
            zIndex: 999,
            padding: "4px",
          }}
        >
          {searchResults.length > 0
            ? searchResults.map((user) => (
                <MenuItem key={user._id} onClick={() => createChat(user._id)}>
                  <Avatar
                    alt={`${user.firstName} ${user.lastName}`}
                    src={user.avatar}
                    sx={{
                      marginRight: "8px",
                      background: "gray",
                      color: "white",
                    }}
                  />
                  <div>
                    <Typography>{`${user.firstName} ${user.lastName}`}</Typography>
                    <Typography>{user.email}</Typography>
                  </div>
                </MenuItem>
              ))
            : !loading &&
              searchQuery && (
                <MenuItem>
                  <Typography>No user found</Typography>
                </MenuItem>
              )}
        </Box>
      )}
    </SearchContainer>
  );
};

export default SearchInput;
