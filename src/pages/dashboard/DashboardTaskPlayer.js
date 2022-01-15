import React, {useEffect, useState} from "react";
import {Box, IconButton} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DoneIcon from '@mui/icons-material/Done';
import APIServer from "../../API/APIServer";

export default function DashboardTaskPlayer({row,updateTasks}) {
    const [seconds, setSeconds] = useState(row.seconds)
    const [play, setPlay] = useState(row.status.localeCompare("IN_PROGRESS") === 0)

    const timer = () => {
        setSeconds(seconds + 1)
    }

    const syncStateToServer = function (newState, sendMessage = true) {
        const response = APIServer.putContent("/api/task/" + row.id + "/updateStatus?newStatus=" + newState, {})
        response.then(() => {
            updateTasks()
        }, () => {

        })
    }

    useEffect(() => {
        if (play) {
            const interval = setInterval(timer, 1000);
            return () => clearInterval(interval);
        }
    }, [play, seconds]);

    return (
        <Box
            sx={{
                display:"inline-block"
            }}
        >
            {Math.floor(seconds/60)}:{seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60}
            {!play
                ? <IconButton size="small" color="primary" aria-label="Play" component="span" onClick={() => {
                    setPlay(true);
                    syncStateToServer("IN_PROGRESS");
                }}>
                    <PlayArrowIcon fontSize="inherit" />
                </IconButton>
                : <IconButton size="small" color="primary" aria-label="Stop" component="span" onClick={() => {
                    setPlay(false);
                    syncStateToServer("ON_PAUSE");
                }}>
                    <StopIcon fontSize="inherit" />
                </IconButton>
            }
            <IconButton size="small" color="primary" aria-label="Stop" component="span"
                onClick={() => { setPlay(false); syncStateToServer("DONE");}}>
                <DoneIcon fontSize="inherit" />
            </IconButton>
        </Box>
    )
}