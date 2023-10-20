import React, {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import {useDispatch} from 'react-redux';
import { Typography } from '@mui/material'
import { styled } from "@mui/system";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import AuthBox from '../components/AuthBox'
import {loginUser} from "../actions/authActions";
import { useAppSelector } from '../store';
import Switch from '@mui/material/Switch';

const Wrapper = styled("div")({
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
});

const Label = styled("p")({
    color: "#b9bbbe",
    textTransform: "uppercase",
    fontWeight: "600",
    fontSize: "16px",
});

const Input = styled("input")({
    flexGrow: 1,
    height: "40px",
    border: "1px solid black",
    borderRadius: "5px",
    color: "#dcddde",
    background: "#35393f",
    margin: 0,
    fontSize: "16px",
    padding: "0 5px",
    outline: "none",
});


const RedirectText = styled("span")({
    color: "#00AFF4",
    fontWeight: 500,
    cursor: "pointer",
});

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch ();
    const [checked, setChecked] = React.useState(false);
    const [font,setFont]=useState("english")
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const [isFormValid, setIsFormValid] = useState(false); 

    const {error, errorMessage, userDetails} = useAppSelector(state => state.auth) 


    const handleChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const handleLogin = () => {
        dispatch(loginUser(credentials))
    }


    // useEffect(() => {
    //     setIsFormValid(validateLoginForm(credentials))
    // }, [credentials])
    const handleChanger= (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
       
      };
    useEffect(() => {
        
        if (userDetails?.token) {
            navigate("/dashboard")
        }

    }, [userDetails, navigate])

    useEffect(()=>{
        if(checked===false){
            localStorage.setItem("front","english")
        }else{
            localStorage.setItem("front","arabic")
        }
    },[checked])

    // useEffect(() => {
    //     const storedFont = localStorage.getItem("front");
    //     if (storedFont && font !== storedFont) {
    //         setFont(storedFont);
    //     }
    // }, [font]); // Update when font changes
    
  return (
    <div >
        <div style={{position:"relative"}}>
        <div style={{position:"absolute",right:30,top:20,display:"flex",color:"white"}}>
    <h3>English</h3>
   
   <div style={{marginTop:"13px"}}><Switch
      checked={checked}
      onChange={handleChanger}
      inputProps={{ 'aria-label': 'controlled' }}
    /></div> 
    <h3>Arabic</h3>
    </div>
        </div>
    
      <AuthBox>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}> <img src={"./live-chat_512px.png"} alt="" width={200} height={200}  /></div>
     
          <Typography variant="h5" sx={{ color: "white" }}>
          {checked? "مرحبًا بعودتك":"Welcome Back"}  
          </Typography>
          <Typography sx={{ color: "#b9bbbe" }}>
              {checked? "سعيد لرؤيتك مجددا":"Happy to see you again"}
          </Typography>

          <Wrapper>
              <Label> {checked? "معرف المستخدم":"User ID"} </Label>
              <Input type="text" placeholder={`${checked? "أدخل اسم المستخدم الخاص بك":"Enter Your User ID"}`} name='email' value={credentials.email} onChange={handleChange}/>
          </Wrapper>

          <Wrapper>
          <Label> {checked? "كلمة المرور":"Password"} </Label>

              <Input type="password" placeholder={`${checked? "ادخل رقمك السري":"Enter Your Password"}`} name="password" value={credentials.password} onChange={handleChange}/>
          </Wrapper>

          {/* <Tooltip title={"Proceed to Login" }> */}
              <div>
                  <Button
                      variant="contained"
                      sx={{
                          bgcolor: "#1A2B63",
                          color: "white",
                          textTransform: "none",
                          fontSize: "16px",
                          fontWeight: 500,
                          width: "100%",
                          height: "40px",
                          margin: "20px 0px",
                      }}
                      onClick={handleLogin}
                  >
                                  <Label> {checked? "تسجيل الدخول":"Log In"} </Label>

                  </Button>
              </div>
          {/* </Tooltip> */}

          {/* <Typography sx={{ color: "#72767d" }} variant="subtitle2">
              {`Don't have an account? `}
              <RedirectText onClick={() => navigate("/register")}>Register here</RedirectText>
          </Typography> */}

      </AuthBox>
      </div>
  );
}

export default Login