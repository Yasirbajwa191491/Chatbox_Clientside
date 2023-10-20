import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { createNewRoom } from "../../../socket/roomHandler";

const CreateRoomButton = ({ isUserInRoom }: { isUserInRoom: boolean }) => {
    const createNewRoomHandler = () => {
        createNewRoom();
    };

    return (
        <Button
            disabled={isUserInRoom}
            onClick={createNewRoomHandler}
            style={{
                width: "48px",
                height: "48px",
                borderRadius: "16px",
                margin: 0,
                padding: 0,
                minWidth: 0,
                marginTop: "10px",
                color: "white",
                backgroundColor: "#1A2B63",
            }}
        >
            <AddIcon />
        </Button>
    );
};

export default CreateRoomButton;
