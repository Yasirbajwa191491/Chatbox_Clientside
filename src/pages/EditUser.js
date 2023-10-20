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
import { Link,useParams,useNavigate } from "react-router-dom";
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
  const [data, setData] = useState({ name: '',username:"", email: "",department:"",section:"",designation:"",id:null });
  const [loading, setLoading] = useState(false);
  const [signInStatus, setSignInStatus] = React.useState(false);
  const [signInError, setSignInError] = React.useState('');
  const [signErrorCheck,setSignCheck]=useState(false)
  const [departmentList,setDepartentList]=useState([])
  const [designationList,setDsignationList]=useState([])
  const [usersList,setUserList]=useState([])
  const Admin=JSON.parse(localStorage.getItem("currentUser"));
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const {userid}=useParams();
const navigate=useNavigate();
  const signUpHandler = async () => {
   
    try {
        setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.patch(
        "http://localhost:8000/api/auth/updateuser/",
        data,
        config
      );
      if(response.data.message==="Updated User"){
        setSignInStatus(true);
        setLoading(false);
        navigate("/register")
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
     const response=await axios.get("http://localhost:8000/api/auth/singleuser/"+userid);
     if(response.status===200){
      setUserList(response.data)
      setData({...data,
    name:response.data[0]?.name,
    username:response.data[0]?.username,
    email:response.data[0]?.email,
    department:response.data[0]?.department,
    section:response.data[0].section,
    designation:response.data[0].designation,
    id:response.data[0]._id
    })
     } 
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(()=>{
    FetchAllDepartment();
    FetchAllDesignation();
   
  },[])
  useEffect(()=>{
    FetchAllUsers(userid);
  },[userid])
  return (
    <>
  
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="login-container">
      <Link to={"/dashboard"} style={{color:"#a9a9a9",textDecoration:"none",paddingLeft:"20px"}}>Go to Home</Link>
        <div className="image-container">
          <img src={"/live-chat_512px.png"} alt="Logo" className="welcome-logo" />
        </div>
        
          <div className="signu-dot-box">
          {
            Admin?.isAdmin===true&&<div className="signu-dot-box">
            <p className="login-text">Edit User Account</p>
            <TextField
              onChange={changeHandler}
              id="standard-basic"
              placeholder="User ID"
              variant="outlined"
              color="secondary"
              name="name"
              value={data.name}
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
              placeholder="Enter Username"
              variant="outlined"
              color="secondary"
              name="username"
              value={data.username}
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
              placeholder="Enter Email Address"
              variant="outlined"
              color="secondary"
              name="email"
              value={data.email}
              onKeyDown={(event) => {
                if (event.code ==="Enter") {
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
          onChange={changeHandler}
        >
        <MenuItem value={data.department} key={data.department}>{data.department}</MenuItem>
        {/* {departmentList?.map((dept)=>{
return  <MenuItem value={dept?.name} key={dept?._id}>{dept?.name}</MenuItem>
        })} */}
   
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
        <MenuItem value={data.section} >{data.section}</MenuItem>
   
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
              Update User
            </Button>
           
            {signInStatus ? (
              <Alert onClose={()=>setSignInStatus(false)} sx={{ width: '30vw' }}>User Updated</Alert>
            ) : null}
            {signErrorCheck ? (
              <Alert onClose={()=>setSignInStatus(false)} sx={{ width: '30vw' }} severity="warning">{signInError}</Alert>
            ) : null}
          
</div>
          }
          
          </div>
      
      </div>
    </>
  );
}

export default Login;
