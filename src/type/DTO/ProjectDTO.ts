import { TaskDTO } from "./TaskDTO";

export interface ProjectDTO {
    id: number,
    name: string,
    createdOn: Date,
    tasks: TaskDTO[]
}