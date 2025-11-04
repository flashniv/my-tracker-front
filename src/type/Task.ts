import { TaskQuadrant } from "./TaskQuadrant";
import { TaskStatus } from "./TaskStatus";
import { TaskType } from "./TaskType";
import { TimeRecord } from "./TimeRecord";

export interface Task {
    id: number | null,
    name: string,
    description: string,
    taskStatus: TaskStatus,
    taskType: TaskType,
    taskQuadrant: TaskQuadrant,
    project: Project | null
    timeRecords: TimeRecord[] | null
}
