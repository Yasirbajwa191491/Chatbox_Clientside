import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import FriendsListItem from "./FriendsListItem";
import { useAppSelector } from "../../../../store";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from "@mui/material/Typography";
import { sendDepartmentList,sendUserId } from "../../../../socket/socketConnection";
import OnlineIndicator1 from "./OnlineIndicator1";
const MainContainer = styled("div")({
  flexGrow: 1,
  width: "100%",
  margin: "20px 0",
});


const FriendsList = () => {
  const { friends, onlineUsers,notifications,usernotifications } = useAppSelector((state) => state.friends);
  const [expanded, setExpanded] = React.useState(false);
  // State to store the modifiedFriends array
  const [modifiedFriends, setModifiedFriends] = useState([]);
  const [alldept,setAllDept]=useState([])
  const [deptuser,setDeptUser]=useState([])
  const [users,setUsers]=useState([])

  const handleChange = (panel) => {
    setExpanded(panel);
  };

  const deptHanlder=(dept)=>{
   let result= deptuser?.filter((curEle)=>{
      if(curEle?.department===dept){
        return curEle?.users
      }
    })
    setUsers(result[0].users)
    console.log(result,'uewrsbw');
    // let data = modifiedFriends?.filter((val) => {
    //   return val.department ===dept
    // });
    // setModifiedFriends(data)
  }
  const fetchUserNotification=()=>{
    modifiedFriends.map((curEle)=>{
      return sendUserId({userId:curEle.id})
    })
  }
  useEffect(() => {
    // Calculate modifiedFriends whenever friends or onlineUsers change
    const updatedModifiedFriends = friends.map((friend) => {
      const isOnline = onlineUsers.find((user) => user.userId === friend.id);
      return { ...friend, isOnline: isOnline, department: friend.department };
    });

    setModifiedFriends(updatedModifiedFriends);
    const distinctStdNames = [...new Set(friends.map(obj => obj.department))];
    const setAllDeptPromise = new Promise((resolve) => {
      setAllDept(distinctStdNames);
      resolve();
    });
    setAllDeptPromise.then(() => {
    
      sendDepartmentList(alldept);
    });
  
    // Call sendDepartmentList after setAllDeptPromise resolves
    
  
  //  fetchNotifcations();
  }, [friends, onlineUsers]);
  useEffect(() => {
    const updatedModifiedFriends = friends.map((friend) => {
      const isOnline = onlineUsers.find((user) => user.userId === friend.id);
      return { ...friend, isOnline: isOnline, department: friend.department };
    });
    let totalusers = alldept.map((cur) => {
      console.log(cur, 'department');
      let result = updatedModifiedFriends.filter((curEle) => {
        return curEle?.department === cur;
      });
      return { department: cur, users: result };
    });
   setDeptUser([...totalusers])
  }, [ alldept]);
  const Admin=JSON.parse(localStorage.getItem("currentUser"));
  return (
    <div>
    <div >
    {alldept.map((f) => {
       return     <Accordion style={{backgroundColor:"#1A2B63",color:"white"}} expanded={expanded === f} onChange={()=>handleChange(f)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={()=>{
            deptHanlder(f)
            fetchUserNotification()
            }}
        >
          <Typography>{f}</Typography>{
  usernotifications?.map((curEle) => {
    if (curEle.userId !== Admin?._id) {
      {/* const hasMatchingUsers = deptuser?.some((current) => {
        return current?.users.some((user) => user?.department === f);
      });
  console.log(hasMatchingUsers,'hassssss') */}
      if (curEle?.messages.length > 0 ) {
        return <div key={curEle.userId}><OnlineIndicator1 /></div>;
      }
    }
    return null; // or you can return a placeholder if the condition is not met
  })
}
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          <MainContainer>
      {users?.map((f) => {
        return (
          <FriendsListItem
            username={f.username}
            id={f.id}
            name={f.name}
            key={f.id}
            isOnline={f.isOnline}
            email={f.email}
            status={f?.status}
            department={f?.department}
            section={f?.section}
            designation={f?.designation}
          />
        );
      })}
    </MainContainer>
          </Typography>
        </AccordionDetails>
      </Accordion>
    })
    }
            </div>
              
  
    </div>

  );
};

export default FriendsList;
