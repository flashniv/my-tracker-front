import { Box, Chip, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { Task } from "../../../../../type/Task";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useContext, useState } from "react";
import { TaskStatus } from "../../../../../type/TaskStatus";
import { TaskType } from "../../../../../type/TaskType";
import { TaskQuadrant } from "../../../../../type/TaskQuadrant";
import API from "../../../../../common/API";
import { NotificationContext, NotificationContextMessage } from "../../../../../common/NotificationContext";
import { KanbanTasksContext } from "./KanbanTaskContext";
import KanbanTaskEditDialog from "./KanbanTaskEditDialog";

// Eisenhower quadrant -> accent palette token + short action label.
// Use sx tokens (resolved by the theme) instead of Chip `color` props: the
// custom theme only styles default/success/error chips, so color="info"/"warning"
// would fall back to MUI's machinery and crash on this palette.
const quadrantMeta: Record<TaskQuadrant, { token: string; label: string }> = {
    [TaskQuadrant.URGENT_IMPORTANT]: { token: "error.main", label: "Do" },
    [TaskQuadrant.NO_URGENT_IMPORTANT]: { token: "info.main", label: "Plan" },
    [TaskQuadrant.URGENT_NO_IMPORTANT]: { token: "warning.main", label: "Delegate" },
    [TaskQuadrant.NO_URGENT_NO_IMPORTANT]: { token: "text.secondary", label: "Drop" },
    [TaskQuadrant.NOT_CLASSIFIED]: { token: "text.secondary", label: "" },
};

// Task type -> compact size badge
const typeMeta: Record<TaskType, string> = {
    [TaskType.MICRO]: "XS",
    [TaskType.SMALL]: "S",
    [TaskType.MEDIUM]: "M",
    [TaskType.LONG]: "L",
    [TaskType.EXTRA_LONG]: "XL",
    [TaskType.NOT_CLASSIFIED]: "",
};

function accentColor(quadrant: TaskQuadrant): string {
    const token = quadrantMeta[quadrant].token;
    return token === "text.secondary" ? "divider" : token;
}

function getOpenTime(task: Task): number {
    let minutes = 0;
    task.timeRecords?.forEach(timeRecord => {
        if (timeRecord.accountingPeriod.open) {
            minutes += timeRecord.duration;
        }
    });
    return minutes / 60;
}

function formatHours(hours: number): string {
    return `${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`;
}

function formatAge(createdOn: Date): string {
    const days = Math.floor((Date.now() - new Date(createdOn).getTime()) / 86_400_000);
    if (days <= 0) return "today";
    if (days === 1) return "1d";
    if (days < 30) return `${days}d`;
    return `${Math.floor(days / 30)}mo`;
}

function isFreshTask(task: Task): boolean {
    return (new Date().getTime() - new Date(task.createdOn).getTime()) < 7200000;
}

interface KanbanTaskHeaderProps {
    task: Task;
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
        };
        API.putContent<Task, string>("/task", newTask)
            .then(() => {
                kanbanTasksContext[1]();
                const alertMessage: NotificationContextMessage = {
                    message: "Done!",
                    severity: "success",
                    duration: 700
                };
                notificationContext(alertMessage);
            })
            .catch((error) => {
                const alertMessage: NotificationContextMessage = {
                    message: error.message,
                    severity: "error",
                    duration: 5000
                };
                notificationContext(alertMessage);
                kanbanTasksContext[1]();
            });
    }

    return (
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={0.5}>
            <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600, minWidth: 0, mt: "4px" }}
            >
                {props.task.project?.client?.name} · {props.task.project?.name}
            </Typography>
            <Box display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
                <Tooltip title="Advance status">
                    <IconButton
                        onClick={(event) => { event.stopPropagation(); clickPlay(); }}
                        sx={{ p: "1px" }}
                    >
                        <PlayArrowIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <IconButton
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{ p: "1px" }}
                >
                    <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
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
    task: Task;
}

export default function KanbanTask(props: KanbanTaskProps) {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const task = props.task;
    const quadrant = quadrantMeta[task.taskQuadrant];
    const typeLabel = typeMeta[task.taskType];
    const hours = getOpenTime(task);
    const fresh = isFreshTask(task);

    return (<>
        <Box
            onClick={() => setOpenDialog(true)}
            sx={{
                position: "relative",
                bgcolor: "background.paper",
                p: 1,
                pl: 1.5,
                border: "1px solid",
                borderColor: "divider",
                borderLeft: "4px solid",
                borderLeftColor: accentColor(task.taskQuadrant),
                borderRadius: 2,
                boxShadow: 1,
                cursor: "pointer",
                transition: "transform .12s ease, box-shadow .12s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                },
            }}
        >
            <KanbanTaskHeader task={task} />

            <Typography sx={{ pt: 0.5, fontWeight: 500, lineHeight: 1.3, overflowWrap: "anywhere" }}>
                {task.name}
            </Typography>

            <Box display="flex" alignItems="center" flexWrap="wrap" gap={0.5} pt={1}>
                {quadrant.label && (
                    <Chip
                        size="small"
                        label={quadrant.label}
                        variant="outlined"
                        sx={{
                            height: 20,
                            fontSize: "0.68rem",
                            bgcolor: "transparent",
                            borderColor: quadrant.token,
                            color: quadrant.token,
                            "& .MuiChip-label": { color: quadrant.token },
                        }}
                    />
                )}
                {typeLabel && (
                    <Chip
                        size="small"
                        label={typeLabel}
                        variant="outlined"
                        sx={{
                            height: 20,
                            fontSize: "0.68rem",
                            bgcolor: "transparent",
                            borderColor: "divider",
                            color: "text.secondary",
                            "& .MuiChip-label": { color: "text.secondary" },
                        }}
                    />
                )}
                {fresh && (
                    <Chip
                        size="small"
                        label="NEW"
                        color="success"
                        sx={{ height: 20, fontSize: "0.68rem" }}
                    />
                )}
                <Box flexGrow={1} />
                {hours > 0 && (
                    <Tooltip title="Time in open accounting period">
                        <Box display="flex" alignItems="center" gap={0.25} color="text.secondary">
                            <AccessTimeIcon sx={{ fontSize: "0.9rem" }} />
                            <Typography variant="caption">{formatHours(hours)}</Typography>
                        </Box>
                    </Tooltip>
                )}
                <Typography variant="caption" color="text.disabled" sx={{ ml: 0.5 }}>
                    {formatAge(task.createdOn)}
                </Typography>
            </Box>
        </Box>
        <KanbanTaskEditDialog openDialog={openDialog} setOpenDialog={setOpenDialog} task={task} />
    </>);
}
