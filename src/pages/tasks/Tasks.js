import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Alert, Backdrop, Box, CircularProgress, Fab, Paper, Table, TableBody, TableContainer} from "@mui/material";
import APIServer from "../../API/APIServer";
import AddIcon from "@mui/icons-material/Add";
import ProjectsItem from "../projects/ProjectsItem";
import TasksItem from "./TasksItem";

export default function Tasks() {
    const [alert,setAlert]=useState(<></>)
    const {projectId}=useParams()
    const [tasks,setTasks]=useState()

    const onError = function (err) {
        setAlert(<Alert severity="error">Server return {err.response.status}</Alert>)
    }

    const updateTasks = function () {
        const response = APIServer.getContent("/api/project/"+projectId+"/tasks");
        response.then((value) => {
            setTasks(value.data)
        }, onError)
    }

    useEffect(() => {
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
                onClick={() => console.log("add")}
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
                ? <Box>You can add organization with "+" button</Box>
                : <></>
            }

        </>
    );
}