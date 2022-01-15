import React, {useState} from "react";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

function getTimeAgo(inputDate){
    const startDate=new Date(inputDate)
    const minutesAgo=(Date.now()-startDate)/60000
    if(minutesAgo<3){
        return "just now"
    }else if(minutesAgo<7){
        return "a few minutes"
    }else if(minutesAgo<10){
        return "less 10 minutes"
    }else if(minutesAgo<30){
        return "less 30 minutes"
    }else if(minutesAgo<60){
        return "less an hour"
    }else if(minutesAgo<120){
        return "less an 2 hours"
    }else if(minutesAgo<360){
        return "less an 6 hours"
    }else if(minutesAgo<720){
        return "less an 12 hours"
    }else if(minutesAgo<1440){
        return "today"
    }else if(minutesAgo<2880){
        return "yesterday"
    }else if(minutesAgo<10080){
        return "current week"
    }else if(minutesAgo<43200){
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
    overflowY:"scroll"
};

export default function ViewTaskDialog({task,updateTasks, openViewDialog, setOpenViewDialog}) {
    const [newTitle, setNewTitle] = useState("")
    const [newDesc, setNewDesc] = useState("")

    const [currentOrg, setCurrentOrg] = useState("")
    const [currentProj, setCurrentProj] = useState("")

    console.log(task)

    return(
        <Modal
            open={openViewDialog}
            onClose={() => setOpenViewDialog(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Stack style={style} spacing={2}>
                <Box
                    sx={{
                        fontWeight:"bold"
                    }}
                >
                    {task.title}
                </Box>
                <Box>
                    {task.description}
                </Box>
                <Timeline>
                    {task.history.map((historyItem)=>
                        <TimelineItem
                            key={historyItem.id}
                            sx={{
                                    '&:before': {
                                        content: `"${getTimeAgo(historyItem.timestamp)}"`,
                                        flex: 1,
                                        padding: '6px 16px',
                                    },
                            }}
                        >
                            <TimelineSeparator>
                                <TimelineDot/>
                                <TimelineConnector/>
                            </TimelineSeparator>
                            <TimelineContent
                                sx={{
                                    minWidth:"380px"
                                }}
                            >{"Set status "+historyItem.status}</TimelineContent>
                        </TimelineItem>
                    )}
                </Timeline>
            </Stack>
        </Modal>

    )
}