import React from "react";
import { Grid, Typography } from "@mui/material";

const ChatBox = () => {
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      style={{ flexGrow: 1, padding: "16px" }}
    >
      <Typography variant="h4" style={{ margin: "16px 0" }}>
        Chat Box
      </Typography>
      {/* Your chat components can go here */}
    </Grid>
  );
};

export default ChatBox;
