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
import "./myStyles.css"
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';

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
function createData(
 Department_id,Department_name
) {
  return { Department_id,Department_name };
}


function Department() {
  const [data, setData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
 const [designationList,setDsignationList]=useState([])
 const [deletedept, setDelete] = useState(false);

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const designationHandler = async (e) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        "http://localhost:8000/designation/submit_designation/",
        data,config
      );
      if(response.data.message==="Designation Created"){
    FetchAllDesignation();
        setLoading(false);
        setStatus(true)
        setData({...data,name:""});
     
      }
      
    } catch (error) {
        setLoading(false);
    }
    setLoading(false);
  };

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setStatus(false)
  }
  const deleteDepartm=async(id)=>{
    try {
      const response=await axios.delete('http://localhost:8000/designation/deleteDesignation/'+id)
      if(response.data.message==='Designation Deleted'){
      setDelete(true)
      FetchAllDesignation()
      }
    } catch (error) {
      
    }
    }
  const font=localStorage.getItem("front")
  // fetch all department list
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
  useEffect(()=>{
    FetchAllDesignation();
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
      <Link to={"/dashboard"} style={{color:"#a9a9a9",textDecoration:"none",paddingLeft:"20px"}}>{font==="arabic"?"اذهب الى المنزل":"Go To Home"}</Link>
        <div className="image-container">
          <img src={"./live-chat_512px.png"} alt="Logo" className="welcome-logo" />
        </div>
     
          <div className="login-box">
            <p className="login-text"> {font==="arabic"?"إنشاء التعيين":"Create Designation"}</p>
            <TextField
              onChange={changeHandler}
              id="standard-basic"
              label="Enter Designation"
              variant="outlined"
              color="secondary"
              name="name"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  designationHandler();
                }
              }}
            />
      
            <Button
              variant="outlined"
              color="secondary"
              onClick={designationHandler}
              isLoading
            >
               {font==="arabic"?"يُقدِّم":"Submit"}
            </Button>
           {status&& <div><Alert onClose={handleClose} sx={{ width: '30vw' }}>Designation Created</Alert></div>} 
           {deletedept&& <div><Alert onClose={handleClose} sx={{ width: '30vw' }}>Designation Deleted</Alert></div>} 

           <p className="login-text"> {font==="arabic"?"قائمة التعيين":"Designation List"}</p>

           <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Designation ID</StyledTableCell>
            <StyledTableCell align="right">Designation Name</StyledTableCell>
            <StyledTableCell align="right">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {designationList?.map((row) => (
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
          </div>
     
      
      </div>
    </>
  );
}

export default Department;
