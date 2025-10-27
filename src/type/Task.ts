import { TaskQuadrant } from "./TaskQuadrant";
import { TaskStatus } from "./TaskStatus";
import { TaskType } from "./TaskType";

interface Task {
    id: number | null,
    name: string,
    description: string,
    taskStatus: TaskStatus,
    taskType: TaskType,
    taskQuadrant: TaskQuadrant,
    project: Project | null
}
