import React from "react";
import {Box, IconButton, Menu, MenuItem, Typography} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DashboardTask from "./DashboardTask";
import APIServer from "../../API/APIServer";

export default function DashboardColumn({title, rows, updateTasks}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const archiveAllTasks=()=>{
        const response = APIServer.postContent("/api/task/updateStatus?newStatus=ARCHIVED", rows)
        response.then(() => {
            updateTasks()
        }, () => {
        })

        setAnchorEl(null);
    }
    return (
        <>
            <Box
                sx={{
                    width: "25%",
                    textAlign: "center",
                    zIndex: "1",
                    m: 1,
                    p: 1,
                    backgroundColor: "#c7ffc7"
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    <Typography sx={{width: "100%"}} variant="h5" component="h3">
                        {title}
                    </Typography>
                    <IconButton onClick={handleClick}>
                        <MoreVertIcon/>
                    </IconButton>
                </Box>
                {rows.map((task) => <DashboardTask task={task} key={task.id} updateTasks={updateTasks}/>)}
            </Box>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={archiveAllTasks}>Archive all tasks</MenuItem>
            </Menu>
        </>
    )
}