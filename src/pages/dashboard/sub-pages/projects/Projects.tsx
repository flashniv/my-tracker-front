import { Box, CircularProgress, Container, Paper, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationContext } from "../../../../common/NotificationContext";
import AddIcon from '@mui/icons-material/Add';
import ProjectAddDialog from "./component/ProjectAddDialog";
import API from "../../../../common/API";

interface ProjectItemProps {
    project: Project,
    onClick: () => void
}

function ProjectItem(props: ProjectItemProps) {
    return (
        <Paper elevation={3} sx={{ p: 2, cursor: "pointer" }} onClick={props.onClick}>
            {props.project.name}
        </Paper>
    )
}

interface ProjectsProps {
    setTitle: (title: string) => void
}

export default function Projects(props: ProjectsProps) {
    const params = useParams();
    const [projects, setProjects] = useState<Project[]>([]);
    const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
    const notificationContext = useContext(NotificationContext);
    const navigate = useNavigate();
    const [placeHolder, setPlaceHolder] = useState<boolean>(true);
    let id = -1;

    props.setTitle("Projects");

    if (params.id != undefined) {
        id = parseInt(params.id);
    }

    function updateProjects() {
        setPlaceHolder(true);
        API.getContent<Project[]>("/client/" + id + "/projects")
            .then((persistProjects) => {
                setProjects(persistProjects.data);
                setPlaceHolder(false);
            })
            .catch((error) => {
                notificationContext(error.message);
                setPlaceHolder(false);
            });
    }

    useEffect(updateProjects, []);

    return (
        <Box sx={{ pt: 5 }}>
            <Container maxWidth="lg">
                <Stack spacing={2}>
                    {placeHolder ? <Box display={"flex"} justifyContent={"center"} sx={{ pt: 5 }}>
                        <CircularProgress color="primary" size="3rem" />
                    </Box>
                        : <>
                            <Paper elevation={3} sx={{ p: 2, textAlign: "center", bgcolor: "lightblue", cursor: "pointer" }} onClick={() => setOpenAddDialog(true)} ><AddIcon fontSize="medium" /></Paper>
                            {projects.map((project) =>
                                <ProjectItem key={project.id} project={project} onClick={() => navigate("/dashboard/task/" + (project.id != null ? project.id : -1))} />
                            )}
                        </>}
                </Stack>
            </Container>
            <ProjectAddDialog openDialog={openAddDialog} setOpenDialog={setOpenAddDialog} updateProjects={updateProjects} clientId={id} />
        </Box>
    );
}