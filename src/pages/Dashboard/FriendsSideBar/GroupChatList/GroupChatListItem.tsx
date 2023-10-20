import React,{useEffect,useState} from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { setChosenGroupChatDetails } from "../../../../actions/chatActions";
import { useAppSelector } from "../../../../store";
import { GroupChatDetails } from "../../../../actions/types";
import { removeGroupNotifications,fetchGroupChatNotifications } from "../../../../socket/socketConnection";
import { setGroupNotifications } from "../../../../actions/chatActions";
import {store} from "../../../../store"
interface GroupChatListItemProps {
    chat: GroupChatDetails
}

const GroupChatListItem = ({ chat }: GroupChatListItemProps) => {
    const [notificationsFetched, setNotificationsFetched] = useState(false);
    const theme = useTheme();

    const matches = useMediaQuery(theme.breakpoints.up("sm"));
    const dispatch = useDispatch();

    const { chosenGroupChatDetails,notifications } = useAppSelector((state) => state.chat);
  
  
    const isChatActive = chosenGroupChatDetails?.groupId === chat.groupId;

    const maxNotificationsMap = new Map();

notifications.forEach((notification) => {
  const { groupChatId, notifications } = notification;
  if (!maxNotificationsMap.has(groupChatId) || notifications > maxNotificationsMap.get(groupChatId)) {
    maxNotificationsMap.set(groupChatId, notifications);
  }
});

// Create a new array with the entries from maxNotificationsMap
const uniqueNotifications = Array.from(maxNotificationsMap, ([groupChatId, notifications]) => ({
  groupChatId,
  notifications,
}));
const removeGroup=()=>{
    removeGroupNotifications({ groupChatId: chat.groupId }); 
    notifications.forEach((notification) => {
        if (notification.groupChatId === chat.groupId) {
          notification.notifications = 0;
        }

      });
      store.dispatch(setGroupNotifications(notifications as any));
      
}

    useEffect(() => {
        // Check if notifications have already been fetched for this groupId
        if (!notificationsFetched) {
            fetchGroupChatNotifications({ groupChatId: chat.groupId });
            // Mark notifications as fetched to avoid fetching again
            setNotificationsFetched(true);
        }
    }, [chat.groupId]);
    return (
        <Tooltip title={chat.groupName}>
            <Button
               onClick={() => {
                dispatch(setChosenGroupChatDetails(chat));
                removeGroup()
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
                {/* {matches && <Avatar username={username} />} */}

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
                        {chat.groupName} {uniqueNotifications?.map((curEle)=>{
                            if(curEle?.groupChatId.toString()===chat.groupId.toString()) {
                              return  curEle?.notifications>0 && <span style={{color:"white"}}>({ curEle?.notifications})</span>
                            }
                        })}
                         {/* {notifications>0 && <span style={{color:"white"}}>({ notifications})</span> } */}
                    </Typography>
                </div>
            </Button>
        </Tooltip>
    );
};

export default GroupChatListItem;
