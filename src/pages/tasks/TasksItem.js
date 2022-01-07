import React from "react";
import {useNavigate} from "react-router-dom";
import {Alert, IconButton, Menu, MenuItem, TableCell, TableRow} from "@mui/material";
import APIServer from "../../API/APIServer";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TasksPlayer from "./TasksPlayer";

export default function TasksItem({setAlert,updateTasks,row}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    let navigate=useNavigate()
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const onError = function (err) {
        setAlert(<Alert severity="error">Server return {err.response.status}!</Alert>)
    }

    const onDelete = () => {
        if(window.confirm("Delete it?")){
            const response = APIServer.postContent("/api/project/delete/",row)
            response.then(()=>{
                updateTasks()
                setAlert(<Alert severity="success">Project was deleted!</Alert>)
            },onError)
        }
        handleClose()
    }

    return(
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell>{row.status}</TableCell>
            <TableCell
                onClick={()=>navigate("/task/"+row.id,{replace:true})}
                sx={{
                    minWidth:'600px',
                    fontSize:'large',
                    cursor:'pointer'
                }}
            >{row.title}</TableCell>
            <TableCell>
                <TasksPlayer row={row}/>
            </TableCell>
            <TableCell
                sx={{
                    textAlign:"right",
                }}
            >
                <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id={"basic-menu"}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={onDelete}>Delete</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
}