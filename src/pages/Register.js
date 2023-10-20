import React, { useState,useEffect} from "react";
import { Alert, Backdrop, Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useNavigate} from "react-router-dom";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "../components/myStyles.css"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
function Login() {
  const [data, setData] = useState({ name: '',username:"", email: "", password: "",department:"",section:"",designation:"" });
  const [loading, setLoading] = useState(false);
  const [signInStatus, setSignInStatus] = React.useState(false);
  const [userDelete,setUserDelete]=useState(false)
  const [signInError, setSignInError] = React.useState('');
  const [signErrorCheck,setSignCheck]=useState(false)
  const [departmentList,setDepartentList]=useState([])
  const [designationList,setDsignationList]=useState([])
  const [usersList,setUserList]=useState([])
  const [sectionList,setSectionList]=useState([]);
  const [userId,setUserId]=useState("")

  const [open, setOpen] = React.useState(false);
const [userId1,setUserId1]=useState("")
  const Admin=JSON.parse(localStorage.getItem("currentUser"));
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
const navigete=useNavigate()
  const handleClickOpen = (id) => {
    setOpen(true);
    setUserId(id)
  };

  const handleClose = () => {
    setOpen(false);
  };
  const signUpHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        "http://localhost:8000/api/auth/register/",
        data,
        config
      );
      if(response.status===201){
        setSignInStatus(true);
        FetchAllUsers();
        setLoading(false);
      }else{
        setLoading(false);
      setSignCheck(true)
        setSignInError(response.data?.error)
      }
      
    } catch (error) {
      console.log(error);
      setSignCheck(true)
      setSignInError(error.response.data?.message)
      if (error.response.status === 405) {
      setSignInError("User with this email ID already Exists");
      }
      if (error.response.status === 406) {
        setSignInError("User Name already Taken, Please take another one");
      }
      setLoading(false);
    }
  };
  const userIdHanlder = (e) => {
    setUserId1(e.target.value);
  
    if (e.target.value.length > 0) {
      let data = usersList?.filter((val) => {
        return val.name.toLowerCase().includes(e.target.value);
      });
      setUserList(data);
    } else {
      FetchAllUsers();
    }
  };
const deleteHandler=async()=>{
  setOpen(false)
  try {
    const response=await axios.delete("http://localhost:8000/api/auth/deleteuser/"+userId)
    if(response.data.message==="Deleted"){
      setUserDelete(true)
      FetchAllUsers();
      setUserId("")
    }
  } catch (error) {
    console.log(error);
  }
}
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
  const FetchAllUsers=async()=>{
    try {
     const response=await axios.get("http://localhost:8000/api/auth/userList");
     if(response.status===200){
      setUserList(response.data)
     } 
    } catch (error) {
      console.log(error);
    }
  }
  const searchUser=async()=>{
    try{
      const users=await axios.get("http://localhost:8000/api/auth/filterUser/"+data.department+'/'+data.section)
      if(users.status==200){
        setUserList(users?.data)
      }
    }catch (error) {
      console.log(error);
    }
  }
  const fetchAllsection=async(e)=>{
    try {
      const response = await axios.get("http://localhost:8000/section/section_list/"+e.target.value);
      if (response.status === 200) {
        setSectionList(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const font=localStorage.getItem("front")
  useEffect(()=>{
    FetchAllDepartment();
    FetchAllDesignation();
    FetchAllUsers();
  },[])
  return (
    <>
  
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="login-container">
      <Link to={"/dashboard"} style={{color:"#a9a9a9",textDecoration:"none",paddingLeft:"20px"}}> {font==="arabic"?"اذهب الى المنزل":"Go To Home"}</Link>
        <div className="image-container">
          <img src={"./live-chat_512px.png"} alt="Logo" className="welcome-logo" />
        </div>
        
          <div>
          {
            Admin?.isAdmin===true&&<div className="signu-dot-box">
            <p className="login-text"> {font==="arabic"?"إنشاء حساب مستخدم":"Create User Account"}</p>
            <TextField
              onChange={changeHandler}
              id="standard-basic"
              label="Enter User ID"
              variant="outlined"
              color="secondary"
              name="name"
              helperText=""
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  // console.log(event);
                  signUpHandler();
                }
              }}
            />
            <TextField
              onChange={changeHandler}
              id="standard-basic"
              label="Enter Username"
              variant="outlined"
              color="secondary"
              name="username"
              helperText=""
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  signUpHandler();
                }
              }}
            />
            <TextField
              onChange={changeHandler}
              id="standard-basic"
              label="Enter Email Address"
              variant="outlined"
              color="secondary"
              name="email"
              onKeyDown={(event) => {
                if (event.code ==="Enter") {
                  // console.log(event);
                  signUpHandler();
                }
              }}
            />
            <TextField
              onChange={changeHandler}
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              color="secondary"
              name="password"
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  // console.log(event);
                  signUpHandler();
                }
              }}
            />
              <Box sx={{ minWidth: 225 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Department</InputLabel>
        <Select
  labelId="demo-simple-select-label"
  id="demo-simple-select"
  value={data.department}
  name="department"
  label="Select Department"
  onChange={(e) => {
    changeHandler(e);
    fetchAllsection(e);
  }}
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
          value={data.section}
          name="section"
          label="Select Section"
          onChange={changeHandler}
        >
        {
            sectionList?.map((row)=>{
              return  <MenuItem value={row.name} >{row.name}</MenuItem>
            })
          }
   
        </Select>
      </FormControl>
    </Box>
    <Box sx={{ minWidth: 225 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Designation</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={data.designation}
          name="designation"
          label="Select Designation"
          onChange={changeHandler}
        >
        {designationList?.map((dept)=>{
return  <MenuItem value={dept?.name} key={dept?._id}>{dept?.name}</MenuItem>
        })}
   
        </Select>
      </FormControl>
    </Box>
            <Button
              variant="outlined"
              color="secondary"
              onClick={signUpHandler}
            >
               {font==="arabic"?"اشتراك":"Sign Up"}
            </Button>
           
            {signInStatus ? (
              <Alert onClose={()=>setSignInStatus(false)} sx={{ width: '30vw' }}>User Created</Alert>
            ) : null}
            {signErrorCheck ? (
              <Alert onClose={()=>setSignInStatus(false)} sx={{ width: '30vw' }} severity="warning">{signInError}</Alert>
            ) : null}
          
</div>
          }
          {
              userDelete===true&& <Alert onClose={()=>setUserDelete(false)} sx={{ width: '30vw' }}>User Deleted</Alert>
            }
            <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are You Sure to Delete User?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteHandler} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
            <p className="login-text">               {font==="arabic"?"قائمة المستخدمين":"Users List"}</p>
         <div style={{display:"flex",gap:"20px"}}>
         <Box sx={{ minWidth: 225 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Department</InputLabel>
        <Select
  labelId="demo-simple-select-label"
  id="demo-simple-select"
  value={data.department}
  name="department"
  label="Select Department"
  onChange={(e) => {
    changeHandler(e);
    fetchAllsection(e);
  }}
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
          value={data.section}
          name="section"
          label="Select Section"
          onChange={changeHandler}
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
              value={userId1}
              onChange={(e)=>userIdHanlder(e)}
            />
         </div>

            <TableContainer component={Paper}>
      <Table  aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>User ID</StyledTableCell>
            <StyledTableCell align="right">User Email</StyledTableCell>
            <StyledTableCell align="right">Department</StyledTableCell>
            <StyledTableCell align="right">Designation</StyledTableCell>
            <StyledTableCell align="right">Section</StyledTableCell>
            <StyledTableCell align="right">Username</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
          {Admin?.isAdmin===true&&  <StyledTableCell align="right">Action</StyledTableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {usersList?.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.email}</StyledTableCell>
              <StyledTableCell align="right">{row.department}</StyledTableCell>
              <StyledTableCell align="right">{row.designation}</StyledTableCell>
              <StyledTableCell align="right">{row.section}</StyledTableCell>
              <StyledTableCell align="right">{row.username}</StyledTableCell>
              <StyledTableCell align="right">{row.status}</StyledTableCell>
              {  Admin?.isAdmin===true&&    <StyledTableCell align="right">{row.email !=="interior@gmail.com"&&<DeleteIcon onClick={()=>handleClickOpen(row._id)} style={{color:'red'}}/>}<EditIcon onClick={()=>navigete("/edituser/"+row._id)} style={{color:'black'}}/></StyledTableCell> }
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          </div>
      
      </div>
    </>
  );
}

export default Login;
