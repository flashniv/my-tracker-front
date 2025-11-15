import { useContext, useEffect, useState } from "react";
import { NotificationContext, NotificationContextMessage } from "../../../../../common/NotificationContext";
import API from "../../../../../common/API";
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, TextField } from "@mui/material";
import { TaskType } from "../../../../../type/TaskType";
import { TaskQuadrant } from "../../../../../type/TaskQuadrant";
import { Task } from "../../../../../type/Task";
import { TaskStatus } from "../../../../../type/TaskStatus";
import { ClientDTO } from "../../../../../type/DTO/ClientDTO";
import { ProjectDTO } from "../../../../../type/DTO/ProjectDTO";

interface KanbanTaskAddDialogProps {
    openDialog: boolean,
    setOpenDialog: (open: boolean) => void,
    updateTasks: () => void,
}

function getProjectsByClient(clients: ClientDTO[], clientId: number): ProjectDTO[] {
    let resProjects: ProjectDTO[] = [];
    clients.forEach(client => {
        if (client.id === clientId) {
            resProjects = client.projects;
        }
    });
    return resProjects;
}

function sortFunc(a: ProjectDTO, b: ProjectDTO): number {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

export default function KanbanTaskAddDialog(props: KanbanTaskAddDialogProps) {
    const notificationContext = useContext(NotificationContext);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [taskType, setTaskType] = useState<string>(TaskType.NOT_CLASSIFIED);
    const [taskQuadrant, setTaskQuadrant] = useState<string>(TaskQuadrant.NOT_CLASSIFIED);

    const [clients, setClients] = useState<ClientDTO[]>([]);
    const [clientId, setClientId] = useState<number>(-1);
    const [projectId, setProjectId] = useState<number>(-1);

    function updateClients() {
        API.getContent<ClientDTO[]>("/client/dto")
            .then(data => {
                setClients(data.data);
            }).catch(error => {
                const alertMessage: NotificationContextMessage = {
                    message: error.message,
                    severity: "error",
                    duration: 5000
                }
                notificationContext(alertMessage);
            });
    }

    function closeWindow() {
        setName("");
        setDescription("");
        setTime("");
        setTaskType(TaskType.NOT_CLASSIFIED);
        setTaskQuadrant(TaskQuadrant.NOT_CLASSIFIED);
        setClientId(-1);
        setProjectId(-1);
        props.setOpenDialog(false);
    }

    function saveTask(e: React.FormEvent) {
        e.preventDefault();
        let timeStr = "";
        if (time.length > 0) {
            timeStr = "?time=" + (parseInt(time) * 60);
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
        API.postContent<Task, string>("/project/" + projectId + "/createTask" + timeStr, newTask)
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

    function changeClient(event: Event) {
        setClientId(event.target?.value);
        setProjectId(-1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(updateClients, []);

    return (
        <Dialog
            open={props.openDialog}
            onClose={closeWindow}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="lg"
        >
            <form onSubmit={saveTask}>
                <DialogContent>
                    <Stack spacing={2}>
                        <Box display={"flex"} flexDirection={"row"}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Client</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={clientId}
                                    label="Client"
                                    onChange={changeClient}
                                >
                                    {clients.map((client) =>
                                        <MenuItem key={client.id} value={client.id}>{client.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{ pl: 2 }}>
                                <InputLabel id="demo-simple-select-label">Project</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={projectId}
                                    label="Project"
                                    onChange={(event) => { setProjectId(event.target.value) }}
                                >
                                    {getProjectsByClient(clients, clientId).sort(sortFunc).map((project) =>
                                        <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>

                        </Box>
                        <TextField id="outlined-basic" autoComplete="off" label="Task" variant="outlined" fullWidth sx={{ minWidth: "500px" }} value={name} onChange={(e) => setName(e.target.value)} />
                        <TextField id="outlined-basic" label="Description" variant="outlined" fullWidth sx={{ minWidth: "500px" }} multiline rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
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
                    <Button autoFocus type="submit" disabled={clientId === -1 || projectId === -1 || name.length === 0}>
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
