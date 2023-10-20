import React from "react";
import { styled } from "@mui/system";

const AvatarPreview = styled("div")({
    height: "32px",
    width: "32px",
    backgroundColor: "#1A2B63",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "500",
    color: "white",
});

const Avatar = ({ username, large }: {
    username: string,
    large?: boolean,
}) => {
    return (
        <AvatarPreview style={large ? { height: "80px", width: "80px" } : {}}>
            {username}
        </AvatarPreview>
    );
};

export default Avatar;
