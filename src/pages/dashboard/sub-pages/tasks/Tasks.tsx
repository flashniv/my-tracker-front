import { Box, Container, Paper, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationContext } from "../../../../common/NotificationContext";
import AddIcon from '@mui/icons-material/Add';
//import ProjectAddDialog from "./component/ProjectAddDialog";
import API from "../../../../common/API";

interface TaskItemProps {
    task: Task,
    onClick: () => void
}

function TaskItem(props: TaskItemProps) {
    return (
        <Paper elevation={3} sx={{ p: 2, cursor: "pointer" }}>
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
    const navigate = useNavigate();
    let id = -1;

    props.setTitle("Tasks");

    if (params.id != undefined) {
        id = parseInt(params.id);
    }

    function updateTasks() {
        API.getContent<Task[]>("/project/" + id + "/tasks")
            .then((persistTasks) => {
                setTasks(persistTasks.data);
            })
            .catch((error) => {
                notificationContext(error.message);
            });
    }

    useEffect(updateTasks, []);

    return (
        <Box sx={{ pt: 5 }}>
            <Container maxWidth="lg">
                <Stack spacing={2}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: "center", bgcolor: "lightblue", cursor: "pointer" }} onClick={() => setOpenAddDialog(true)} ><AddIcon fontSize="medium" /></Paper>
                    {Tasks.map((task) =>
                        <TaskItem key={task.id} task={task} onClick={() => navigate("/dashboard/task/" + id)} />
                    )}
                </Stack>
            </Container>
            {/* <ProjectAddDialog openDialog={openAddDialog} setOpenDialog={setOpenAddDialog} updateTasks={updateTasks} clientId={id} /> */}
        </Box>
    );
}