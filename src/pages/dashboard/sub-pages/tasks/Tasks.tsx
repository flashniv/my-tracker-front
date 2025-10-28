import { Box, CircularProgress, Container, Paper, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationContext } from "../../../../common/NotificationContext";
import AddIcon from '@mui/icons-material/Add';
//import ProjectAddDialog from "./component/ProjectAddDialog";
import API from "../../../../common/API";
import TaskAddDialog from "./component/TaskAddDialog";

interface TaskItemProps {
    task: Task,
    onClick: () => void
}

function TaskItem(props: TaskItemProps) {
    return (
        <Paper elevation={3} sx={{ p: 2, cursor: "pointer" }} onClick={props.onClick} >
            {props.task.name}
        </Paper>
    )
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
    const navigate = useNavigate();
    let id = -1;

    props.setTitle("Tasks");

    if (params.id != undefined) {
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
                notificationContext(error.message);
                setPlaceHolder(false);
            });
    }

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
                                <TaskItem key={task.id} task={task} onClick={() => { }} />
                            )}
                        </>}
                </Stack>
            </Container>
            <TaskAddDialog openDialog={openAddDialog} setOpenDialog={setOpenAddDialog} updateTasks={updateTasks} projectId={id} />
        </Box>
    );
}