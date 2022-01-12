import React, {useEffect, useState} from "react";
import {Backdrop, CircularProgress, Fab, Stack} from "@mui/material";
import DashboardColumn from "./DashboardColumn";
import APIServer from "../../API/APIServer";
import AddIcon from "@mui/icons-material/Add";
import AddTaskDialog from "../../components/AddTaskDialog/AddTaskDialog";

export default function Dashboard() {
    const [load, setLoad] = useState(true)
    const [newTasks, setNewTasks] = useState([]);
    const [readyTasks, setReadyTasks] = useState([]);
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [completeTasks, setCompleteTasks] = useState([]);

    //Add dialog
    const [openAddDialog, setOpenAddDialog] = useState(false)

    const onError = function (err) {
        //setAlert(<Alert severity="error">Server return {err.response.status}</Alert>)   //TODO release it
    }

    const updateTasks = function () {
        setLoad(true)
        const response = APIServer.getContent("/api/task/");
        response.then((value) => {
            setNewTasks(value.data.filter((task) => task.history && task.history.length > 0 && task.history[0].status.localeCompare("NEW") === 0))
            setInProgressTasks(value.data.filter((task) => task.history && task.history.length > 0 && task.history[0].status.localeCompare("IN_PROGRESS") === 0))
            setCompleteTasks(value.data.filter((task) => task.history && task.history.length > 0 && task.history[0].status.localeCompare("DONE") === 0))
            setReadyTasks(value.data.filter((task) => task.history && task.history.length > 0 && task.history[0].status.localeCompare("ON_PAUSE") === 0))
            setLoad(false)
        }, onError)
    }
    useEffect(() => {
        updateTasks()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
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
            {load
                ? <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={true}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
                :<Stack
                    sx={{
                        minWidth: "600px",
                        minHeight: "1200px",
                        backgroundColor: "lightgray",
                        pl: 1,
                        pr: 1
                    }}
                    direction="row"
                    spacing={2}
                    // divider={<Divider orientation="vertical" flexItem />}
                >
                    <DashboardColumn title="New" rows={newTasks} updateTasks={updateTasks}/>
                    <DashboardColumn title="Ready to go" rows={readyTasks} updateTasks={updateTasks}/>
                    <DashboardColumn title="In progress" rows={inProgressTasks} updateTasks={updateTasks}/>
                    <DashboardColumn title="Complete" rows={completeTasks} updateTasks={updateTasks}/>
                </Stack>
            }
            {openAddDialog
                ?<AddTaskDialog updateTasks={updateTasks} openAddDialog={openAddDialog} setOpenAddDialog={setOpenAddDialog}/>
                :<></>
            }
        </>
    );
}