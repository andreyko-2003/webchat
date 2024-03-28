import React from "react";
import Header from "../components/Header/Header";
import { useAuth } from "../contexts/AuthContext";
import { CircularProgress } from "@mui/material";

function Chat() {
  const { user } = useAuth();
  return user ? (
    <>
      <Header user={user} />
    </>
  ) : (
    <CircularProgress />
  );
}

export default Chat;
