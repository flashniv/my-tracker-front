import React, {useEffect, useState} from "react";
import APIServer from "../../API/APIServer";
import {Box} from "@mui/material";

function timeProcess(time){
    const dat=new Date(time)
    return dat.getFullYear()+'-'+dat.getMonth()+'-'+dat.getDay()
}

function SummaryList({tasks}) {

    return (<>
            {tasks.map(task =>
                <Box>
                    <>{task.id};{task.status};{task.project.organization.organizationName};{task.project.projectName};{timeProcess(task.statusChangeAt)};{task.title}</>
                </Box>
            )
            }
        </>
    )
}

export default function Summary({setTitle}) {
    const [alert, setAlert] = useState(<></>)
    const [tasks, setTasks] = useState(undefined)

    setTitle("Summary")

    const onError = function (err) {
        //setAlert(<Alert severity="error">Server return {err.response.status}</Alert>)   //TODO release it
    }

    const updateTasks = function () {
        const response = APIServer.getContent("/api/task/");
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
            {tasks !== undefined
                ? <SummaryList tasks={tasks}/>
                : <Box sx={{m: 3}}>Loading ...</Box>
            }
        </>
    )
}