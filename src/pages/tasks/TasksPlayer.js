import React, {useEffect, useState} from "react";
import {Box, Button, IconButton, Snackbar} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import APIServer from "../../API/APIServer";

export default function TasksPlayer({setTaskStatus, row}) {
    const [seconds, setSeconds] = useState(row.seconds)
    const [play, setPlay] = useState(false)
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
        setSeconds(seconds + 1)
    }

    const syncStateToServer = function (newState, sendMessage = true) {
        const response = APIServer.putContent("/api/task/" + row.id + "/updateStatus?newStatus=" + newState, {})
        response.then(() => {
            setTaskStatus(newState)
            if (sendMessage) {
                setSnackMessage("Task status synced!")
                setOpen(true)
            }
        }, () => {
            setSnackMessage("ERROR!!! Task status syncing")
            setOpen(true)
        })
    }

    useEffect(() => {
        if (row.history && row.history.length > 0) {
            if (row.history[0].status.localeCompare("IN_PROGRESS") === 0) {
                setPlay(true)
            }
        }
    }, [])

    useEffect(() => {
        if (play) {
            const interval = setInterval(timer, 1000);
            return () => clearInterval(interval);
        }
    }, [play, seconds]);

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
            {Math.floor(seconds/60)}:{seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60}
            {!play
                ? <IconButton color="primary" aria-label="Play" component="span" onClick={() => {
                    setPlay(true);
                    syncStateToServer("IN_PROGRESS");
                }}>
                    <PlayArrowIcon/>
                </IconButton>
                : <IconButton color="primary" aria-label="Stop" component="span" onClick={() => {
                    setPlay(false);
                    syncStateToServer("ON_PAUSE");
                }}>
                    <StopIcon/>
                </IconButton>
            }
            <Button color="primary" aria-label="Complete" component="span" endIcon={<DoneIcon/>}
                    onClick={() => syncStateToServer("DONE")}>
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