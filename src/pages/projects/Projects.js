import React, {useEffect, useState} from "react";
import {Alert, Backdrop, Box, CircularProgress, Fab, Paper, Table, TableBody, TableContainer} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {useParams} from "react-router-dom";
import APIServer from "../../API/APIServer";
import ProjectsItem from "./ProjectsItem";

export default function Projects({setTitle}) {
    const [alert,setAlert]=useState(<></>)
    const {orgId}=useParams()
    const [projects,setProjects]=useState()

    const onError = function (err) {
        setAlert(<Alert severity="error">Server return {err.response.status}</Alert>)
    }

    const updateProjects = function () {
        const response = APIServer.getContent("/api/organization/"+orgId+"/projects");
        response.then((value) => {
            setProjects(value.data)
        }, onError)
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
                onClick={() => console.log("add")}
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
        </>
    );
}