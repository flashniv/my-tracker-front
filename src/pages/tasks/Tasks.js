import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {
    Alert,
    Backdrop,
    Box, Button,
    CircularProgress,
    Fab,
    Modal,
    Paper, Stack,
    Table,
    TableBody,
    TableContainer, TextField, Typography
} from "@mui/material";
import APIServer from "../../API/APIServer";
import AddIcon from "@mui/icons-material/Add";
import TasksItem from "./TasksItem";

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


export default function Tasks({setTitle}) {
    const [alert,setAlert]=useState(<></>)
    const {projectId}=useParams()
    const [tasks,setTasks]=useState()
    const [openAddDialog, setOpenAddDialog] = useState(false)

    const [newTitle,setNewTitle]=useState("")
    const [newDesc,setNewDesc]=useState("")

    const onError = function (err) {
        setAlert(<Alert severity="error">Server return {err.response.status}</Alert>)
    }

    const updateTasks = function () {
        const response = APIServer.getContent("/api/project/"+projectId+"/tasks");
        response.then((value) => {
            console.log(value.data)
            setTasks(value.data)
        }, onError)
    }

    const addTask=function () {
        const proj={
            "id": projectId,
            "organization": null,
            "projectName": null
        }
        const task={
            "project": proj,
            "id": null,
            "title": newTitle,
            "description": newDesc,
        }
        const response = APIServer.postContent("/api/task/",task)
        response.then(()=>{
            updateTasks()
            setNewTitle("")
            setNewDesc("")
            setOpenAddDialog(false)
            setAlert(<Alert severity="success">Task was added!</Alert>)
        },onError)
    }

    useEffect(() => {
        setTitle("Tasks")
        updateTasks()
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
            { tasks === undefined
                ?<Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                :<></>
            }
            { tasks!==undefined && tasks.length !== 0
                ? <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableBody>
                            {tasks.map((row) => (
                                <TasksItem setAlert={setAlert} updateTasks={updateTasks} row={row} key={row.id}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                : <></>
            }
            { tasks!==undefined && tasks.length === 0
                ? <Box>You can add task with "+" button</Box>
                : <></>
            }
            <Modal
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Stack style={style} spacing={2}>
                    <Typography id="modal-modal-title" align="center" variant="h6" component="h2">
                        Add task
                    </Typography>
                    <TextField fullWidth required label="Title" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} variant="outlined"/>
                    <TextField fullWidth label="Description" multiline rows={4} value={newDesc} onChange={(e)=>setNewDesc(e.target.value)} />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row-reverse',
                            p: 1
                        }}
                    >
                        <Button onClick={addTask}>Add</Button>
                    </Box>
                </Stack>
            </Modal>

        </>
    );
}