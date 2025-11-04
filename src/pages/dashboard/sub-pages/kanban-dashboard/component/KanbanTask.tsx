import { Box, IconButton, Menu, MenuItem, Paper } from "@mui/material";
import { Task } from "../../../../../type/Task";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";

interface KanbanTaskHeaderProps {
    task: Task
}

function KanbanTaskHeader(props: KanbanTaskHeaderProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function getTime(task: Task): number {
        let time = 0;

        task.timeRecords?.forEach(timeRecord => {
            if (timeRecord.accountingPeriod.open) {
                time += timeRecord.duration;
            }
        });

        return time;
    }

    return (
        <Box
            display={"flex"}
            justifyContent={"space-between"}
        >
            <Box sx={{ textTransform: "uppercase" }}>
                {props.task.project?.client?.name} - {props.task.project?.name}
            </Box>
            <Box>
                {getTime(props.task)}
                <IconButton
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{ padding: "1px" }}
                >
                    <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                        list: {
                            'aria-labelledby': 'basic-button',
                        },
                    }}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}

interface KanbanTaskProps {
    task: Task
}

export default function KanbanTask(props: KanbanTaskProps) {
    return (
        <Paper
            sx={{ p: 1 }}
        >
            <KanbanTaskHeader task={props.task} />
            <Box pt={1}>
                {props.task.name}
            </Box>
        </Paper>
    );
}