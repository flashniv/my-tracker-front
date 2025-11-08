import { Fragment, useContext, useState } from "react";
import { NotificationContext } from "../../../../../common/NotificationContext";
import API from "../../../../../common/API";
import { Box, Button, ButtonGroup, Grid, IconButton, TextField, Typography } from "@mui/material";
import { Task } from "../../../../../type/Task";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { KanbanTasksContext } from "./KanbanTaskContext";

const cellStyle = {
    p:1,
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid lightgray"
} 

function getTime(task: Task): number {
    let time = 0;

    task.timeRecords?.forEach(timeRecord => {
        if (timeRecord.accountingPeriod.open) {
            time += timeRecord.duration;
        }
    });
    time = time / 60;

    return time;
}

interface KanbanTaskEditDialogTimeRecordsProps {
    task: Task
}

export function KanbanTaskEditDialogTimeRecords(props: KanbanTaskEditDialogTimeRecordsProps) {
    const notificationContext = useContext(NotificationContext);
    const kanbanTasksContext = useContext(KanbanTasksContext);
    const [time, setTime] = useState<string>("30");

    function changeTime(e: React.ChangeEvent) {
        if (("" + e.target.value).match("^[0-9]*$")) {
            setTime(e.target.value);
        }
    }

    function addTime() {
        API.postContent<null, string>("/task/" + props.task.id + "/addTimeRecord?time=" + (parseInt(time) * 60), null)
            .then(data => {
                kanbanTasksContext[1]();
            })
            .catch(error => {
                notificationContext(error.message);
                kanbanTasksContext[1]();
            })
    }
    function deleteTimeRecord(id: number) {
        API.postContent<null, string>("/task/" + props.task.id + "/removeTimeRecord/" + id, null)
            .then(data => {
                kanbanTasksContext[1]();
            })
            .catch(error => {
                notificationContext(error.message);
                kanbanTasksContext[1]();
            })
    }

    return (<>
        <Box sx={{display: "flex", justifyContent: "center" }}>
            <ButtonGroup variant="outlined" aria-label="Basic button group">
                <Button onClick={() => setTime("20")}>20</Button>
                <Button onClick={() => setTime("30")}>30</Button>
                <Button onClick={() => setTime("40")}>40</Button>
                <Button onClick={() => setTime("60")}>60</Button>
                <Button onClick={() => setTime("90")}>90</Button>
                <Button onClick={() => setTime("120")}>120</Button>
                <Button onClick={() => setTime("180")}>180</Button>
            </ButtonGroup>
            <TextField autoComplete="off" label="Time" variant="outlined" sx={{ minWidth: "70px", pl: 1 }} value={time} onChange={changeTime} />
            <IconButton size="large" onClick={addTime}>
                <AddIcon color="success" />
            </IconButton>
        </Box>

        <Grid container
            sx={{ border: "solid lightgrey 1px",mt:1 }}
        >
            {props.task.timeRecords?.filter(value => value.accountingPeriod.open).map(timeRecord =>
                <Fragment key={timeRecord.id}>
                    <Grid size={2} sx={cellStyle}>{timeRecord.duration / 60}</Grid>
                    <Grid size={9} sx={cellStyle}>
                        {new Date(timeRecord.createdOn).toLocaleString()}
                    </Grid>
                    <Grid size={1} sx={cellStyle}>
                        <IconButton sx={{ padding: "1px" }} onClick={() => deleteTimeRecord(timeRecord.id)}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </Grid>
                </Fragment>
            )}
            <Typography p={1} fontWeight={"bold"}>Total:{getTime(props.task)}</Typography>
        </Grid>
    </>
    );
}
