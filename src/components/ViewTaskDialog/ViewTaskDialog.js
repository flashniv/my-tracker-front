import React from "react";
import {Box, Modal, Stack} from "@mui/material";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import PauseIcon from "@mui/icons-material/Pause";
import CachedIcon from "@mui/icons-material/Cached";
import CheckIcon from "@mui/icons-material/Check";

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
                        fontWeight: "bold"
                    }}
                >
                    {getStatusIcon(task.status)}{"  " + task.title}
                </Box>
                <Box>
                    {"Organization: " +task.project.organization.organizationName}
                    {"   Project: " +task.project.projectName}
                </Box>
                <Box>
                    {task.description}
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