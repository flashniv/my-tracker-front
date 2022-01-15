import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Alert, IconButton, Menu, MenuItem, TableCell, TableRow} from "@mui/material";
import APIServer from "../../API/APIServer";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TasksPlayer from "./TasksPlayer";
import CachedIcon from '@mui/icons-material/Cached';
import PauseIcon from '@mui/icons-material/Pause';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CheckIcon from '@mui/icons-material/Check';

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

    const getStatusIcon=function (status) {
        switch (status) {
            case "NEW":
                return (<NewReleasesIcon/>)
            case "ON_PAUSE":
                return (<PauseIcon />)
            case "IN_PROGRESS":
                return (<CachedIcon />)
            case "DONE":
                return (<CheckIcon/>)
            default:
                return (<>status</>)
        }
    }

    return(
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell>{getStatusIcon(row.status)}</TableCell>
            <TableCell
                onClick={()=>navigate("/task/"+row.id,{replace:true})}
                sx={{
                    minWidth:'600px',
                    fontSize:'large',
                    cursor:'pointer'
                }}
            >{row.title}</TableCell>
            <TableCell>
                <TasksPlayer row={row} updateTasks={updateTasks}/>
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