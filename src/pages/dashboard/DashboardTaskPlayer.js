import React, {useEffect, useState} from "react";
import {Box, IconButton} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DoneIcon from '@mui/icons-material/Done';
import APIServer from "../../API/APIServer";

export default function DashboardTaskPlayer({row,updateTasks}) {
    const [seconds, setSeconds] = useState()

    const start = () => {
        const response = APIServer.putContent("/api/task/" + row.id + "/startPeriod", {})
        response.then(() => {
            updateTasks()
        }, () => {
        })
    }
    const pause = () => {
        const response = APIServer.putContent("/api/task/" + row.id + "/stopPeriod", {})
        response.then(() => {
            updateTasks()
        }, () => {
        })
    }
    const complete = () => {
        let uri="/api/task/" + row.id + "/stopPeriod?newStatus=DONE"
        if (row.isPlay==null){
            uri="/api/task/" + row.id + "/updateStatus?newStatus=DONE"
        }
        const response = APIServer.putContent(uri, {})
        response.then(() => {
            updateTasks()
        }, () => {
        })
    }

    const timer = () => {
        let addSeconds=0
        if(row.isPlay!=null) {
            const startDate = new Date(row.isPlay)
            addSeconds=Math.floor((Date.now() - startDate) / 1000)
        }
        setSeconds(addSeconds+row.seconds)
    }

    useEffect(() => {
        timer()
        const interval = setInterval(timer, 1000);
        return () => clearInterval(interval);
    }, [row]);

    return (
        <Box
            sx={{
                display:"inline-block"
            }}
        >
            {Math.floor(seconds/60)}:{seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60}
            {row.isPlay === undefined
                ? <IconButton size="small" color="primary" aria-label="Play" component="span" onClick={() => {
                    start()
                }}>
                    <PlayArrowIcon fontSize="inherit" />
                </IconButton>
                : <IconButton size="small" color="primary" aria-label="Stop" component="span" onClick={() => {
                    pause()
                }}>
                    <StopIcon fontSize="inherit" />
                </IconButton>
            }
            <IconButton size="small" color="primary" aria-label="Stop" component="span"
                onClick={() => {
                    complete()
                }}>
                <DoneIcon fontSize="inherit" />
            </IconButton>
        </Box>
    )
}