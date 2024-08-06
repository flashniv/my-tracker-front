import React, {useEffect, useState} from "react";
import {Backdrop, Box, Button, CircularProgress, Stack, TextField} from "@mui/material";
import DashboardColumn from "./DashboardColumn";
import APIServer from "../../API/APIServer";
import AddTaskDialog from "../../components/AddTaskDialog/AddTaskDialog";

export default function Dashboard({setTitle}) {
    const [load, setLoad] = useState(true)
    const [newTasks, setNewTasks] = useState([]);
    const [readyTasks, setReadyTasks] = useState([]);
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [completeTasks, setCompleteTasks] = useState([]);
    const [filter, setFilter] = useState("")

    setTitle("Dashboard")

    //Add dialog
    const [openAddDialog, setOpenAddDialog] = useState(false)

    const onError = function (err) {
        //setAlert(<Alert severity="error">Server return {err.response.status}</Alert>)   //TODO release it
    }

    const updateTasks = function () {
        //setLoad(true)
        const response = APIServer.getContent("/api/task/");
        response.then((value) => {
            setNewTasks(value.data.filter((task) => task.status && task.status.localeCompare("NEW") === 0))
            setInProgressTasks(value.data.filter((task) => task.status && task.status.localeCompare("IN_PROGRESS") === 0))
            setCompleteTasks(value.data.filter((task) => task.status && task.status.localeCompare("DONE") === 0))
            setReadyTasks(value.data.filter((task) => task.status && task.status.localeCompare("ON_PAUSE") === 0))
            setLoad(false)
        }, onError)
    }
    useEffect(() => {
        updateTasks()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const filterFunc = function (task) {
        if (filter.length !== 0) {
            const title = task.project.organization.organizationName.toLowerCase() + ' - ' + task.project.projectName.toLowerCase()
            return title.includes(filter.toLowerCase())
        }
        return true
    }

    return (
        <>
            {load
                ? <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={true}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
                : <>
                    <Box
                        sx={{
                            backgroundColor: "#c7ffc7",
                            display: "flex",
                            justifyContent: "right",
                            mt: 1,
                            ml: 1,
                            mr: 1,
                            pr: 1,
                            pb: 1,
                            pt: 1
                        }}
                    >
                        <TextField
                            variant={"standard"}
                            sx={{width: "400px", mr: 2}}
                            value={filter}
                            onChange={event => setFilter(event.target.value)}
                        />
                        <Button
                            variant={"contained"}
                            onClick={() => setOpenAddDialog(true)}
                        >
                            ADD
                        </Button>
                    </Box>
                    <Stack
                        sx={{
                            // minWidth: "600px",
                            minHeight: "2000px",
                            backgroundColor: "white",
                        }}
                        direction="row"
                        // divider={<Divider orientation="vertical" flexItem />}
                    >
                        <DashboardColumn title="New" rows={newTasks.filter(filterFunc)} updateTasks={updateTasks}/>
                        <DashboardColumn title="Ready to go" rows={readyTasks.filter(filterFunc)}
                                         updateTasks={updateTasks}/>
                        <DashboardColumn title="In progress" rows={inProgressTasks.filter(filterFunc)}
                                         updateTasks={updateTasks}/>
                        <DashboardColumn title="Complete" rows={completeTasks.filter(filterFunc)}
                                         updateTasks={updateTasks}/>
                    </Stack>
                </>
            }
            {openAddDialog
                ? <AddTaskDialog updateTasks={updateTasks} openAddDialog={openAddDialog}
                                 setOpenAddDialog={setOpenAddDialog}/>
                : <></>
            }
        </>
    );
}