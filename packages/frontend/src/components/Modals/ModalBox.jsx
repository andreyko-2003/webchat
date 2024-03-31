import styled from "@emotion/styled";
import { Box } from "@mui/material";

const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  minWidth: 420,
  borderRadius: "24px",
  maxHeight: 600,
  overflowY: "scroll",
  "&::-webkit-scrollbar": {
    display: "none",
  },
}));

export default ModalBox;
