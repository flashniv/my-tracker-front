import React, {useState} from "react";
import {Box, IconButton, Modal, Stack, TextField, Typography} from "@mui/material";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import PauseIcon from "@mui/icons-material/Pause";
import CachedIcon from "@mui/icons-material/Cached";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from '@mui/icons-material/Save';
import APIServer from "../../API/APIServer";

function getTime(row) {
    let addSeconds=0
    if(row.isPlay!=null) {
        const startDate = new Date(row.isPlay)
        addSeconds=Math.floor((Date.now() - startDate) / 1000)
    }
    addSeconds+=row.seconds
    return (Math.floor(addSeconds/60)) + ':' + (addSeconds % 60 < 10 ? '0' + (addSeconds % 60) : addSeconds % 60)
}

function getSeconds(time) {
    const [all,min,sec]=time.match('([0-9]+):([0-9][0-9])')
    return parseInt(min)*60+parseInt(sec);
}

const getStatusIcon = function (status) {
    switch (status) {
        case "NEW":
            return (<NewReleasesIcon/>)
        case "ON_PAUSE":
            return (<PauseIcon/>)
        case "IN_PROGRESS":
            return (<CachedIcon/>)
        case "DONE":
            return (<CheckIcon/>)
        default:
            return (<>status</>)
    }
}

function getTimeAgo(inputDate) {
    const startDate = new Date(inputDate)
    const minutesAgo = (Date.now() - startDate) / 60000
    if (minutesAgo < 3) {
        return "just now"
    } else if (minutesAgo < 7) {
        return "a few minutes"
    } else if (minutesAgo < 10) {
        return "less 10 minutes"
    } else if (minutesAgo < 30) {
        return "less 30 minutes"
    } else if (minutesAgo < 60) {
        return "less an hour"
    } else if (minutesAgo < 120) {
        return "less an 2 hours"
    } else if (minutesAgo < 360) {
        return "less an 6 hours"
    } else if (minutesAgo < 720) {
        return "less an 12 hours"
    } else if (minutesAgo < 1440) {
        return "today"
    } else if (minutesAgo < 2880) {
        return "yesterday"
    } else if (minutesAgo < 10080) {
        return "current week"
    } else if (minutesAgo < 43200) {
        return "current month"
    }
    return "too old"
}

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
    maxHeight: '600px',
    overflowY: "scroll"
};

export default function ViewTaskDialog({task, updateTasks, openViewDialog, setOpenViewDialog}) {
    const [showSave,setShowSave]=useState(false)
    const [showTimeSave,setShowTimeSave]=useState(false)
    const [time,setTime]=useState(getTime(task))
    const [title,setTitle]=useState(task.title)
    const [desc,setDesc]=useState(task.description)

    const editTitle=function (e) {
        setTitle(e.target.value)
        setShowSave(true)
    }
    const editTime=function (e) {
        if (e.target.value.match('^[0-9]+:[0-9][0-9]$')){
            setTime(e.target.value)
            setShowTimeSave(true)
        }else{
            return false;
        }
    }
    const editDesc=function (e) {
        setDesc(e.target.value)
        setShowSave(true)
    }
    const saveTask=function () {
        const updTask={
            "project": task.project,
            "title": title,
            "description": desc
        }
        const response=APIServer.putContent("/api/task/" + task.id,updTask)
        response.then((data)=>{
            updateTasks()
        },()=>{

        })
    }
    const saveTaskTime=function () {
        const response=APIServer.putContent("/api/task/" + task.id+"/resetPeriod?newSeconds="+getSeconds(time), {})
        response.then((data)=>{
            updateTasks()
        },()=>{

        })
    }

    return (
        <Modal
            open={openViewDialog}
            onClose={() => setOpenViewDialog(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Stack style={style} spacing={2}>
                <Box
                    sx={{
                        display: 'flex',
                    }}
                >
                    {getStatusIcon(task.status)}
                    <input
                        type="text"
                        style={{
                            fontSize: 'larger',
                            border: 'none transparent',
                            outline: 'none',
                            marginLeft: '5px',
                            width: '100%'
                        }}
                        value={title}
                        onChange={editTitle}
                    />
                    {showSave
                        ?<IconButton size="small" onClick={saveTask}>
                            <SaveIcon fontSize="inherit"/>
                        </IconButton>
                        :<></>
                    }
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                display: 'inline-block',
                                border: '1px solid gray',
                                color: 'secondary.contrastText',
                                backgroundColor: 'secondary.main',
                                textTransform: 'uppercase',
                                pt: 0.2,
                                //pb:0.2,
                                pl: 1.5,
                                pr: 1.5
                            }}
                        >
                            {task.project.organization.organizationName}
                        </Typography>
                        <Typography
                            sx={{
                                display: 'inline-block',
                                border: '1px solid gray',
                                color: 'primary.contrastText',
                                backgroundColor: 'primary.main',
                                //textTransform:'uppercase',
                                pt: 0.2,
                                //pb:0.2,
                                pl: 1.5,
                                pr: 1.5,
                                ml: 1.5
                            }}
                        >
                            {task.project.projectName}
                        </Typography>
                    </Box>
                    <input
                        type="text"
                        style={{
                            fontSize: 'larger',
                            border: 'none transparent',
                            outline: 'none',
                            marginLeft: '5px',
                            textAlign:"right"
                        }}
                        value={time}
                        onChange={editTime}
                    />
                    {showTimeSave
                        ?<IconButton size="small" onClick={saveTaskTime}>
                            <SaveIcon fontSize="inherit"/>
                        </IconButton>
                        :<></>
                    }
                </Box>
                <Box>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Description"
                        sx={{
                            width: '100%'
                        }}
                        multiline
                        rows={7}
                        value={desc}
                        onChange={editDesc}
                    />
                </Box>
                {/*<Timeline>*/}
                {/*    {task.history.map((historyItem)=>*/}
                {/*        <TimelineItem*/}
                {/*            key={historyItem.id}*/}
                {/*            sx={{*/}
                {/*                    '&:before': {*/}
                {/*                        content: `"${getTimeAgo(historyItem.timestamp)}"`,*/}
                {/*                        flex: 1,*/}
                {/*                        padding: '6px 16px',*/}
                {/*                    },*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            <TimelineSeparator>*/}
                {/*                <TimelineDot/>*/}
                {/*                <TimelineConnector/>*/}
                {/*            </TimelineSeparator>*/}
                {/*            <TimelineContent*/}
                {/*                sx={{*/}
                {/*                    minWidth:"380px"*/}
                {/*                }}*/}
                {/*            >{"Set status "+historyItem.status}</TimelineContent>*/}
                {/*        </TimelineItem>*/}
                {/*    )}*/}
                {/*</Timeline>*/}
            </Stack>
        </Modal>

    )
}