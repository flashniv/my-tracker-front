import { useContext, useEffect, useState } from "react";
import API from "../../../../common/API";
import { ClientDTO } from "../../../../type/DTO/ClientDTO";
import { NotificationContext } from "../../../../common/NotificationContext";
import { Box, Button, Stack } from "@mui/material";
import KanbanColumn from "./component/KanbanColumn";
import { Task } from "../../../../type/Task";
import { TimeRecord } from "../../../../type/TimeRecord";
import { TaskStatus } from "../../../../type/TaskStatus";
import KanbanTaskAddDialog from "./component/KanbanTaskAddDialog";
import { KanbanTasksContext } from "./component/KanbanTaskContext";

interface KanbanDashboardProps {
    setTitle: (title: string) => void
}

export default function KanbanDashboard(props: KanbanDashboardProps) {
    props.setTitle("Kanban");
    const notificationContext = useContext(NotificationContext);
    const [placeHolder, setPlaceHolder] = useState<boolean>(true);
    const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
    const [tasks,setTasks] = useState<Task[]>([]);

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

    return (
        <KanbanTasksContext.Provider value={[tasks,updateTasks]}>
            <Box display={"flex"} justifyContent={"flex-end"} pt={1} pr={1}>
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
