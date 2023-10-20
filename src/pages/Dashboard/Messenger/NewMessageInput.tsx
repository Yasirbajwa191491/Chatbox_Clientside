import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { useAppSelector } from "../../../store";
import { Alert, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchDirectChatHistory } from "../../../socket/socketConnection";
import { notifyTyping, sendDirectMessage, sendGroupMessage } from "../../../socket/socketConnection";
import { AttachFile} from '@mui/icons-material';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import axios from "axios";
const MainContainer = styled("div")({
    height: "60px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

const Input = styled("input")({
    backgroundColor: "#2f3136",
    width: "98%",
    height: "44px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    padding: "0 10px",
});
const ClipIcon = styled(AttachFile)`
    transform: 'rotate(40deg)'
`;
const NewMessageInput: React.FC = () => {
    const [message, setMessage] = useState("");
    const [focused, setFocused] = useState(false);
	const [image,setImage]=useState('')
    const [file,setFile]=useState("");
    const [selectedFile,setSelectedFile]=useState("")
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { chosenChatDetails, chosenGroupChatDetails } = useAppSelector((state) => state.chat);
    const dispatch = useDispatch();



    const handleSendMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
        
        if (e.key === "Enter") {
            
            if(chosenChatDetails) {
                sendDirectMessage({
                    message,
                    receiverUserId: chosenChatDetails.userId!,
                });
            }
            
            if(chosenGroupChatDetails) {
                sendGroupMessage({
                    message,
                    groupChatId: chosenGroupChatDetails.groupId
                })
                
            }


            setMessage("");
        }
    };
    const Admin=JSON.parse(localStorage.getItem("currentUser")!);

const uploadImage=async(event: React.MouseEvent<HTMLButtonElement>)=>{
    event.preventDefault();
    try {
       
        if(chosenChatDetails) {
            const formData = new FormData();
    formData.append("image",image)
    formData.append("receiverUserId",chosenChatDetails.userId!)
    formData.append("author",Admin?._id as string)
     const addimage=await axios.post("http://localhost:8000/api/message/upload",formData )
     if(addimage.data.message==="image uploaded"){
        fetchDirectChatHistory({
            receiverUserId: chosenChatDetails.userId,
        });
    setSelectedImage("")
    setImage("")
     }
        } 
        if(chosenGroupChatDetails) {
            const formData = new FormData();
            formData.append("image",image)
            formData.append("author",Admin?._id as string)
            formData.append("groupId",chosenGroupChatDetails.groupId)
             const addimage=await axios.post("http://localhost:8000/api/message/uploadgroup",formData )
             if(addimage.data.message==="image uploaded"){
            setSelectedImage("")
            setImage("")
             }
        }
    } catch (error) {
        console.log(error);
        
    }
}
const uploadFile=async(event: React.MouseEvent<HTMLButtonElement>)=>{
    event.preventDefault();
    try {
     
        if(chosenChatDetails) {
            const formData = new FormData();
    formData.append("image",file)
    formData.append("receiverUserId",chosenChatDetails.userId!)
    formData.append("author",Admin?._id as string)
     const addimage=await axios.post("http://localhost:8000/api/message/uploadfile",formData )
     if(addimage.data.message==="image uploaded"){
        fetchDirectChatHistory({
            receiverUserId: chosenChatDetails.userId,
        });
    setSelectedFile("")
    setFile("")
     }
        } 
        if(chosenGroupChatDetails) {
            const formData = new FormData();
            formData.append("image",file)
            formData.append("author",Admin?._id as string)
            formData.append("groupId",chosenGroupChatDetails.groupId)
             const addimage=await axios.post("http://localhost:8000/api/message/uploadfilegroup",formData )
             if(addimage.data.message==="image uploaded"){
            setSelectedFile("")
    setFile("")
             }
        }
    } catch (error) {
        console.log(error);
        
    }
}
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    };
   

    useEffect(() => {
        if (chosenChatDetails?.userId) {
            notifyTyping({
                receiverUserId: chosenChatDetails.userId!,
                typing: focused,
            });
        }
    }, [focused, chosenChatDetails?.userId]);
    const font=localStorage.getItem("front")
    return (
        <MainContainer>
           
            {
            selectedImage ?(<div style={{marginBottom:"30px",backgroundColor:"#2d3941",width:"90%"}}> <img src={selectedImage} width={100} height={80} alt="Selected"  />   <Button
              variant="outlined"
              color="secondary"
              type="button" 
              style={{marginBottom:"50px",marginLeft:"30px"}}
               onClick={uploadImage}
            >
               {font==="arabic"?"إرسال صورة":"Send Image"}
            </Button></div>)
        :selectedFile ?(<div style={{marginBottom:"30px",backgroundColor:"#2d3941",width:"90%"}}> <li>{selectedFile}</li>   <Button
        variant="outlined"
        color="secondary" type="button" 
        style={{marginBottom:"50px",marginLeft:"30px"}}
         onClick={uploadFile}
      >
         {font==="arabic"?"رفع ملف":"Upload File"}
      </Button></div>)
        : <Input
                placeholder={chosenChatDetails  ? (font==="arabic"?`اكتب رسالة إلى ${chosenChatDetails.username}`:`Write message to ${chosenChatDetails.username}`) : (font==="arabic"? "رسالتك...":"Your message...")}
                value={message}
                onChange={handleChange}
                onKeyDown={handleSendMessage}
                onFocus={onFocus}
                onBlur={onBlur}
            />}
         
            <label htmlFor="fileInput">
                <PermMediaIcon />
            </label>
            <input
                type='file'
                id="fileInput"
                style={{ display: 'none' }}
                onChange={(e:any) => {
                    setImage(e.target.files[0]);
                    let file=e.target.files && e.target.files[0];
                    if (file) {
                        const imageURL = URL.createObjectURL(file);
                        setSelectedImage(imageURL);
                      }
                              }}
            />
            <label htmlFor="fileInputDocument">
                <ClipIcon />
            </label>
            <input
                type='file'
                id="fileInputDocument"
                style={{ display: 'none' }}
                onChange={(e:any) => {
                    setFile(e.target.files[0]);
                    let file=e.target.files && e.target.files[0];
                    if (file) {
                        const imageURL = URL.createObjectURL(file);
                        setSelectedFile(imageURL);
                      }
                              }}
            />
        </MainContainer>
    );
};

export default NewMessageInput;
