import React,{useState} from "react";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
import Avatar from "../../../../components/Avatar";
import { Alert } from "@mui/material";
import { useAppSelector } from "../../../../store";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { removeMessage } from "../../../../socket/socketConnection";
import { fetchDirectChatHistory,fetchGroupChatHistory } from "../../../../socket/socketConnection";
function formatDate(date: Date) {
    let hours = date.getHours();
    let minutes: string | number = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
}

const MainContainer = styled("div")({
    width: "99%",
    display: "flex",
    marginTop: "10px",
});

const AvatarContainer = styled("div")({
    width: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

const MessageContainer = styled("div")({
    display: "flex",
    flexDirection: "column",
    maxWidth: "50%",
});
const handleDownload=( fileUrl:any, fileName:any)=>{
// Create a link element
const link = document.createElement('a');
link.href = fileUrl;
link.download = fileName;

// Trigger the click event to start the download
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
}
interface MessageProps {
    content: string;
    sameAuthor: boolean;
    username: string;
    date: string;
    incomingMessage: boolean;
    image?: string;
    id: string;
}

const Message = ({ content, sameAuthor, username, date, incomingMessage, image,id }: MessageProps) => {
    const { chosenChatDetails, chosenGroupChatDetails } = useAppSelector((state) => state.chat);

    const [check,setCheck]=useState(false)
    const deleteMessageUandler=()=>{
        removeMessage({messageid:id})

        if (chosenChatDetails) {
            fetchDirectChatHistory({
                receiverUserId: chosenChatDetails.userId,
            });
        }

        if(chosenGroupChatDetails) {
            fetchGroupChatHistory({
                groupChatId: chosenGroupChatDetails.groupId
            })
        }
        return setCheck(true)
      }
    if (!incomingMessage) {
        return (
            <MainContainer>
                
                <MessageContainer sx={{ marginLeft: "auto" }}>
                  
                    <div
                        style={{
                            color: "white",
                            backgroundColor: "skyblue",
                            borderRadius: "13px",
                            padding: "8px 12px",
                        }}
                    >
                        
                        <Typography
                            sx={{
                                fontSize: "16px",
                                color: "white",
                                marginBottom: "2px",
                            }}
                        >
                            <p style={{ overflowWrap: 'break-word' }}> {content}</p> 
                            {(image && content==="image")&& <img src={`./image/${image}`} height={200} width={200} alt=""  />} 
                            {(image && content==="file")&& <button onClick={()=>handleDownload(`./image/${image}`,image)}>Download {image}</button>} 
                        </Typography>
                        <Typography
                            sx={{
                                color: "#b9bbbe",
                                textAlign: "right",
                                fontSize: "10px",
                            }}
                        >
                            {formatDate(new Date(date))}
                        </Typography>
                    </div>
                    <DeleteForeverIcon onClick={deleteMessageUandler} />
                    {check &&   <Alert onClose={()=>setCheck(false)} sx={{ width: '30vw' }}>Message Deleted</Alert>}   
                </MessageContainer>
                
            </MainContainer>
        );
    }

    return (
        <MainContainer>
            {!sameAuthor && (
                <AvatarContainer>
                    <Avatar username={username} />
                </AvatarContainer>
            )}

            <MessageContainer
                sx={{
                    marginLeft: sameAuthor ? "60px" : "0px",
                    backgroundColor: "skyblue",
                    borderRadius: "13px",
                    padding: "8px 12px",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "16px",
                        color: "black",
                        marginBottom: "2px",
                    }}
                >
                <p style={{ overflowWrap: 'break-word' }}> {content}</p>   
                    {(image && content==="image")&& <img src={`./image/${image}`} height={200} width={200} alt=""  />} 
                    {(image && content==="file")&& <button onClick={()=>handleDownload(`./image/${image}`,image)}>Download {image}</button>} 
                </Typography>

                <Typography
                    sx={{
                        color: "#7f8183",
                        fontSize: "10px",
                    }}
                >
                    {formatDate(new Date(date))}
                </Typography>
                <DeleteForeverIcon onClick={deleteMessageUandler} />
                {check &&   <Alert onClose={()=>setCheck(false)} sx={{ width: '30vw' }}>Message Deleted</Alert>}   
            </MessageContainer>
        </MainContainer>
    );
};

export default Message;
