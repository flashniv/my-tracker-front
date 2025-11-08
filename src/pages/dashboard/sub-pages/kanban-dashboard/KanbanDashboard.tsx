import { useContext, useEffect, useState } from "react";
import API from "../../../../common/API";
import { ClientDTO } from "../../../../type/DTO/ClientDTO";
import { NotificationContext } from "../../../../common/NotificationContext";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import KanbanColumn from "./component/KanbanColumn";
import { Task } from "../../../../type/Task";
import { TimeRecord } from "../../../../type/TimeRecord";
import { TaskStatus } from "../../../../type/TaskStatus";
import KanbanTaskAddDialog from "./component/KanbanTaskAddDialog";
import { KanbanTasksContext } from "./component/KanbanTaskContext";
import { TaskType } from "../../../../type/TaskType";
import { TaskQuadrant } from "../../../../type/TaskQuadrant";
import ClearIcon from '@mui/icons-material/Clear';

interface KanbanDashboardProps {
    setTitle: (title: string) => void
}

export default function KanbanDashboard(props: KanbanDashboardProps) {
    props.setTitle("Kanban");
    const notificationContext = useContext(NotificationContext);
    const [placeHolder, setPlaceHolder] = useState<boolean>(true);
    const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    //filter
    const [filterTaskType, setFilterTaskType] = useState<string>("null");
    const [filterTaskQuadrant, setFilterTaskQuadrant] = useState<string>("null");
    const [filterText, setFilterText] = useState<string>("");

    function updateTasks() {
        setPlaceHolder(true);
        API.getContent<ClientDTO[]>("/client/all?onlyActual=true")
            .then(data => {
                let tempTasks: Task[] = [];

                data.data.forEach(clientDTO => {
                    const client: Client = {
                        id: clientDTO.id,
                        name: clientDTO.name
                    };
                    clientDTO.projects.forEach(projectDTO => {
                        const project: Project = {
                            id: projectDTO.id,
                            name: projectDTO.name,
                            client: client
                        }
                        projectDTO.tasks.forEach(taskDTO => {
                            let tieRecords: TimeRecord[] = [];
                            taskDTO.timeRecords.forEach(timeRecordDTO => {
                                const timeRecord: TimeRecord = {
                                    id: timeRecordDTO.id,
                                    duration: timeRecordDTO.duration,
                                    createdOn: timeRecordDTO.createdOn,
                                    accountingPeriod: timeRecordDTO.accountingPeriod
                                }
                                tieRecords.push(timeRecord);
                            });

                            const task: Task = {
                                id: taskDTO.id,
                                name: taskDTO.name,
                                description: taskDTO.description,
                                taskType: taskDTO.taskType,
                                taskStatus: taskDTO.taskStatus,
                                taskQuadrant: taskDTO.taskQuadrant,
                                project: project,
                                createdOn: taskDTO.createdOn,
                                timeRecords: tieRecords
                            };
                            tempTasks.push(task);
                        });
                    });
                });
                setTasks(tempTasks);
                setPlaceHolder(false);
            })
            .catch(error => {
                notificationContext(error.message);
                setPlaceHolder(false);
            });
    }

    useEffect(() => {
        updateTasks();
    }, []);

    function changeFilterTaskType(event: string | null) {
        if (event == null) { return; }
        if (event.localeCompare("null") == 0) {
            setFilterTaskType("null");
        } else {
            setFilterTaskType(TaskType[event as keyof typeof TaskType]);
        }
    }
    function changeFilterTaskQuadrant(event: string | null) {
        if (event == null) { return; }
        if (event.localeCompare("null") == 0) {
            setFilterTaskQuadrant("null");
        } else {
            setFilterTaskQuadrant(TaskQuadrant[event as keyof typeof TaskQuadrant]);
        }
    }

    function filterTasks(value: Task): boolean {
        let res = true;
        if (filterTaskType.localeCompare("null") != 0 && value.taskType != filterTaskType) {
            res = false;
        }
        if (filterTaskQuadrant.localeCompare("null") != 0 && value.taskQuadrant != filterTaskQuadrant) {
            res = false;
        }
        if (value.project != null && value.project.client != null){
            if (filterText.localeCompare("") != 0 && !(value.project?.client?.name + value.project?.name).toLowerCase().includes(filterText.toLowerCase())) {
                res = false;
            }
        }
        return res;
    }

    return (
        <KanbanTasksContext.Provider value={[tasks.filter(filterTasks), updateTasks]}>
            <Box display={"flex"} justifyContent={"flex-end"} pt={1} pr={1}>
                <TextField label="Search" variant="standard" value={filterText} onChange={e => setFilterText(e.target.value)} />
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-simple-select-standard-label1">Quadrant</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label1"
                        id="demo-simple-select-standard1"
                        value={filterTaskQuadrant}
                        onChange={(e) => { changeFilterTaskQuadrant(e.target.value) }}
                        label="Quadrant"
                    >
                        <MenuItem value="null">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={TaskQuadrant.NOT_CLASSIFIED}>Not classified</MenuItem>
                        <MenuItem value={TaskQuadrant.URGENT_IMPORTANT}>Emergency</MenuItem>
                        <MenuItem value={TaskQuadrant.NO_URGENT_IMPORTANT}>Important</MenuItem>
                        <MenuItem value={TaskQuadrant.URGENT_NO_IMPORTANT}>Urgent</MenuItem>
                        <MenuItem value={TaskQuadrant.NO_URGENT_NO_IMPORTANT}>Spam</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={filterTaskType}
                        onChange={(e) => { changeFilterTaskType(e.target.value) }}
                        label="Type"
                    >
                        <MenuItem value="null">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={TaskType.NOT_CLASSIFIED}>Not classified</MenuItem>
                        <MenuItem value={TaskType.MICRO}>Micro</MenuItem>
                        <MenuItem value={TaskType.SMALL}>Small</MenuItem>
                        <MenuItem value={TaskType.MEDIUM}>Medium</MenuItem>
                        <MenuItem value={TaskType.LONG}>Long</MenuItem>
                        <MenuItem value={TaskType.EXTRA_LONG}>Extra long</MenuItem>
                    </Select>
                </FormControl>
                <IconButton onClick={()=>{setFilterText(""); setFilterTaskType("null"); setFilterTaskQuadrant("null");}}>
                    <ClearIcon/>
                </IconButton>
                <Button variant="contained" onClick={() => setOpenAddDialog(true)}>Add</Button>
            </Box>
            <Stack
                minHeight={"4000px"}
                direction="row"
                spacing={1}
                justifyContent={"space-around"}
                p={1}
            >
                <KanbanColumn title="New" taskStatus={TaskStatus.NEW} loading={placeHolder} />
                <KanbanColumn title="In progress" taskStatus={TaskStatus.IN_PROGRESS} loading={placeHolder} />
                <KanbanColumn title="Block" taskStatus={TaskStatus.BLOCKED} loading={placeHolder} />
                <KanbanColumn title="Done" taskStatus={TaskStatus.DONE} loading={placeHolder} />
            </Stack>
            <KanbanTaskAddDialog openDialog={openAddDialog} setOpenDialog={setOpenAddDialog} updateTasks={updateTasks} />
        </KanbanTasksContext.Provider>);
}
