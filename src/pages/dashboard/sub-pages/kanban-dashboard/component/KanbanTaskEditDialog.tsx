import { useContext, useState } from "react";
import { NotificationContext } from "../../../../../common/NotificationContext";
import API from "../../../../../common/API";
import { Button, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from "@mui/material";
import { TaskType } from "../../../../../type/TaskType";
import { TaskQuadrant } from "../../../../../type/TaskQuadrant";
import { Task } from "../../../../../type/Task";
import { KanbanTasksContext } from "./KanbanTaskContext";
import { KanbanTaskEditDialogTimeRecords } from "./KanbanTaskEditDialogTimeRecords";

interface KanbanTaskEditDialogProps {
    openDialog: boolean,
    setOpenDialog: (open: boolean) => void,
    task: Task
}

export default function KanbanTaskEditDialog(props: KanbanTaskEditDialogProps) {
    const notificationContext = useContext(NotificationContext);
    const [name, setName] = useState<string>(props.task.name);
    const [description, setDescription] = useState<string>(props.task.description);
    const [taskType, setTaskType] = useState<string>(props.task.taskType);
    const [taskQuadrant, setTaskQuadrant] = useState<string>(props.task.taskQuadrant);
    const kanbanTasksContext = useContext(KanbanTasksContext);

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
                kanbanTasksContext[1]();
                closeWindow();
            })
            .catch((error) => {
                notificationContext(error.message);
                kanbanTasksContext[1]();
                closeWindow();
            });
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
                            <KanbanTaskEditDialogTimeRecords task={props.task} />
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
