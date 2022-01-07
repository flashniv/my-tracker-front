import React, {useEffect, useState} from "react";
import {Box, Button, IconButton, Snackbar} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import APIServer from "../../API/APIServer";

export default function TasksPlayer({setTaskStatus,row}) {
    const [minutes, setMinutes] = useState(row.minutes)
    const [seconds, setSeconds] = useState(0)
    const [play, setPlay] = useState(row.status.localeCompare("IN_PROGRESS") === 0)
    const [snackMessage,setSnackMessage]=useState("")

    //snack
    const [open, setOpen] = useState(false)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    const timer=()=>{
        if(seconds<59){
            setSeconds(seconds+1)
        }else{
            setSeconds(0)
            setMinutes(minutes+1)
            if((minutes+1) % 5 === 0){
                syncMinutesToServer(minutes+1)
            }
        }
    }

    const syncMinutesToServer=function (newMinutes) {
        const response = APIServer.putContent("/api/task/"+row.id+"/updateMinutes?newMinutes="+newMinutes, {})
        response.then(()=>{
            setSnackMessage("Task synced!")
            setOpen(true)
        },()=>{
            setSnackMessage("ERROR!!! Task syncing")
            setOpen(true)
        })
    }
    const syncStateMinutesToServer=function (newStatus,newMinutes) {
        const response = APIServer.putContent("/api/task/"+row.id+"/updateStatusMinutes?newStatus="+newStatus+"&newMinutes="+newMinutes, {})
        response.then(()=>{
            setTaskStatus(newStatus)
            setSnackMessage("Task synced!")
            setOpen(true)
        },()=>{
            setSnackMessage("ERROR!!! Task syncing")
            setOpen(true)
        })
    }

    const syncStateToServer=function (newState,sendMessage=true){
        const response = APIServer.putContent("/api/task/"+row.id+"/updateStatus?newStatus="+newState, {})
        response.then(()=>{
            setTaskStatus(newState)
            if(sendMessage) {
                setSnackMessage("Task status synced!")
                setOpen(true)
            }
        },()=>{
            setSnackMessage("ERROR!!! Task status syncing")
            setOpen(true)
        })
    }

    useEffect(() => {
        if(play){
            const interval = setInterval(timer,200);
            return () => clearInterval(interval);
        }
    }, [play,minutes,seconds]);

    return (
        <Box
            sx={{
                // backgroundColor:'secondary.light',
                p: 1.1,
                fontSize: 'large',
                fontWeight: 'bold',
                textAlign: "right"
            }}
        >
            {minutes}:{seconds<10?'0'+seconds:seconds}
            {!play
                ? <IconButton color="primary" aria-label="Play" component="span" onClick={()=>{setPlay(true); syncStateToServer("IN_PROGRESS"); }}>
                    <PlayArrowIcon/>
                </IconButton>
                : <IconButton color="primary" aria-label="Stop" component="span" onClick={()=>{setPlay(false); syncStateMinutesToServer("ON_PAUSE",minutes);}}>
                    <StopIcon/>
                </IconButton>
            }
            <Button color="primary" aria-label="Complete" component="span" endIcon={<DoneIcon/>} onClick={()=>syncStateToServer("DONE")} >
                Complete
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                message={snackMessage}
                action={action}
            />
        </Box>
    )
}