import { useContext, useState } from "react";
import { NotificationContext } from "../../../../../common/NotificationContext";
import API from "../../../../../common/API";
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { TaskType } from "../../../../../type/TaskType";
import { TaskQuadrant } from "../../../../../type/TaskQuadrant";
import { Task } from "../../../../../type/Task";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function getTime(task: Task): number {
    let time = 0;

    task.timeRecords?.forEach(timeRecord => {
        if (timeRecord.accountingPeriod.open) {
            time += timeRecord.duration;
        }
    });

    return time;
}

interface TaskEditDialogTimeRecordsProps {
    task: Task
}

function TaskEditDialogTimeRecords(props: TaskEditDialogTimeRecordsProps) {
    return (
        <Stack>
            {props.task.timeRecords?.filter(value => value.accountingPeriod.open).map(timeRecord =>
                <Box
                    key={timeRecord.id}
                    display={"flex"}
                    justifyContent={"space-between"}
                    p={1}
                    borderBottom={"solid lightgrey 1px"}
                >
                    <Box>{timeRecord.duration}</Box>
                    <Box>
                        {new Date(timeRecord.createdOn).toLocaleString()}
                        <IconButton sx={{ padding: "1px" }}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </Box>
                </Box>
            )}
            <Typography p={1} fontWeight={"bold"}>Total:{getTime(props.task)}</Typography>
        </Stack>
    );
}

interface TaskEditDialogProps {
    openDialog: boolean,
    setOpenDialog: (open: boolean) => void,
    updateTasks: () => void,
    task: Task
}

export default function TaskEditDialog(props: TaskEditDialogProps) {
    const notificationContext = useContext(NotificationContext);
    const [name, setName] = useState<string>(props.task.name);
    const [description, setDescription] = useState<string>(props.task.description);
    const [time, setTime] = useState<string>("");
    const [taskType, setTaskType] = useState<string>(props.task.taskType);
    const [taskQuadrant, setTaskQuadrant] = useState<string>(props.task.taskQuadrant);

    function closeWindow() {
        props.setOpenDialog(false);
    }

    function saveTask(e: React.FormEvent) {
        e.preventDefault();
        /*let timeStr = "";
        if (time.length > 0) {
            timeStr = "?time=" + time;
        }*/

        const newTask: Task = {
            id: props.task.id,
            name: name,
            description: description,
            taskType: TaskType[taskType as keyof typeof TaskType],
            taskQuadrant: TaskQuadrant[taskQuadrant as keyof typeof TaskQuadrant],
            taskStatus: props.task.taskStatus,
            project: props.task.project,
            timeRecords: null
        }
        API.putContent<Task, string>("/task", newTask)
            .then(() => {
                props.updateTasks();
                closeWindow();
            })
            .catch((error) => {
                notificationContext(error.message);
                props.updateTasks();
                closeWindow();
            });
    }

    function changeTime(e: React.ChangeEvent) {
        if (("" + e.target.value).match("^[0-9]*$")) {
            setTime(e.target.value);
        }
    }

    return (
        <Dialog
            open={props.openDialog}
            onClose={() => props.setOpenDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={"lg"}
        >
            <form onSubmit={saveTask}>
                <DialogContent>
                    <Stack spacing={2}>
                        <TextField id="outlined-basic" autoComplete="off" label="Task" variant="outlined" fullWidth sx={{ minWidth: "500px" }} value={name} onChange={(e) => setName(e.target.value)} />
                        <TextField id="outlined-basic" label="Description" variant="outlined" fullWidth sx={{ minWidth: "500px" }} multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                        <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">Duration</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={taskType}
                                onChange={(e) => { setTaskType((e.target as HTMLInputElement).value) }}
                            >
                                <FormControlLabel value="MICRO" control={<Radio />} label="Micro" />
                                <FormControlLabel value="SMALL" control={<Radio />} label="Small" />
                                <FormControlLabel value="MEDIUM" control={<Radio />} label="Medium" />
                                <FormControlLabel value="LONG" control={<Radio />} label="Long" />
                                <FormControlLabel value="EXTRA_LONG" control={<Radio />} label="XLong" />
                                <FormControlLabel value="NOT_CLASSIFIED" control={<Radio />} label="Not classified" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">Quadrant</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={taskQuadrant}
                                onChange={(e) => { setTaskQuadrant((e.target as HTMLInputElement).value) }}
                            >
                                <FormControlLabel value="URGENT_IMPORTANT" control={<Radio />} label="Emergency" />
                                <FormControlLabel value="NO_URGENT_IMPORTANT" control={<Radio />} label="Important" />
                                <FormControlLabel value="URGENT_NO_IMPORTANT" control={<Radio />} label="Urgent" />
                                <FormControlLabel value="NO_URGENT_NO_IMPORTANT" control={<Radio />} label="Spam" />
                                <FormControlLabel value="NOT_CLASSIFIED" control={<Radio />} label="Not classified" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">Time records</FormLabel>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                                <IconButton size="large">
                                    <AddIcon color="success" />
                                </IconButton>
                            </Box>
                            <TaskEditDialogTimeRecords task={props.task} />
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeWindow}>Cancel</Button>
                    <Button autoFocus type="submit">
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
