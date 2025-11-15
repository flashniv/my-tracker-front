import { useContext, useState } from "react";
import { NotificationContext, NotificationContextMessage } from "../../../../../common/NotificationContext";
import API from "../../../../../common/API";
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from "@mui/material";
import { TaskType } from "../../../../../type/TaskType";
import { TaskQuadrant } from "../../../../../type/TaskQuadrant";
import { Task } from "../../../../../type/Task";
import { TaskStatus } from "../../../../../type/TaskStatus";

interface TaskAddDialogProps {
    openDialog: boolean,
    setOpenDialog: (open: boolean) => void,
    updateTasks: () => void,
    projectId: number
}

export default function TaskAddDialog(props: TaskAddDialogProps) {
    const notificationContext = useContext(NotificationContext);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [time, setTime] = useState<string>("30");
    const [taskType, setTaskType] = useState<string>(TaskType.NOT_CLASSIFIED);
    const [taskQuadrant, setTaskQuadrant] = useState<string>(TaskQuadrant.NOT_CLASSIFIED);

    function closeWindow() {
        setName("");
        setDescription("");
        setTime("30");
        setTaskType(TaskType.NOT_CLASSIFIED);
        setTaskQuadrant(TaskQuadrant.NOT_CLASSIFIED);
        props.setOpenDialog(false);
    }

    function saveTask(e: React.FormEvent) {
        e.preventDefault();
        let timeStr = "";
        if (time.length > 0) {
            timeStr = "?time=" + time;
        }

        const newTask: Task = {
            id: null,
            name: name,
            description: description,
            taskType: TaskType[taskType as keyof typeof TaskType],
            taskQuadrant: TaskQuadrant[taskQuadrant as keyof typeof TaskQuadrant],
            taskStatus: TaskStatus.NEW,
            project: null,
            createdOn: new Date(),
            timeRecords: null
        }
        API.postContent<Task, string>("/project/" + props.projectId + "/createTask" + timeStr, newTask)
            .then(() => {
                props.updateTasks();
                closeWindow();
                const alertMessage: NotificationContextMessage = {
                    message: "Done!",
                    severity: "success",
                    duration: 700
                }
                notificationContext(alertMessage);
            })
            .catch((error) => {
                const alertMessage: NotificationContextMessage = {
                    message: error.message,
                    severity: "error",
                    duration: 5000
                }
                notificationContext(alertMessage);
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
            onClose={closeWindow}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <form onSubmit={saveTask}>
                <DialogTitle id="alert-dialog-title">
                    Add task
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <TextField id="outlined-basic" autoComplete="off" label="Task" variant="outlined" fullWidth sx={{ minWidth: "500px" }} value={name} onChange={(e) => setName(e.target.value)} />
                        <TextField id="outlined-basic" label="Description" variant="outlined" fullWidth sx={{ minWidth: "500px" }} multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
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
                        </Box>
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
