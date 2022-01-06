import React, {useEffect, useState} from "react";
import {
    Alert,
    Backdrop,
    Box, Button,
    CircularProgress,
    Fab,
    Modal,
    Paper,
    Table,
    TableBody,
    TableContainer, TextField, Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {useParams} from "react-router-dom";
import APIServer from "../../API/APIServer";
import ProjectsItem from "./ProjectsItem";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    // height: 400,
    backgroundColor: '#fff',
    border: '2px solid #000',
    boxShadow: 24,
    padding: '20px',
};


export default function Projects({setTitle}) {
    const [alert,setAlert]=useState(<></>)
    const {orgId}=useParams()
    const [projects,setProjects]=useState()
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [projectName,setProjectName] = useState("")


    const onError = function (err) {
        setAlert(<Alert severity="error">Server return {err.response.status}</Alert>)
    }

    const updateProjects = function () {
        const response = APIServer.getContent("/api/organization/"+orgId+"/projects");
        response.then((value) => {
            setProjects(value.data)
        }, onError)
    }
    const addProject = function () {
        const org={
            "id": orgId,
            "organizationName": null,
            "owner": null
        }
        const proj={
            "id": null,
            "organization": org,
            "projectName": projectName
        }
        const response = APIServer.postContent("/api/project/",proj)
        response.then(()=>{
            updateProjects()
            setOpenAddDialog(false)
            setAlert(<Alert severity="success">Project was added!</Alert>)
        },onError)
    }

    useEffect(() => {
        setTitle("Projects")
        updateProjects()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {alert}
            <Fab
                sx={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px'
                }}
                color="primary"
                onClick={() => setOpenAddDialog(true)}
            >
                <AddIcon/>
            </Fab>
            { projects === undefined
                ?<Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                :<></>
            }
            { projects!==undefined && projects.length !== 0
                ? <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableBody>
                            {projects.map((row) => (
                                <ProjectsItem setAlert={setAlert} updateProjects={updateProjects} row={row} key={row.id}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                : <></>
            }
            { projects!==undefined && projects.length === 0
                ? <Box>You can add project with "+" button</Box>
                : <></>
            }
            <Modal
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box style={style}>
                    <Typography id="modal-modal-title" align="center" variant="h6" component="h2">
                        Add project
                    </Typography>
                    <TextField fullWidth required value={projectName} onChange={(event)=>setProjectName(event.target.value)} label="Project name" variant="outlined"/>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row-reverse',
                            p: 1
                        }}
                    >
                        <Button onClick={addProject}>Add</Button>
                    </Box>
                </Box>
            </Modal>

        </>
    );
}