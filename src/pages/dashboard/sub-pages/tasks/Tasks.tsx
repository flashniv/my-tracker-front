import { Box, CircularProgress, Container, Paper, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NotificationContext, NotificationContextMessage } from "../../../../common/NotificationContext";
import AddIcon from '@mui/icons-material/Add';
import API from "../../../../common/API";
import TaskAddDialog from "./component/TaskAddDialog";
import TaskEditDialog from "./component/TaskEditDialog";
import { Task } from "../../../../type/Task";

interface TaskItemProps {
    task: Task,
    updateTasks: () => void
}

function TaskItem(props: TaskItemProps) {
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

    return (<>
        <Paper elevation={3} sx={{ p: 2, cursor: "pointer" }} onClick={() => { setOpenEditDialog(true); }} >
            {props.task.name}
        </Paper>
        <TaskEditDialog openDialog={openEditDialog} setOpenDialog={setOpenEditDialog} task={props.task} updateTasks={props.updateTasks} />
    </>
    );
}

interface TasksProps {
    setTitle: (title: string) => void
}

export default function Tasks(props: TasksProps) {
    const params = useParams();
    const [Tasks, setTasks] = useState<Task[]>([]);
    const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
    const notificationContext = useContext(NotificationContext);
    const [placeHolder, setPlaceHolder] = useState<boolean>(true);
    let id = -1;

    props.setTitle("Tasks");

    if (params.id !== undefined) {
        id = parseInt(params.id);
    }

    function updateTasks() {
        setPlaceHolder(true);
        API.getContent<Task[]>("/project/" + id + "/tasks")
            .then((persistTasks) => {
                setTasks(persistTasks.data);
                setPlaceHolder(false);
            })
            .catch((error) => {
                const alertMessage: NotificationContextMessage = {
                    message: error.message,
                    severity: "error",
                    duration: 5000
                }
                notificationContext(alertMessage);
                setPlaceHolder(false);
            });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(updateTasks, []);

    return (
        <Box sx={{ pt: 5 }}>
            <Container maxWidth="lg">
                <Stack spacing={2}>
                    {placeHolder ? <Box display={"flex"} justifyContent={"center"} sx={{ pt: 5 }}>
                        <CircularProgress color="primary" size="3rem" />
                    </Box>
                        : <>
                            <Paper elevation={3} sx={{ p: 2, textAlign: "center", bgcolor: "lightblue", cursor: "pointer" }} onClick={() => setOpenAddDialog(true)} ><AddIcon fontSize="medium" /></Paper>
                            {Tasks.map((task) =>
                                <TaskItem key={task.id} task={task} updateTasks={updateTasks} />
                            )}
                        </>}
                </Stack>
            </Container>
            <TaskAddDialog openDialog={openAddDialog} setOpenDialog={setOpenAddDialog} updateTasks={updateTasks} projectId={id} />
        </Box>
    );
}