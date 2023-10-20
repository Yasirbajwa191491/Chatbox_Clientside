import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddMembersToGroupDialog from "./AddMembersToGroupDialog";
import { useAppSelector } from "../../../../store";
import GroupParticipantsDialog from "./GroupParticipantsDialog";
import { deleteGroupAction, leaveGroupAction } from "../../../../actions/groupChatActions";
import { removeFriendAction } from "../../../../actions/friendActions";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function ChatDropDown() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [open1, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);

    const {
        chat: { chosenGroupChatDetails, chosenChatDetails },
        auth: {userDetails}
    } = useAppSelector((state) => state);
    const dispatch = useDispatch();

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleParticipantsOpenDialog = () => {
        setParticipantsDialogOpen(true);
    };

    const handleParticipantsCloseDialog = () => {
        setParticipantsDialogOpen(false);
    };

    const handleLeaveGroup = () => {
        
        if(chosenGroupChatDetails) {
            dispatch(leaveGroupAction({
            groupChatId: chosenGroupChatDetails.groupId
        }))
        }
    };

    const handleDeleteGroup = () => {
        if (chosenGroupChatDetails) {
            dispatch(
                deleteGroupAction({
                    groupChatId: chosenGroupChatDetails.groupId,
                    groupChatName: chosenGroupChatDetails.groupName
                })
            );
        }
    };


    const handleRemoveFriend = () => {
        
        if(chosenChatDetails) {
            dispatch(removeFriendAction({
                friendId: chosenChatDetails.userId,
                friendName: chosenChatDetails.username
            }));
        }
    }
    const font=localStorage.getItem("front")
    console.log(chosenChatDetails,'chosenChatDetails')
    return (
        <>
            <div>
            <div>
      <Modal
        open={open1}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            User Detail of ({chosenChatDetails?.username})
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <p> Department: {chosenChatDetails?.department}</p>
          <p> Section: {chosenChatDetails?.section}</p> 
           <p> Designation: {chosenChatDetails?.designation}</p>
           <p> User ID: {chosenChatDetails?.name}</p>
           
          </Typography>
        </Box>
      </Modal>
    </div>
                <IconButton
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    style={{ color: "white", marginLeft: "0px" }}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    MenuListProps={{
                        "aria-labelledby": "basic-button",
                    }}
                >
                    {chosenGroupChatDetails &&
                        (chosenGroupChatDetails.admin._id ===
                        userDetails?._id ? (
                            <>
                                <MenuItem onClick={handleOpenDialog}>
                                {font==="arabic"?"إضافة أعضاء":"Add Members"}
                                </MenuItem>
                                <MenuItem onClick={handleDeleteGroup}>
                                {font==="arabic"?"حذف المجموعة":"Delete Group"}

                                </MenuItem>
                            </>
                        ) : (
                            <MenuItem onClick={handleLeaveGroup}>
                                {font==="arabic"?"غادر المجموعة":"Leave Group"}
                            </MenuItem>
                        ))}

                    {chosenGroupChatDetails && (
                        <MenuItem onClick={handleParticipantsOpenDialog}>
                            {font==="arabic"?"عرض المشاركين":"View Participants"} (
                            {chosenGroupChatDetails.participants.length})
                        </MenuItem>
                    )}

                    {chosenChatDetails && (
                        <MenuItem onClick={handleRemoveFriend}>
                            {font==="arabic"?"أزالة صديق":"Remove Friend"}
                        </MenuItem>
                    )}
                    {chosenChatDetails && (
                        <MenuItem onClick={handleOpen}>
                            {font==="arabic"?"عرض التفاصيل":"View Details"}
                        </MenuItem>
                    )}
                </Menu>
            </div>

            {chosenGroupChatDetails && userDetails && (
               
                
                <>
                    <AddMembersToGroupDialog
                        isDialogOpen={isDialogOpen}
                        closeDialogHandler={handleCloseDialog}
                    />
                    <GroupParticipantsDialog
                        isDialogOpen={participantsDialogOpen}
                        closeDialogHandler={handleParticipantsCloseDialog}
                        groupDetails={chosenGroupChatDetails}
                        currentUserId={userDetails._id}
                    />
                </>
            )}
        </>
    );
}
