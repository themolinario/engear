import { CircularProgress } from "@mui/material";

const indicatorSize = 40;

export function PageLoader() {
  return (
    <CircularProgress
      size={indicatorSize}
      sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: `${-indicatorSize / 2}px`,
      marginLeft: `${-indicatorSize / 2}px`
    }} />
  );
}