import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import { Alert } from "@mui/material";
import { validateMail } from "../../../utils/validators";
import { Button,TextField} from "@mui/material";
import styled from "@emotion/styled";
import { acceptInvitation, inviteFriend } from "../../../actions/friendActions";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { StyledTableCell,StyledTableRow } from "./TableStyle";
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


  
  interface Post{
    _id: number,
    name:string,
    username:string,
    email:string,
    department:string,
    designation:string,
    status:string
  }
interface Depart{
  _id:number,
  name:string
}



interface AddFriendDialogProps {
    isDialogOpen: boolean;
    closeDialogHandler: () => void;
}

const AddFriendDialog = ({
    isDialogOpen,
    closeDialogHandler,
}: AddFriendDialogProps) => {
    const [email, setEmail] = useState("");
    const [inviteError,setInviteError]=useState(false)
    const [inviteMsg,setInviteMsg]=useState("")
    const [isFormValid, setIsFormValid] = useState(false);
    const [usersList,setUserList]=useState<Post[]>([]);
    const [departmentList,setDepartentList]=useState<Depart[]>([]);
    const [sectionList,setSectionList]=useState<Depart[]>([]);
    const [designationList,setDsignationList]=useState<Depart[]>([]);
    const isMounted = useRef(true);
    const dispatch = useDispatch();
   const [dept,setDept]=useState("")
   const [section,setSection]=useState("")
  const [userId,setUserId]=useState("")
    const handleCloseDialog = () => {
        closeDialogHandler();
        setEmail("");
    };
    const Admin=JSON.parse(localStorage.getItem("currentUser")!);

    const handleClick = () => {
        dispatch(inviteFriend(email, handleCloseDialog));
    }
    const handleClick1 = (email:any) => {
        dispatch(inviteFriend(email, handleCloseDialog));
    }
    const sendInviteHandler=async(myemail:any)=>{
      try {
        const response=await axios.post("http://localhost:8000/api/invite-friend/invite",{
          email:myemail
        },{
          headers:{
            'Authorization': `Bearer ${Admin?.token}`
          }
        })
        if (response.data.message === "Invitation has been sent successfully") {
          if (response.data?.data?._id) {
            let invitationId = response.data?.data?._id.toString() as string;
            dispatch(acceptInvitation(invitationId));
           
            
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // AxiosError includes the response object
          if (error.response) {
            setInviteError(true);
            setInviteMsg(error.response.data);
          }
        } else {
          // Handle other types of errors
          console.error("An error occurred:", error);
        }
      }
    }
    const userIdHanlder = (e:any) => {
      setUserId(e.target.value);
    
      if (e.target.value.length > 0) {
        let data = usersList?.filter((val) => {
          return val.name.toLowerCase().includes(e.target.value);
        });
        setUserList(data);
      } else {
        FetchAllUsers();
      }
    };
    const fetchSectionList=async(e:any)=>{
      setDept(e.target.value)
      try {
        const response = await axios.get("http://localhost:8000/section/section_list/"+dept);
        if (response.status === 200) {
          setSectionList(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    const FetchAllUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/auth/userList");
        if (response.status === 200 && isMounted.current) {
          setUserList(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const FetchAllDepartment=async()=>{
      try {
       const response=await axios.get("http://localhost:8000/department/department_list");
       if(response.status===200){
        setDepartentList(response.data)
       } 
      } catch (error) {
        console.log(error);
      }
    }
    
    const FetchAllDesignation=async()=>{
      try {
       const response=await axios.get("http://localhost:8000/designation/designation_list");
       if(response.status===200){
        setDsignationList(response.data)
       } 
      } catch (error) {
        console.log(error);
      }
    }
    const searchUser=async()=>{
      try{
        const users=await axios.get("http://localhost:8000/api/auth/filterUser/"+dept+'/'+section)
        if(users.status==200){
          setUserList(users?.data)
        }
      }catch (error) {
        console.log(error);
      }
    }
    useEffect(() => {
      // Component is mounted, set the ref to true
      isMounted.current = true;
  
      // Fetch data
      FetchAllUsers();
      FetchAllDepartment();
      FetchAllDesignation();
      // Cleanup function to set the ref to false when unmounting
      return () => {
        isMounted.current = false;
      };
    }, []);
    useEffect(() => {
        setIsFormValid(validateMail(email));
    }, [email, setIsFormValid]);

    return (
        <div>
          
            <Dialog open={isDialogOpen} onClose={handleCloseDialog} style={{width:'1300px',height:"700px"}}>
             
                 {inviteError&& <div><Alert onClose={()=>setInviteError(false)} sx={{ width: '50vw' }}>{inviteMsg}</Alert></div>} 

                <h3 style={{textAlign:"center"}}>Available Users</h3>
                <div style={{display:"flex",gap:"20px"}}>
         <Box sx={{ minWidth: 225 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Department</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={dept}
          name="department"
          label="Select Department"
          onChange={(e)=>fetchSectionList(e)}
        >
        {departmentList?.map((dept)=>{
return  <MenuItem value={dept?.name} key={dept?._id}>{dept?.name}</MenuItem>
        })}
   
        </Select>
      </FormControl>
    </Box>
              <Box sx={{ minWidth: 225 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Section</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={section}
          name="section"
          label="Select Section"
          onChange={(e)=>setSection(e.target.value)}
        >
          {
            sectionList?.map((row)=>{
              return  <MenuItem value={row.name} >{row.name}</MenuItem>
            })
          }
       
   
        </Select>
      </FormControl>
    </Box>
    <Button
              variant="outlined"
              color="secondary"
              onClick={searchUser}
            >
              Search
            </Button>
         </div>
         <div style={{padding:"10px"}}>
         <TextField
              label="User ID"
              type="text"
              autoComplete="off"
              color="secondary"
              style={{width:"300px"}}
              value={userId}
              onChange={(e)=>userIdHanlder(e)}
            />
         </div>
         <p style={{textAlign:'center'}}>Click for Chating</p>
                <TableContainer component={Paper}>
      <Table  aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>User ID</StyledTableCell>
            <StyledTableCell align="right">Username</StyledTableCell>
            <StyledTableCell align="right">Email</StyledTableCell>
            <StyledTableCell align="right">Department</StyledTableCell>
            <StyledTableCell align="right">Section</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {usersList?.map((post,index) => (
    <StyledTableRow key={post._id} onClick={()=>sendInviteHandler(post.email)} style={{cursor:"pointer",backgroundColor:`${index%2===0? "lightyellow": "lightblue"}`}}> 
      <StyledTableCell component="th" scope="row">
        {post.name}
      </StyledTableCell>
      <StyledTableCell align="right">{post.username}</StyledTableCell>
      <StyledTableCell align="right">{post.email}</StyledTableCell>
      <StyledTableCell align="right">{post.department}</StyledTableCell>
      <StyledTableCell align="right">{post.designation}</StyledTableCell>
      <StyledTableCell align="right">{post.status}</StyledTableCell>
    </StyledTableRow>
  ))}
</TableBody>
      </Table>
    </TableContainer>
            </Dialog>
        </div>
    );
};

export default AddFriendDialog;
