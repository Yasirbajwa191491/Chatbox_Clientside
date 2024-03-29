import React, { Fragment } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "../../../../components/Avatar";
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from "react-redux";
import { Alert } from "@mui/material";

import axios from "axios";
interface GroupChatDetails {
    groupId: string;
    groupName: string;
    participants: Array<{
        _id: string;
        username: string;
        email: string;
    }>;
    admin: {
        _id: string;
        username: string;
        email: string;
    };
}

interface Props {
    isDialogOpen: boolean;
    closeDialogHandler: () => void;
    groupDetails: GroupChatDetails;
    currentUserId: string;
}

const GroupParticipantsDialog = ({
    isDialogOpen,
    closeDialogHandler,
    groupDetails,
    currentUserId
}: Props) => {
    const dispatch = useDispatch();
    const handleCloseDialog = () => {
        closeDialogHandler();
    };
    
    const removeParticipantHandler=async(id:any)=>{
        const response=await axios.delete("http://localhost:8000/api/group-chat/remove_participant/"+id+"/"+groupDetails.groupId)
        if(response.data.message==="Participant removed"){
            groupDetails.participants=  groupDetails.participants.filter((par)=>{
                return par._id !==id
            })

            window.location.reload();
        }
     }
    return (
        <div>
            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>
                    <Typography>{groupDetails.groupName}</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography>
                            {groupDetails.participants.length}{" "}
                            {groupDetails.participants.length > 1
                                ? "Participants"
                                : "Participant"}
                        </Typography>
                    </DialogContentText>
                    <List
                        sx={{
                            width: "100%",
                            maxWidth: 300,
                            bgcolor: "background.paper",
                        }}
                    >
                        {groupDetails.participants.map((participant) => {
                            
                            return (
                                <Fragment key={participant._id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar
                                                username={participant.username}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${participant.username} ${
                                                participant._id ===
                                                currentUserId
                                                    ? "(You)"
                                                    : ""
                                            }`}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{
                                                            display: "inline",
                                                        }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {participant.email}
                                                    </Typography>
                                                    {` ${
                                                        participant._id ===
                                                        groupDetails.admin?._id
                                                            ? " — Group Admin"
                                                            : ""
                                                    }`}
                                                     {
                                                        currentUserId ===
                                                        groupDetails.admin?._id
                                                            ? ( participant._id !==groupDetails.admin?._id && <DeleteIcon onClick={()=>removeParticipantHandler(participant._id)}  />)
                                                            : ""
                                                    }
                                                   
                                                </React.Fragment>
                                               
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </Fragment>
                            );
                        })}
                    </List>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default GroupParticipantsDialog;
