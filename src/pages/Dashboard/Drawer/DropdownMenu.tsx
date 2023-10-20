import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/system";
import { logoutUser } from "../../../actions/authActions";
import { useAppSelector } from "../../../store";
import { setAudioOnlyRoom } from "../../../actions/roomActions";
import RoomParticipantsDialog from "./RoomParticipantsDialog";
import {Button,Alert} from "@mui/material";
import axios from "axios";
import { disconection } from "../../../socket/socketConnection";

const Wrapper = styled("div")({
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
});

const Label = styled("p")({
    color: "#b9bbbe",
    textTransform: "uppercase",
    fontWeight: "600",
    fontSize: "16px",
});

const Input = styled("input")({
    flexGrow: 1,
    height: "40px",
    border: "1px solid black",
    borderRadius: "5px",
    color: "#dcddde",
    background: "#35393f",
    margin: 0,
    fontSize: "16px",
    padding: "0 5px",
    outline: "none",
});
export default function DropDownMenu() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openModal,setOpenModal]=useState(false)
    const [oldpassword,setOldPassword]=useState("")
    const [newpassword,setNewPassword]=useState("")
    const [userstatus,setUserStatus]=useState("online")
    const [passwordErr,setPassErr]=useState({
        msg:"",
        status:false
    })
    const [passwordSuccess,setPassSuccess]=useState(false)
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const { auth: { userDetails }, room: { audioOnly, roomDetails, isUserInRoom, } } = useAppSelector(state => state)
    const Admin=JSON.parse(localStorage.getItem("currentUser")!);
   
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

 const handleClick = async() => {
    await axios.patch("http://localhost:8000/api/auth/logoutStatus",{
        id:Admin?._id
    })
    disconection();
        dispatch(logoutUser());
    }
const changeStatusHandler=async()=>{

if(userstatus==="online"){
   setUserStatus("busy")
}else{
    setUserStatus("online")
}
const response=await axios.patch("http://localhost:8000/api/auth/changeStatus",{
    status:userstatus,_id:Admin?._id
})
if(response.status===200){
    
    let updatedData={...Admin,status:response?.data?.status}
    localStorage.setItem("currentUser",JSON.stringify(updatedData))
}
}
const handleResetPassword=async()=>{
    try {
       const response=await axios.patch("http://localhost:8000/api/auth/reset_password",{
       _id:Admin?._id,oldpassword,newpassword
       })
       if(response.data.message==="Password Updated"){
            setPassSuccess(true)
       }else{
setPassErr({...passwordErr,msg:response.data?.error,status:true})
       }
    } catch (error) {
        
    }
}
    const handleAudioOnlyChange = () => {
        dispatch(setAudioOnlyRoom(!audioOnly))
    }

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };
    const font=localStorage.getItem("front")
    useEffect(()=>{

    },[])
    return (
        <div>
            
         
            <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                style={{ color: "white", marginLeft: "20px" }}
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
                <MenuItem onClick={()=>setOpenModal(!openModal)}>
                {font==="arabic"?"أعد تعيين كلمة المرور":"Reset the Password"}
                </MenuItem>
                {
                   openModal===true&&   <MenuItem style={{display:"flex",flexDirection:"column"}}>
                <Wrapper>
              <Label>                {font==="arabic"?"كلمة المرور القديمة":"Old Password"} </Label>
              <Input type="password" autoComplete="off" placeholder="Enter your Old Password" name='password' value={oldpassword} onChange={(e)=>setOldPassword(e.target.value)} />
          </Wrapper>

          <Wrapper>
          <Label>                {font==="arabic"?"كلمة المرور الجديدة":"New Password"} </Label>
              <Input type="password" autoComplete="off" placeholder="Enter New password" name="password" value={newpassword} onChange={(e)=>setNewPassword(e.target.value)} />
          </Wrapper>
          <Button
                      variant="contained"
                      sx={{
                          bgcolor: "#1A2B63",
                          color: "white",
                          textTransform: "none",
                          fontSize: "16px",
                          fontWeight: 500,
                          width: "100%",
                          height: "40px",
                          margin: "20px 0px",
                      }}
                       onClick={handleResetPassword}
                  >
                                     {font==="arabic"?"أعد تعيين كلمة المرور":"Reset the Password"}
                  </Button>
                   </MenuItem>
                }
              <MenuItem>
              {passwordSuccess ? (
              <Alert onClose={()=>setPassSuccess(false)} sx={{ width: '30vw' }}>Password Updated</Alert>
            ) : null}
            {passwordErr.status ? (
              <Alert onClose={()=>setPassErr({...passwordErr,status:false})} sx={{ width: '30vw' }}>{passwordErr.msg}</Alert>
            ) : null}
              </MenuItem>
                {/* <MenuItem onClick={handleAudioOnlyChange}>
                    {audioOnly
                        ? "Audio Only Enabled (for Rooms)"
                        : "Audio Only Disabled (for Rooms)"}
                </MenuItem> */}
                <MenuItem onClick={changeStatusHandler}>
             {userstatus==="online"? (font==="arabic"?"التغيير إلى حالة الانشغال":"Change To Busy Status"):(font==="arabic"?"التغيير إلى حالة الاتصال بالإنترنت":"Change To Online Status")}   
                </MenuItem>
                {isUserInRoom && roomDetails && (
                    <MenuItem onClick={handleOpenDialog}>
                        Active Room ({roomDetails.roomCreator.username})
                    </MenuItem>
                )}
                <MenuItem onClick={handleClick}>
                {font==="arabic"?"تسجيل خروج":"Logout"}
 ({userDetails?.username})
                </MenuItem>
            </Menu>

            {roomDetails && userDetails && (
                <RoomParticipantsDialog
                    isDialogOpen={isDialogOpen}
                    closeDialogHandler={handleCloseDialog}
                    roomDetails={roomDetails}
                    currentUserId={userDetails._id}
                />
            )}
        </div>
    );
}
