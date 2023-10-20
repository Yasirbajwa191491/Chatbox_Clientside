import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import { Button,TextField} from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useAppSelector } from "../../../../store";
import { addMembersToGroupAction } from "../../../../actions/groupChatActions";
import axios from "axios";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
interface Depart{
    _id:number,
    name:string
  }
const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
];
interface User {
    _id: string;
    username: string;
    name:string
}
function getStyles(name: string, personName: string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}


interface Props {
    isDialogOpen: boolean;
    closeDialogHandler: () => void;
}

const AddMembersToGroupDialog = ({
    isDialogOpen,
    closeDialogHandler,
}: Props) => {
    const {
        friends: { friends },
        chat: { chosenGroupChatDetails },
    } = useAppSelector((state) => state);
    
    const currentGroupMembers = chosenGroupChatDetails?.participants.map(
        (participant) => {
            return participant._id.toString();
        }
    );
    const theme = useTheme();
    const [friendIds, setFriendIds] = React.useState<string[]>(
        currentGroupMembers || []
    );
  const [sectionList,setSectionList]=useState<Depart[]>([]);
  const [departmentList,setDepartentList]=useState<Depart[]>([])

    const [usersList, setUserList] = useState<User[]>( []);
    const [userId,setUserId]=useState("")
    const [data, setData] = useState({department:"",section:""});
    const changeHandler = (e:any) => {
        setData({ ...data, [e.target.name]: e.target.value });
      };

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
    const handleChange = (event: SelectChangeEvent<typeof friendIds>) => {
        const {
            target: { value },
        } = event;
        setFriendIds(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    const dispatch = useDispatch();

    const handleCloseDialog = () => {
        closeDialogHandler();
    };

    const handleClick = () => {
        dispatch(addMembersToGroupAction({
            friendIds,
            groupChatId: chosenGroupChatDetails?.groupId as string
        }, handleCloseDialog));
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
      const fetchAllsection=async(e:any)=>{
        try {
          const response = await axios.get("http://localhost:8000/section/section_list/"+e.target.value);
          if (response.status === 200) {
            setSectionList(response.data);
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

      useEffect(()=>{
        FetchAllUsers();
        FetchAllDepartment()
      },[])
    return (
        <div>
            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>
                    <Typography>Add friends to "{chosenGroupChatDetails?.groupName}" group</Typography>
                </DialogTitle>
                <DialogContent>
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
              value={userId}
              onChange={(e)=>userIdHanlder(e)}
            />
         </div>
                    <DialogContentText>
                        <Typography>Select friends to add</Typography>
                    </DialogContentText>

                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-name-label">
                            Name
                        </InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            multiple
                            value={friendIds}
                            onChange={handleChange}
                            input={<OutlinedInput label="Name" />}
                            MenuProps={MenuProps}
                        >
                            {usersList?.map((friend) => (
                                <MenuItem
                                    key={friend._id}
                                    value={friend._id}
                                    style={getStyles(friend.username, friendIds, theme)}
                                >
                                    {friend.username} ({friend?.name})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
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
                            marginLeft: "15px",
                            marginRight: "15px",
                            marginBottom: "10px",
                        }}
                        onClick={handleClick}
                        disabled={friendIds.length === 0}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddMembersToGroupDialog;
