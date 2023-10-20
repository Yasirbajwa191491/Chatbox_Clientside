import {useEffect,useState} from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import OnlineIndicator from "./OnlineIndicator";
import Avatar from "../../../../components/Avatar";
import { setChosenChatDetails } from "../../../../actions/chatActions";
import { useAppSelector } from "../../../../store";
import { sendUserId,removeUserNotifications } from "../../../../socket/socketConnection";



const FriendsListItem = ({
    id,
    username,
    isOnline,
    email,
    department,
    section,
    designation,
    name,
    status=""
}) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));
    const dispatch = useDispatch();

    const { chosenChatDetails, typing } = useAppSelector((state) => state.chat);
    const { usernotifications } = useAppSelector((state) => state.friends);
// console.log(usernotifications,'user notifii.... ');
    const isTyping = typing.find((item) => item.userId === id);

    // if this friend is same as the person/user typing and this friend is not the one
    // we are currently chatting with(i.e, chosenChatDetails.userId)
    const isFriendTyping =
        isTyping && isTyping.typing && id !== chosenChatDetails?.userId;

    const isChatActive = chosenChatDetails?.userId === id;
    const Admin=JSON.parse(localStorage.getItem("currentUser"));


    useEffect(()=>{
   sendUserId({userId:id})
    },[id])
    return (
        <div>
            
  

 <Tooltip title={email}>
            <Button
                onClick={() => {
                    
                    dispatch(setChosenChatDetails({ userId: id, username,department,section,designation,name }));
                    removeUserNotifications({receiverUserId:id})
                }}
                style={{
                    width: "100%",
                    height: "42px",
                    marginTop: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    textTransform: "none",
                    color: "black",
                    position: "relative",
                    backgroundColor: isChatActive ? "#1A2B63" : "transparent",
                }}
            >
                {matches && <Avatar username={username} />}

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                    }}
                >
                    <Typography
                        style={{
                            marginLeft: "7px",
                            fontWeight: 700,
                            color: "#8e9297",
                        }}
                        variant="subtitle1"
                        align="left"
                    >
                        {/* {username} */}
                    </Typography>
                    {isFriendTyping && (
                        <Typography
                            style={{
                                marginLeft: "7px",
                                fontWeight: 500,
                                fontSize: "15px",
                                color: "#3ba55d",
                            }}
                            variant="subtitle1"
                            align="left"
                        >
                            typing.....
                        </Typography>
                    )}
                </div>
            {status&& <OnlineIndicator status={status} />}    
            {usernotifications.map((curEle)=>{
            if(curEle.userId==id){
               return curEle.messages.length>0&& <p style={{fontWeight:"bold",marginLeft:"10px",color:"white"}}>({  curEle.messages.length})</p>
            }
        })}
            </Button>
        </Tooltip>
        </div>
       
    );
};

export default FriendsListItem;
