import { useContext, useEffect, useState } from "react";
import API from "../../../../common/API";
import { ClientDTO } from "../../../../type/DTO/ClientDTO";
import { NotificationContext } from "../../../../common/NotificationContext";
import { Box, Stack } from "@mui/material";
import KanbanColumn from "./component/KanbanColumn";
import { Task } from "../../../../type/Task";
import { TimeRecord } from "../../../../type/TimeRecord";
import { TaskStatus } from "../../../../type/TaskStatus";

interface KanbanDashboardProps {
    setTitle: (title: string) => void
}

export default function KanbanDashboard(props: KanbanDashboardProps) {
    props.setTitle("Kanban");
    const notificationContext = useContext(NotificationContext);
    const [placeHolder, setPlaceHolder] = useState<boolean>(true);
    const [newTasks, setNewTasks] = useState<Task[]>([]);
    const [inProgTasks, setInProgTasks] = useState<Task[]>([]);
    const [blockTasks, setBlockTasks] = useState<Task[]>([]);
    const [doneTasks, setDoneTasks] = useState<Task[]>([]);

    function updateTasks() {
        setPlaceHolder(true);
        API.getContent<ClientDTO[]>("/client/all?onlyActual=true")
            .then(data => {
                let tempNewTasks:Task[]=[];
                let tempBlockTasks:Task[]=[];
                let tempInProgressTasks:Task[]=[];
                let tempDoneTasks:Task[]=[];
                
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
                            switch (task.taskStatus) {
                                case TaskStatus.NEW:
                                    tempNewTasks.push(task);
                                    break;
                                case TaskStatus.IN_PROGRESS:
                                    tempInProgressTasks.push(task);
                                    break;
                                case TaskStatus.BLOCKED:
                                    tempBlockTasks.push(task);
                                    break;
                                case TaskStatus.DONE:
                                    tempDoneTasks.push(task);
                                    break;
                            }
                        });
                    });
                });
                setNewTasks(tempNewTasks);
                setInProgTasks(tempInProgressTasks);
                setBlockTasks(tempBlockTasks);
                setDoneTasks(tempDoneTasks);
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
        <Stack
            minHeight={"4000px"}
            direction="row"
            spacing={1}
            justifyContent={"space-around"}
            p={1}
        >
            <KanbanColumn title="New" tasks={newTasks} loading={placeHolder}/>
            <KanbanColumn title="In progress" tasks={inProgTasks} loading={placeHolder}/>
            <KanbanColumn title="Block" tasks={blockTasks} loading={placeHolder}/>
            <KanbanColumn title="Done" tasks={doneTasks} loading={placeHolder}/>
        </Stack>
    );
}