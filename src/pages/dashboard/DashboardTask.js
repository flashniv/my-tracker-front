import React, {useState} from "react";
import {Box, IconButton, ListItemIcon, Menu, MenuItem} from "@mui/material";
import DashboardTaskPlayer from "./DashboardTaskPlayer";
import ViewTaskDialog from "../../components/ViewTaskDialog/ViewTaskDialog";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Check} from "@mui/icons-material";
import APIServer from "../../API/APIServer";

const options = {
    TITLE: 'Task status',
    DRAFT: 'Draft',
    NEW: 'New',
    VIEWED: 'Viewed',
    READY_TO_PROGRESS: 'Ready to progress',
    IN_PROGRESS: 'In progress',
    ON_TEST: 'On test',
    ON_REVIEW: 'On review',
    BLOCKED: 'Blocked',
    ON_PAUSE: 'Paused',
    DONE: "Completed",
    ARCHIVED: "Archived"
}

export default function DashboardTask({task, updateTasks}) {
    const [openViewDialog, setOpenViewDialog] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(task.status);
    const openStatusMenu = Boolean(anchorEl);

    const handleClickStatusMenu = (event) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, key) => {
        const rows=[task];
        setSelectedIndex(key);
        setAnchorEl(null);
        const response = APIServer.postContent("/api/task/updateStatus?newStatus="+key, rows)
        response.then(() => {
            updateTasks()
        }, (reason) => {
            console.error(reason)
        })

    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Box
                sx={{
                    borderRadius: "10px",
                    boxShadow: "0px 3px 7px grey",
                    textAlign: "left",
                    mb: 1,
                    p: 1,
                    backgroundColor: "white"
                }}
                onClick={() => setOpenViewDialog(true)}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        textTransform: "uppercase",
                        alignItems: "center",
                        mb: 1
                    }}
                >
                    <Box
                        sx={{
                            verticalAlign: "center"
                        }}
                    >
                        {task.project.organization.organizationName} - {task.project.projectName}
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <DashboardTaskPlayer row={task} updateTasks={updateTasks}/>
                        <IconButton size="small" onClick={handleClickStatusMenu}>
                            <MoreVertIcon fontSize="small"/>
                        </IconButton>
                    </Box>
                </Box>
                {task.title}
            </Box>
            {openViewDialog
                ? <ViewTaskDialog task={task} updateTasks={updateTasks} openViewDialog={openViewDialog}
                                  setOpenViewDialog={setOpenViewDialog}/>
                : <></>
            }
            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={openStatusMenu}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                }}
            >
                {Object.keys(options).map((key, index) => (
                    <MenuItem
                        key={key}
                        disabled={index === 0}
                        selected={key.localeCompare(selectedIndex) === 0}
                        onClick={(event) => handleMenuItemClick(event, key)}
                    >
                        <ListItemIcon>
                            {key.localeCompare(selectedIndex) === 0
                                ? <Check/>
                                : <></>
                            }
                        </ListItemIcon>
                        {options[key]}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}