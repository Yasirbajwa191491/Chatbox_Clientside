import React from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";
import Robot from "./police.jpeg";

const Wrapper = styled("div")({
    flexGrow: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    textAlign: "center"
});
const containerStyle = {
    // backgroundImage: "url('./live-chat_512px.png')",
    backgroundRepeat:"no-repeat",
    backgroundPosition: 'center center',
    // Other styling properties
  };
  const font=localStorage.getItem("front")
const WelcomeMessage = () => {
    return (
        <>
        <Wrapper style={containerStyle}>
        <div >
        <img src={"./live-chat_512px.png"} alt="robot greeting welcome" style={{ height: "15rem" }}/>
        </div>
           
        </Wrapper>
      
        <Typography variant="h6" sx={{ color: "white",position:"fixed",bottom:10,left:"45%" }}>
            {font==="arabic"?"لبدء الدردشة - اختر صديقًا للمحادثة":"To start chatting - select a friend for conversation"}
            </Typography>
            
        </>
    );
};

export default WelcomeMessage;