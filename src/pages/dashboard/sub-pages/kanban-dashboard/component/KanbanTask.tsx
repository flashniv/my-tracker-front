import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { Task } from "../../../../../type/Task";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useContext, useState } from "react";
import { TaskStatus } from "../../../../../type/TaskStatus";
import API from "../../../../../common/API";
import { NotificationContext, NotificationContextMessage } from "../../../../../common/NotificationContext";
import { KanbanTasksContext } from "./KanbanTaskContext";
import KanbanTaskEditDialog from "./KanbanTaskEditDialog";
import { TaskQuadrant } from "../../../../../type/TaskQuadrant";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

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

    function clickPlay() {
        if (props.task.taskStatus === TaskStatus.NEW) {
            changeTaskStatus(TaskStatus.IN_PROGRESS);
        }
        if (props.task.taskStatus === TaskStatus.IN_PROGRESS) {
            changeTaskStatus(TaskStatus.DONE);
        }
        if (props.task.taskStatus === TaskStatus.DONE) {
            if (window.confirm("Are you soriusly?")) {
                changeTaskStatus(TaskStatus.ARCHIVED);
            }
        }
    }

    function changeTaskStatus(taskStatus: TaskStatus) {
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
                const alertMessage: NotificationContextMessage = {
                    message: "Done!",
                    severity: "success",
                    duration: 700
                }
                notificationContext(alertMessage);
            })
            .catch((error) => {
                const alertMessage: NotificationContextMessage = {
                    message: error.message,
                    severity: "error",
                    duration: 5000
                }
                notificationContext(alertMessage);
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
            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                {props.task.taskQuadrant === TaskQuadrant.URGENT_IMPORTANT ? <PriorityHighIcon color="error" /> : <></>}
                <Box sx={{ textTransform: "uppercase" }}>
                    {props.task.project?.client?.name} - {props.task.project?.name}
                </Box>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
                {getTime(props.task)}
                <IconButton
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={(event) => { event.stopPropagation(); clickPlay(); }}
                    sx={{ padding: "1px" }}
                >
                    <PlayArrowIcon fontSize="small" />
                </IconButton>

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
                    <MenuItem onClick={(event) => { setAnchorEl(null); event.stopPropagation(); changeTaskStatus(TaskStatus.NEW); }}>New</MenuItem>
                    <MenuItem onClick={(event) => { setAnchorEl(null); event.stopPropagation(); changeTaskStatus(TaskStatus.IN_PROGRESS); }}>Progress</MenuItem>
                    <MenuItem onClick={(event) => { setAnchorEl(null); event.stopPropagation(); changeTaskStatus(TaskStatus.BLOCKED); }}>Block</MenuItem>
                    <MenuItem onClick={(event) => { setAnchorEl(null); event.stopPropagation(); changeTaskStatus(TaskStatus.DONE); }}>Done</MenuItem>
                    <MenuItem onClick={(event) => { setAnchorEl(null); event.stopPropagation(); changeTaskStatus(TaskStatus.ARCHIVED); }}>Archive</MenuItem>
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
    const bgColor = isFreshTask(props.task) ? "khaki" : "background.paper";

    function isFreshTask(task: Task): boolean {
        const seconds = (new Date().getTime()) - (new Date(task.createdOn).getTime());
        return seconds < 7200000;
    }

    return (<>
        <Box
            sx={{
                bgcolor: bgColor,
                p: 1,
                border: "1px solid #aaaaaaff",
                borderRadius: "10px",
                boxShadow: "3px 3px 5px #c6c2c2ff"
            }}
            onClick={() => setOpenDialog(true)}
        >
            <KanbanTaskHeader task={props.task} />
            <Box pt={1}>
                {props.task.name}
            </Box>
        </Box >
        <KanbanTaskEditDialog openDialog={openDialog} setOpenDialog={setOpenDialog} task={props.task} />
    </>
    );
}