import { TaskQuadrant } from "../TaskQuadrant";
import { TaskStatus } from "../TaskStatus";
import { TaskType } from "../TaskType";
import { TimeRecordDTO } from "./TimeRecordDTO";

export interface TaskDTO {
    id: number,
    name: string,
    description: string,
    createdOn: Date,
    taskType: TaskType,
    taskQuadrant: TaskQuadrant,
    taskStatus: TaskStatus,
    timeRecords: TimeRecordDTO[]
}
