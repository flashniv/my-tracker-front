import React, {useEffect, useState} from "react";
import {Box, Button, IconButton, Snackbar} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import APIServer from "../../API/APIServer";

export default function TasksPlayer({updateTasks, row}) {
    const [seconds, setSeconds] = useState(0)
    const [snackMessage, setSnackMessage] = useState("")

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
                <CloseIcon fontSize="small"/>
            </IconButton>
        </React.Fragment>
    );

    const timer = () => {
        let addSeconds=0
        if(row.isPlay!=null) {
            const startDate = new Date(row.isPlay)
            addSeconds=Math.floor((Date.now() - startDate) / 1000)
        }
        setSeconds(addSeconds+row.seconds)
    }

    const start = () => {
        const response = APIServer.putContent("/api/task/" + row.id + "/startPeriod", {})
        response.then(() => {
            setSnackMessage("Task status synced!")
            setOpen(true)
            updateTasks()
        }, () => {
            setSnackMessage("ERROR!!! Task status syncing")
            setOpen(true)
        })
    }
    const pause = () => {
        const response = APIServer.putContent("/api/task/" + row.id + "/stopPeriod", {})
        response.then(() => {
            setSnackMessage("Task status synced!")
            setOpen(true)
            updateTasks()
        }, () => {
            setSnackMessage("ERROR!!! Task status syncing")
            setOpen(true)
        })
    }
    const complete = () => {
        let uri="/api/task/" + row.id + "/stopPeriod?newStatus=DONE"
        if (row.isPlay==null){
            uri="/api/task/" + row.id + "/updateStatus?newStatus=DONE"
        }
        const response = APIServer.putContent(uri, {})
        response.then(() => {
            setSnackMessage("Task status synced!")
            setOpen(true)
            updateTasks()
        }, () => {
            setSnackMessage("ERROR!!! Task status syncing")
            setOpen(true)
        })
    }

    useEffect(() => {
        timer()
        const interval = setInterval(timer, 1000);
        return () => clearInterval(interval);
    }, [row]);

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
            {Math.floor(seconds / 60)}:{seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60}
            {row.isPlay === undefined
                ? <IconButton color="primary" aria-label="Play" component="span" onClick={() => {
                    start()
                }}>
                    <PlayArrowIcon/>
                </IconButton>
                : <IconButton color="primary" aria-label="Stop" component="span" onClick={() => {
                    pause()
                }}>
                    <StopIcon/>
                </IconButton>
            }
            <Button color="primary" aria-label="Complete" component="span" endIcon={<DoneIcon/>}
                    onClick={() => complete()}>
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