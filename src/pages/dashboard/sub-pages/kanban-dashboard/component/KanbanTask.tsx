import { Box, IconButton, Menu, MenuItem, Paper } from "@mui/material";
import { Task } from "../../../../../type/Task";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useContext, useState } from "react";
import { TaskStatus } from "../../../../../type/TaskStatus";
import API from "../../../../../common/API";
import { NotificationContext } from "../../../../../common/NotificationContext";
import { KanbanTasksContext } from "./KanbanTaskContext";
import KanbanTaskEditDialog from "./KanbanTaskEditDialog";

interface KanbanTaskHeaderProps {
    task: Task
}

function KanbanTaskHeader(props: KanbanTaskHeaderProps) {
    const notificationContext = useContext(NotificationContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const kanbanTasksContext = useContext(KanbanTasksContext);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };
    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(null);
        event.stopPropagation();
    };

    function changeTaskStatus(event: React.MouseEvent<HTMLLIElement>, taskStatus: TaskStatus) {
        setAnchorEl(null);
        event.stopPropagation();
        const newTask: Task = {
            id: props.task.id,
            name: props.task.name,
            description: props.task.description,
            taskType: props.task.taskType,
            taskQuadrant: props.task.taskQuadrant,
            taskStatus: taskStatus,
            project: props.task.project,
            createdOn: new Date(),
            timeRecords: null
        }
        API.putContent<Task, string>("/task", newTask)
            .then(() => {
                kanbanTasksContext[1]();
            })
            .catch((error) => {
                notificationContext(error.message);
                kanbanTasksContext[1]();
            });

    }

    function getTime(task: Task): number {
        let time = 0;

        task.timeRecords?.forEach(timeRecord => {
            if (timeRecord.accountingPeriod.open) {
                time += timeRecord.duration;
            }
        });
        time = time / 60;

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
                    <MenuItem onClick={(event) => changeTaskStatus(event, TaskStatus.NEW)}>New</MenuItem>
                    <MenuItem onClick={(event) => changeTaskStatus(event, TaskStatus.IN_PROGRESS)}>Progress</MenuItem>
                    <MenuItem onClick={(event) => changeTaskStatus(event, TaskStatus.BLOCKED)}>Block</MenuItem>
                    <MenuItem onClick={(event) => changeTaskStatus(event, TaskStatus.DONE)}>Done</MenuItem>
                    <MenuItem onClick={(event) => changeTaskStatus(event, TaskStatus.ARCHIVED)}>Archive</MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}

interface KanbanTaskProps {
    task: Task
}

export default function KanbanTask(props: KanbanTaskProps) {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    return (<>
        <Box
            sx={{
                bgcolor: "background.paper",
                p: 1,
                border: "1px solid #aaaaaaff",
                borderRadius: "10px",
                boxShadow: "0px 0px 15px lightgrey"
            }}
            onClick={() => setOpenDialog(true)}
        >
            <KanbanTaskHeader task={props.task} />
            <Box pt={1}>
                {props.task.name}
            </Box>
        </Box>
        <KanbanTaskEditDialog openDialog={openDialog} setOpenDialog={setOpenDialog} task={props.task} />
    </>
    );
}