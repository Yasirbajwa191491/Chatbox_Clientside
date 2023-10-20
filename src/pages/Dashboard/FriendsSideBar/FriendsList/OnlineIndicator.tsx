import React from "react";
import { Box } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const OnlineIndicator = ({status}:any) => {

  var colors="#3ba55d"

  if(status==="online"){
    colors="#3ba55d"
  }
  else if(status==="offline"){
    colors="red"
  }
  else if(status==="busy"){
    colors="yellow"
  }
  return (
    <Box
      sx={{
        color: colors,
        display: "flex",
        alignItems: "center",
        position: "absolute",
        right: "5px",
      }}
    >
      <FiberManualRecordIcon />
    </Box>
  );
};

export default OnlineIndicator;
