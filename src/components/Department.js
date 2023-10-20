import React, { useState,useEffect } from "react";
import { Alert, Backdrop, Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import DeleteIcon from '@mui/icons-material/Delete';
import "./myStyles.css"
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


function Department() {
  const [data, setData] = useState({ name: "" });
  const [section,setSection]=useState("")
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [statussec, setStatussec] = useState(false);
  const [deletedept, setDelete] = useState(false);
  const [sectionCrea, setSectionCreate] = useState(false);
 const [departmentList,setDepartentList]=useState([])
const [sectionList,setSectionList]=useState([])
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
const sectionHandler=async()=>{
  try {
    if(!data.name || !section){
      setStatussec(true)
    }else{
      const response = await axios.post(
        "http://localhost:8000/section/submit_section/",
        {
          department:data.name,name:section
        }
      );
      if(response.data.message==="Section Created"){
        setSectionCreate(true)
        setData({...data,name:""});
       setSection("")
       FetchAllSection()
      }
    }
   
  } catch (error) {
    
  }
}
  const departmentHandler = async (e) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/department/submit_department/",
        data
      );
      if(response.data.message==="Department Created"){
    FetchAllDepartment();
        setLoading(false);
        setStatus(true)
        setData({...data,name:""});
     
      }
      
    } catch (error) {
        setLoading(false);
    }
    setLoading(false);
  };
const deleteDepartm=async(id)=>{
try {
  const response=await axios.delete('http://localhost:8000/department/deleteDepartment/'+id)
  if(response.data.message==='Department Deleted'){
  setDelete(true)
  FetchAllDepartment()
  }
} catch (error) {
  
}
}
const deleteSectionHandler=async(id)=>{
try {
  const response=await axios.delete('http://localhost:8000/section/deleteSection/'+id)
  if(response.data.message==='Section Deleted'){
  FetchAllSection()
  }
} catch (error) {
  
}
}
  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setStatus(false)
  }

  // fetch all department list
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
  const FetchAllSection=async()=>{
    try {
     const response=await axios.get("http://localhost:8000/section/section_list");
     if(response.status===200){
      setSectionList(response.data)
     } 
    } catch (error) {
      console.log(error);
    }
  }
  const font=localStorage.getItem("front")
  useEffect(()=>{
    FetchAllDepartment();
    FetchAllSection()
  },[])
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="section-container">
      <Link to={"/dashboard"} style={{color:"#a9a9a9",textDecoration:"none",paddingLeft:"20px"}}>{font==="arabic"?"اذهب الى المنزل":"Go To Home"}</Link>
        <div className="image-container">
          <img src={"./live-chat_512px.png"} alt="Logo" className="welcome-logo" />
        </div>
     
          <div className="login-box">
            <p className="login-text">{font==="arabic"?"إنشاء قسم":"Create Department"}</p>
            <TextField
              onChange={changeHandler}
              id="standard-basic"
              label="Enter Department"
              variant="outlined"
              color="secondary"
              name="name"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  departmentHandler();
                }
              }}
            />
      
            <Button
              variant="outlined"
              color="secondary"
              onClick={departmentHandler}
              isLoading
            >
              {font==="arabic"?"يُقدِّم":"Submit"}
            </Button>
           {status&& <div><Alert onClose={handleClose} sx={{ width: '30vw' }}>Department Created</Alert></div>} 
       
           {deletedept&& <div><Alert onClose={()=>setDelete(false)} sx={{ width: '30vw' }}>Department Deleted</Alert></div>} 
           {statussec&& <div><Alert onClose={()=>setStatussec(false)} sx={{ width: '30vw' }} severity="warning">Please Fill Required Fields</Alert></div>} 
           <p className="login-text">{font==="arabic"?"إنشاء قسم":"Create Section"}</p>
            <TextField
              onChange={(e)=>setSection(e.target.value)}
              id="standard-basic"
              label="Enter Section"
              variant="outlined"
              color="secondary"
              name="name"
             value={section}
            />
      <Box sx={{ minWidth: 225 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Department</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={data.name}
          name="name"
          label="Select Department"
          onChange={changeHandler}

        >
        {departmentList?.map((dept)=>{
return  <MenuItem value={dept?.name} key={dept?._id}>{dept?.name}</MenuItem>
        })}
   
        </Select>
      </FormControl>
    </Box>
            <Button
              variant="outlined"
              color="secondary"
              onClick={sectionHandler}
              isLoading
            >
              {font==="arabic"?"يُقدِّم":"Submit"}
            </Button>
            {sectionCrea&& <div><Alert onClose={()=>setSectionCreate(false)} sx={{ width: '30vw' }}>section Created</Alert></div>} 
           <p className="login-text"> {font==="arabic"?"قائمة الأقسام":"Department List"}</p>
           <Link to={"/designation"}>{font==="arabic"?"قائمة التعيين":"Designation List"}</Link>
           <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Department ID</StyledTableCell>
            <StyledTableCell align="right">Department Name</StyledTableCell>
            <StyledTableCell align="right">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departmentList?.map((row) => (
            <StyledTableRow key={row._id}>
              <StyledTableCell component="th" scope="row">
                {row._id}
              </StyledTableCell>
              <StyledTableCell align="right">{row.name}</StyledTableCell>
              <StyledTableCell align="right"><DeleteIcon onClick={()=>deleteDepartm(row?._id)} style={{color:'red'}} /></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <p className="login-text"> {font==="arabic"?"قائمة الأقسام":"Section List"}</p>

           <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Section ID</StyledTableCell>
            <StyledTableCell align="right">Section Name</StyledTableCell>
            <StyledTableCell align="right">Department Name</StyledTableCell>
            <StyledTableCell align="right">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sectionList?.map((row) => (
            <StyledTableRow key={row._id}>
              <StyledTableCell component="th" scope="row">
                {row._id}
              </StyledTableCell>
              <StyledTableCell align="right">{row.name}</StyledTableCell>
              <StyledTableCell align="right">{row.department}</StyledTableCell>
              <StyledTableCell align="right"><DeleteIcon onClick={()=>deleteSectionHandler(row?._id)} style={{color:'red'}} /></StyledTableCell>
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

export default Department;
