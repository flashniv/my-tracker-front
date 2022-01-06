import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Alert, Backdrop, CircularProgress, Fab} from "@mui/material";
import APIServer from "../../API/APIServer";
import AddIcon from "@mui/icons-material/Add";

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
        </>
    );
}