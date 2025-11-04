import { useContext, useEffect, useState } from "react";
import API from "../../../../common/API";
import { ClientDTO } from "../../../../type/DTO/ClientDTO";
import { NotificationContext } from "../../../../common/NotificationContext";
import { Box, Stack } from "@mui/material";
import KanbanColumn from "./component/KanbanColumn";
import { Task } from "../../../../type/Task";

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
                            const task: Task = {
                                id: taskDTO.id,
                                name: taskDTO.name,
                                description: taskDTO.description,
                                taskType: taskDTO.taskType,
                                taskStatus: taskDTO.taskStatus,
                                taskQuadrant: taskDTO.taskQuadrant,
                                project: project
                            }
                            taskDTO.timeRecords.forEach(timeRecord => {
                                const 
                            });
                        });
                    });
                });
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
            <KanbanColumn title="New" tasks={newTasks} />
            <KanbanColumn title="In progress" tasks={inProgTasks} />
            <KanbanColumn title="Block" tasks={blockTasks} />
            <KanbanColumn title="Done" tasks={doneTasks} />
        </Stack>
    );
}