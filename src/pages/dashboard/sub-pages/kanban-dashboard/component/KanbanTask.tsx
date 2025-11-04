import { Box, IconButton, Menu, MenuItem, Paper } from "@mui/material";
import { Task } from "../../../../../type/Task";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useContext, useState } from "react";
import { TaskStatus } from "../../../../../type/TaskStatus";
import API from "../../../../../common/API";
import { NotificationContext } from "../../../../../common/NotificationContext";
import TaskAddDialog from "../../tasks/component/TaskAddDialog";
import TaskEditDialog from "../../tasks/component/TaskEditDialog";

interface KanbanTaskHeaderProps {
    task: Task,
    updateTasks: () => void,
}

function KanbanTaskHeader(props: KanbanTaskHeaderProps) {
    const notificationContext = useContext(NotificationContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };
    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(null);
        event.stopPropagation();
    };

    function changeTaskStatus(event: React.MouseEvent<HTMLLIElement>,taskStatus: TaskStatus) {
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
            timeRecords: null
        }
        API.putContent<Task, string>("/task", newTask)
            .then(() => {
                props.updateTasks();
            })
            .catch((error) => {
                notificationContext(error.message);
                props.updateTasks();
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
                    <MenuItem onClick={(event) => changeTaskStatus(event,TaskStatus.NEW)}>New</MenuItem>
                    <MenuItem onClick={(event) => changeTaskStatus(event,TaskStatus.IN_PROGRESS)}>Progress</MenuItem>
                    <MenuItem onClick={(event) => changeTaskStatus(event,TaskStatus.BLOCKED)}>Block</MenuItem>
                    <MenuItem onClick={(event) => changeTaskStatus(event,TaskStatus.DONE)}>Done</MenuItem>
                    <MenuItem onClick={(event) => changeTaskStatus(event,TaskStatus.ARCHIVED)}>Archive</MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}

interface KanbanTaskProps {
    task: Task,
    updateTasks: () => void
}

export default function KanbanTask(props: KanbanTaskProps) {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    return (<>
        <Paper sx={{ p: 1 }} onClick={() => setOpenDialog(true)}>
            <KanbanTaskHeader task={props.task} updateTasks={props.updateTasks} />
            <Box pt={1}>
                {props.task.name}
            </Box>
        </Paper>
        <TaskEditDialog openDialog={openDialog} setOpenDialog={setOpenDialog} task={props.task} updateTasks={props.updateTasks} />
    </>
    );
}