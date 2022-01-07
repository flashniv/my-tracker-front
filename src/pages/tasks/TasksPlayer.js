import React, {useEffect, useState} from "react";
import {Box, Button, IconButton, TextField} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DoneIcon from '@mui/icons-material/Done';

export default function TasksPlayer({row}) {
    const [minutes, setMinutes] = useState(row.minutes)
    const [timerId, setTimerId] = useState()

    const timer = () => {
        console.log(row.id)
        row.minutes++
        setMinutes(row.minutes)
    }

    const onPlay = function () {
        if (!timerId) {
            setTimerId(setInterval(timer, 1000))
        }
    }
    const onStop = function () {
        if (timerId) {
            clearInterval(timerId)
            setTimerId(undefined)
        }
    }

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
            {minutes} min
            {timerId === undefined
                ? <IconButton color="primary" aria-label="Play" component="span" onClick={onPlay}>
                    <PlayArrowIcon/>
                </IconButton>
                : <IconButton color="primary" aria-label="Stop" component="span" onClick={onStop}>
                    <StopIcon/>
                </IconButton>
            }
            <Button color="primary" aria-label="Complete" component="span" endIcon={<DoneIcon/>}>
                Complete
            </Button>
        </Box>
    )
}